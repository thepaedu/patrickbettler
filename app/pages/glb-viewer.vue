<script setup>
useHead({
  title: 'GLB-Viewer – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'GLB-Modelle (glTF) direkt im Browser ansehen: mit Materialien, Texturen und Animationen. Die Datei verlässt deinen Computer nicht.',
    },
  ],
})

// Pfad zu den Draco-Decoder-Dateien in public/draco/ (für komprimierte Modelle).
// Muss hier im Setup berechnet werden, weil withBase die Runtime-Config braucht.
const dracoPath = withBase('/draco/')

// ---------------------------------------------------------------------------
// Zustand (nur einfache Werte reaktiv – three.js-Objekte bewusst NICHT)
// ---------------------------------------------------------------------------

const viewerRef = ref(null)
const hasModel = ref(false)
const busy = ref(false)
const dragging = ref(false)
const error = ref('')
const fileInfo = ref(null)

const wireframe = ref(false)
const autoRotate = ref(false)
const showGrid = ref(true)

// Animationen
const clips = ref([]) // Namen der Animationen
const activeClip = ref(0)
const playing = ref(true)

// three.js-Instanzen
let THREE, GLTFLoader, DRACOLoader, MeshoptDecoder, OrbitControls, RoomEnvironment
let renderer, scene, camera, controls, model, grid, frameId, resizeObserver, clock
let envTexture, dracoLoader
let mixer, animationClips = [], currentAction
let homePosition = null

// ---------------------------------------------------------------------------
// three.js erst laden, wenn eine Datei kommt (Seite bleibt schlank, und beim
// Vorrendern mit nuxt generate wird kein WebGL-Code ausgeführt).
// ---------------------------------------------------------------------------

async function ensureViewer() {
  if (renderer) return

  THREE = await import('three')
  ;({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'))
  ;({ DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js'))
  ;({ MeshoptDecoder } = await import('three/addons/libs/meshopt_decoder.module.js'))
  ;({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'))
  ;({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js'))

  const el = viewerRef.value

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  // Realistische Darstellung der PBR-Materialien aus glTF
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  // Neutrale "Studio"-Umgebung: liefert Licht und Spiegelungen für
  // metallische/glänzende Materialien, ohne dass ein Hintergrundbild nötig ist.
  const pmrem = new THREE.PMREMGenerator(renderer)
  envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = envTexture
  pmrem.dispose()

  camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.01, 1000)
  scene.add(camera)

  // Zusätzliches Licht an der Kamera, damit auch matte Modelle gut lesbar sind
  const headlight = new THREE.DirectionalLight(0xffffff, 0.8)
  headlight.position.set(1, 1, 2)
  camera.add(headlight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotateSpeed = 1.5

  dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(dracoPath)

  clock = new THREE.Clock()

  resizeObserver = new ResizeObserver(() => {
    const w = el.clientWidth
    const h = el.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(el)

  const animate = () => {
    frameId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    if (mixer && playing.value) mixer.update(delta)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

// ---------------------------------------------------------------------------
// Aufräumen: Geometrien, Materialien und Texturen freigeben
// ---------------------------------------------------------------------------

function disposeObject(root) {
  root.traverse((obj) => {
    if (!obj.isMesh) return
    obj.geometry?.dispose()
    const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of materials) {
      if (!mat) continue
      for (const value of Object.values(mat)) {
        if (value?.isTexture) value.dispose()
      }
      mat.dispose()
    }
  })
}

function removeModel() {
  if (mixer) {
    mixer.stopAllAction()
    mixer.uncacheRoot(model)
    mixer = null
  }
  currentAction = null
  animationClips = []
  clips.value = []

  if (model) {
    scene.remove(model)
    disposeObject(model)
    model = null
  }
  if (grid) {
    scene.remove(grid)
    grid.geometry.dispose()
    grid.material.dispose()
    grid = null
  }
}

// ---------------------------------------------------------------------------
// Modell laden und darstellen
// ---------------------------------------------------------------------------

function collectStats(root) {
  let meshes = 0
  let triangles = 0
  const materials = new Set()
  const textures = new Set()

  root.traverse((obj) => {
    if (!obj.isMesh) return
    meshes++
    const geo = obj.geometry
    triangles += geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of mats) {
      if (!mat) continue
      materials.add(mat)
      for (const value of Object.values(mat)) {
        if (value?.isTexture) textures.add(value)
      }
    }
  })

  return {
    meshes,
    triangles: Math.round(triangles),
    materials: materials.size,
    textures: textures.size,
  }
}

async function loadFile(file) {
  if (!file) return
  const lower = file.name.toLowerCase()
  if (lower.endsWith('.gltf')) {
    error.value =
      '.gltf-Dateien verweisen meist auf weitere Dateien (Texturen, .bin). Bitte exportiere das Modell als .glb – dort steckt alles in einer Datei.'
    return
  }
  if (!lower.endsWith('.glb')) {
    error.value = `„${file.name}“ ist keine GLB-Datei.`
    return
  }

  error.value = ''
  busy.value = true

  try {
    // Container zuerst sichtbar machen, damit three.js seine Grösse kennt
    hasModel.value = true
    await nextTick()
    await ensureViewer()

    const buffer = await file.arrayBuffer()
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.setMeshoptDecoder(MeshoptDecoder)

    let gltf
    try {
      gltf = await loader.parseAsync(buffer, '')
    } catch (e) {
      console.error(e)
      const msg = String(e?.message || e).toLowerCase()
      throw new Error(
        msg.includes('draco')
          ? 'Das Modell ist mit Draco komprimiert, der Decoder konnte aber nicht geladen werden.'
          : 'Die Datei konnte nicht gelesen werden. Ist es eine gültige GLB-Datei?',
      )
    }

    const root = gltf.scene || gltf.scenes?.[0]
    if (!root) throw new Error('Die Datei enthält keine Szene.')

    removeModel()
    model = root

    // Masse vor dem Zentrieren bestimmen (glTF-Einheit ist Meter, Y nach oben)
    const box = new THREE.Box3().setFromObject(model)
    if (box.isEmpty()) throw new Error('Die Datei enthält keine sichtbare Geometrie.')
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Modell in den Ursprung verschieben
    model.position.sub(center)
    scene.add(model)
    applyWireframe(wireframe.value)

    // Boden-Raster direkt unter dem Modell
    const radius = size.length() / 2 || 1
    grid = new THREE.GridHelper(radius * 4, 20, 0x888888, 0x444444)
    grid.material.transparent = true
    grid.material.opacity = 0.35
    grid.position.y = -size.y / 2
    grid.visible = showGrid.value
    scene.add(grid)

    fitCamera(radius)

    // Animationen vorbereiten, die erste direkt abspielen
    animationClips = gltf.animations || []
    clips.value = animationClips.map((c, i) => c.name || `Animation ${i + 1}`)
    if (animationClips.length) {
      mixer = new THREE.AnimationMixer(model)
      activeClip.value = 0
      playing.value = true
      playClip(0)
    }

    fileInfo.value = {
      name: file.name,
      size: file.size,
      dims: { x: size.x, y: size.y, z: size.z },
      animations: animationClips.length,
      ...collectStats(model),
    }
  } catch (e) {
    error.value = e?.message || 'Die Datei konnte nicht geladen werden.'
    if (!model) hasModel.value = false
  } finally {
    busy.value = false
  }
}

// Kamera so setzen, dass das ganze Modell schräg von vorne oben sichtbar ist
function fitCamera(radius) {
  const fov = THREE.MathUtils.degToRad(camera.fov)
  const distance = (radius / Math.sin(fov / 2)) * 1.15

  camera.near = distance / 100
  camera.far = distance * 100
  camera.position.copy(new THREE.Vector3(1, 0.6, 1.2).normalize().multiplyScalar(distance))
  camera.updateProjectionMatrix()

  controls.target.set(0, 0, 0)
  controls.minDistance = radius * 0.1
  controls.maxDistance = distance * 10
  controls.update()

  homePosition = camera.position.clone()
}

function resetView() {
  if (!homePosition) return
  camera.position.copy(homePosition)
  controls.target.set(0, 0, 0)
  controls.update()
}

function applyWireframe(on) {
  model?.traverse((obj) => {
    if (!obj.isMesh) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of mats) if (mat) mat.wireframe = on
  })
}

function playClip(index) {
  if (!mixer || !animationClips[index]) return
  currentAction?.fadeOut(0.3)
  currentAction = mixer.clipAction(animationClips[index]).reset().fadeIn(0.3).play()
}

// ---------------------------------------------------------------------------
// Einstellungen live übernehmen
// ---------------------------------------------------------------------------

watch(wireframe, applyWireframe)
watch(autoRotate, (v) => {
  if (controls) controls.autoRotate = v
})
watch(showGrid, (v) => {
  if (grid) grid.visible = v
})
watch(activeClip, (i) => {
  playing.value = true
  playClip(Number(i))
})

// ---------------------------------------------------------------------------
// Upload
// ---------------------------------------------------------------------------

function onInputChange(event) {
  loadFile(event.target.files?.[0])
  event.target.value = '' // dieselbe Datei erneut wählbar machen
}

function onDrop(event) {
  dragging.value = false
  loadFile(event.dataTransfer?.files?.[0])
}

function onDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) dragging.value = false
}

// ---------------------------------------------------------------------------
// Aufräumen beim Verlassen der Seite (WebGL-Kontexte sind begrenzt)
// ---------------------------------------------------------------------------

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  if (scene) removeModel()
  envTexture?.dispose()
  dracoLoader?.dispose()
  controls?.dispose()
  renderer?.dispose()
  renderer?.domElement.remove()
  renderer = null
})

// ---------------------------------------------------------------------------
// Anzeige
// ---------------------------------------------------------------------------

function formatNumber(n, digits = 2) {
  return n.toLocaleString('de-CH', { maximumFractionDigits: digits })
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${formatNumber(bytes / 1024, 1)} KB`
  return `${formatNumber(bytes / 1024 / 1024, 1)} MB`
}

// glTF rechnet in Metern; kleine Objekte lesbarer in cm anzeigen
function formatLength(m) {
  return m >= 1 ? `${formatNumber(m)} m` : `${formatNumber(m * 100, 1)} cm`
}
</script>

<template>
  <section class="glb container">
    <header class="glb-intro">
      <h1>GLB-Viewer</h1>
      <p>
        Lade ein 3D-Modell im GLB-Format hoch und sieh es dir mit Materialien, Texturen
        und Animationen an. Ziehen zum Drehen, Mausrad oder zwei Finger zum Zoomen,
        Rechtsklick zum Verschieben.
      </p>
      <p class="glb-privacy">
        Die Datei wird nur in deinem Browser geöffnet und nirgends hochgeladen.
      </p>
    </header>

    <label
      class="glass glb-drop"
      :class="{ 'is-dragging': dragging, 'is-busy': busy, 'is-compact': hasModel }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input
        type="file"
        class="glb-file-input"
        accept=".glb,model/gltf-binary"
        @change="onInputChange"
      />
      <span class="glb-drop-title">
        {{
          busy
            ? 'Modell wird geladen …'
            : hasModel
              ? 'Andere GLB-Datei hierher ziehen oder klicken'
              : 'GLB-Datei hierher ziehen'
        }}
      </span>
      <span v-if="!hasModel" class="glb-drop-sub">oder klicken, um eine Datei auszuwählen</span>
    </label>

    <p v-if="error" class="glb-msg glb-error" role="alert">{{ error }}</p>

    <div v-show="hasModel" class="glass glb-panel">
      <div class="glb-toolbar">
        <button type="button" class="glb-btn" @click="resetView">Ansicht zurücksetzen</button>
        <label class="glb-toggle">
          <input v-model="wireframe" type="checkbox" />
          Drahtgitter
        </label>
        <label class="glb-toggle">
          <input v-model="autoRotate" type="checkbox" />
          Automatisch drehen
        </label>
        <label class="glb-toggle">
          <input v-model="showGrid" type="checkbox" />
          Raster
        </label>
      </div>

      <div v-if="clips.length" class="glb-toolbar glb-anim">
        <button type="button" class="glb-btn" @click="playing = !playing">
          {{ playing ? 'Pause' : 'Abspielen' }}
        </button>
        <select
          v-if="clips.length > 1"
          v-model="activeClip"
          class="glb-input"
          aria-label="Animation auswählen"
        >
          <option v-for="(name, i) in clips" :key="i" :value="i">{{ name }}</option>
        </select>
        <span v-else class="glb-anim-name">{{ clips[0] }}</span>
      </div>

      <div ref="viewerRef" class="glb-viewer"></div>

      <dl v-if="fileInfo" class="glb-info">
        <div>
          <dt>Datei</dt>
          <dd>{{ fileInfo.name }} ({{ formatBytes(fileInfo.size) }})</dd>
        </div>
        <div>
          <dt>Abmessungen (B × H × T)</dt>
          <dd>
            {{ formatLength(fileInfo.dims.x) }} × {{ formatLength(fileInfo.dims.y) }} ×
            {{ formatLength(fileInfo.dims.z) }}
          </dd>
        </div>
        <div>
          <dt>Dreiecke</dt>
          <dd>{{ formatNumber(fileInfo.triangles, 0) }}</dd>
        </div>
        <div>
          <dt>Meshes / Materialien / Texturen</dt>
          <dd>{{ fileInfo.meshes }} / {{ fileInfo.materials }} / {{ fileInfo.textures }}</dd>
        </div>
        <div>
          <dt>Animationen</dt>
          <dd>{{ fileInfo.animations || 'keine' }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.glb {
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 4rem;
  display: grid;
  gap: 1.5rem;
}

.glb-intro h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.glb-intro p {
  max-width: 62ch;
  margin: 0 0 0.75rem;
}

.glb-privacy {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.95rem;
}

/* Upload-Feld */
.glb-drop {
  position: relative;
  display: grid;
  place-items: center;
  gap: 0.35rem;
  min-height: 180px;
  padding: 1.5rem;
  text-align: center;
  border: 2px dashed var(--glass-border, rgba(255, 255, 255, 0.25));
  border-radius: var(--radius-lg, 20px);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, min-height 0.2s ease;
}

.glb-drop.is-compact {
  min-height: 0;
  padding: 1rem;
}

.glb-drop:hover,
.glb-drop.is-dragging {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 8%, transparent);
}

.glb-drop:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 3px;
}

.glb-drop.is-busy {
  cursor: progress;
  opacity: 0.7;
}

.glb-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.glb-drop-title {
  font-weight: 600;
}

.glb-drop-sub {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

/* Viewer */
.glb-panel {
  border-radius: var(--radius-lg, 20px);
  padding: 1.25rem;
}

.glb-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-bottom: 1rem;
}

.glb-anim {
  padding-top: 0.75rem;
  border-top: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
}

.glb-anim-name {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

.glb-btn {
  font-size: 0.85rem;
  padding: 0.45rem 0.9rem;
}

.glb-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.glb-input {
  font: inherit;
  font-size: 0.9rem;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  background: var(--glass-bg-strong, rgba(0, 0, 0, 0.2));
  color: inherit;
}

.glb-viewer {
  position: relative;
  width: 100%;
  height: min(65vh, 640px);
  min-height: 320px;
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.25));
  cursor: grab;
}

.glb-viewer:active {
  cursor: grabbing;
}

.glb-viewer :deep(canvas) {
  display: block;
}

/* Infos */
.glb-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem 1.5rem;
  margin: 1.25rem 0 0;
}

.glb-info dt {
  font-size: 0.75rem;
  color: var(--gold, #c9a14a);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.glb-info dd {
  margin: 0.2rem 0 0;
  overflow-wrap: anywhere;
}

.glb-msg {
  margin: 0;
  font-size: 0.85rem;
  color: var(--ink-muted, #9a9a9a);
}

.glb-error {
  color: #e5675a;
}

@media (max-width: 600px) {
  .glb-viewer {
    height: 55vh;
    min-height: 260px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .glb-drop {
    transition: none;
  }
}
</style>
