<script setup>
useHead({
  title: 'STL-Viewer – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'STL-Dateien direkt im Browser ansehen: hochladen, drehen, zoomen. Die Datei verlässt deinen Computer nicht.',
    },
  ],
})

// ---------------------------------------------------------------------------
// Zustand (nur einfache Werte reaktiv – three.js-Objekte bewusst NICHT,
// sonst würde Vue tausende interne Eigenschaften beobachten)
// ---------------------------------------------------------------------------

const viewerRef = ref(null)
const hasModel = ref(false)
const busy = ref(false)
const dragging = ref(false)
const error = ref('')
const fileInfo = ref(null) // { name, size, triangles, dims: {x,y,z}, volume }

const wireframe = ref(false)
const autoRotate = ref(false)
const color = ref('#d4af6a')

// three.js-Instanzen
let THREE, STLLoader, OrbitControls
let renderer, scene, camera, controls, mesh, grid, frameId, resizeObserver
let homePosition = null

// ---------------------------------------------------------------------------
// three.js erst laden, wenn wirklich eine Datei kommt: hält die Seite schlank
// und beim Vorrendern (nuxt generate) wird kein WebGL-Code ausgeführt.
// ---------------------------------------------------------------------------

async function ensureViewer() {
  if (renderer) return

  THREE = await import('three')
  ;({ STLLoader } = await import('three/addons/loaders/STLLoader.js'))
  ;({ OrbitControls } = await import('three/addons/controls/OrbitControls.js'))

  const el = viewerRef.value

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(el.clientWidth, el.clientHeight)
  el.appendChild(renderer.domElement)

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, el.clientWidth / el.clientHeight, 0.1, 1000)
  scene.add(camera)

  // Grundlicht + ein Licht, das an der Kamera hängt: Das Modell ist so
  // aus jeder Blickrichtung gut ausgeleuchtet.
  scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2))
  const headlight = new THREE.DirectionalLight(0xffffff, 1.6)
  headlight.position.set(1, 1, 2)
  camera.add(headlight)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotateSpeed = 1.5

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
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
}

// ---------------------------------------------------------------------------
// Modell laden und darstellen
// ---------------------------------------------------------------------------

// Volumen eines geschlossenen Netzes über vorzeichenbehaftete Tetraeder.
// Bei offenen/fehlerhaften Netzen ist der Wert nur eine Näherung.
function computeVolume(geometry) {
  const pos = geometry.attributes.position.array
  let sum = 0
  for (let i = 0; i < pos.length; i += 9) {
    const ax = pos[i], ay = pos[i + 1], az = pos[i + 2]
    const bx = pos[i + 3], by = pos[i + 4], bz = pos[i + 5]
    const cx = pos[i + 6], cy = pos[i + 7], cz = pos[i + 8]
    sum += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)
  }
  return Math.abs(sum) / 6
}

function removeModel() {
  if (mesh) {
    scene.remove(mesh)
    mesh.geometry.dispose()
    mesh.material.dispose()
    mesh = null
  }
  if (grid) {
    scene.remove(grid)
    grid.geometry.dispose()
    grid.material.dispose()
    grid = null
  }
}

async function loadFile(file) {
  if (!file) return
  if (!file.name.toLowerCase().endsWith('.stl')) {
    error.value = `„${file.name}“ ist keine STL-Datei.`
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
    let geometry
    try {
      geometry = new STLLoader().parse(buffer)
    } catch {
      throw new Error('Die Datei konnte nicht gelesen werden. Ist es eine gültige STL-Datei?')
    }
    if (!geometry.attributes.position?.count) {
      throw new Error('Die Datei enthält keine Geometrie.')
    }

    // Masse und Volumen in den Originalkoordinaten der Datei
    geometry.computeBoundingBox()
    const size = new THREE.Vector3()
    geometry.boundingBox.getSize(size)
    const volume = computeVolume(geometry)

    // STL-Dateien sind fast immer "Z nach oben" (3D-Druck/CAD),
    // three.js arbeitet mit "Y nach oben" → einmal kippen und zentrieren.
    geometry.rotateX(-Math.PI / 2)
    geometry.center()
    if (!geometry.attributes.normal) geometry.computeVertexNormals()
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    removeModel()

    const material = new THREE.MeshStandardMaterial({
      color: color.value,
      metalness: 0.1,
      roughness: 0.55,
      wireframe: wireframe.value,
      // Farbige STLs (Materialise/VisCAM-Format) bringen Vertex-Farben mit
      vertexColors: Boolean(geometry.hasColors),
    })
    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Boden-Raster direkt unter dem Modell
    const radius = geometry.boundingSphere.radius
    grid = new THREE.GridHelper(radius * 4, 20, 0x888888, 0x444444)
    grid.material.transparent = true
    grid.material.opacity = 0.35
    grid.position.y = geometry.boundingBox.min.y
    scene.add(grid)

    fitCamera(radius)

    fileInfo.value = {
      name: file.name,
      size: file.size,
      triangles: geometry.attributes.position.count / 3,
      dims: { x: size.x, y: size.y, z: size.z },
      volume,
    }
  } catch (e) {
    error.value = e?.message || 'Die Datei konnte nicht geladen werden.'
    if (!mesh) hasModel.value = false
  } finally {
    busy.value = false
  }
}

// Kamera so setzen, dass das ganze Modell schräg von oben vorne sichtbar ist
function fitCamera(radius) {
  const fov = THREE.MathUtils.degToRad(camera.fov)
  const distance = (radius / Math.sin(fov / 2)) * 1.15

  camera.near = distance / 100
  camera.far = distance * 100
  camera.position.copy(new THREE.Vector3(1, 0.75, 1).normalize().multiplyScalar(distance))
  camera.updateProjectionMatrix()

  controls.target.set(0, 0, 0)
  controls.minDistance = radius * 0.2
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

// ---------------------------------------------------------------------------
// Einstellungen live übernehmen
// ---------------------------------------------------------------------------

watch(wireframe, (v) => {
  if (mesh) mesh.material.wireframe = v
})
watch(autoRotate, (v) => {
  if (controls) controls.autoRotate = v
})
watch(color, (v) => {
  if (mesh) mesh.material.color.set(v)
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
</script>

<template>
  <section class="stl container">
    <header class="stl-intro">
      <h1>STL-Viewer</h1>
      <p>
        Lade eine STL-Datei hoch und sieh dir das 3D-Modell von allen Seiten an.
        Ziehen zum Drehen, Mausrad oder zwei Finger zum Zoomen, Rechtsklick zum Verschieben.
      </p>
      <p class="stl-privacy">
        Die Datei wird nur in deinem Browser geöffnet und nirgends hochgeladen.
      </p>
    </header>

    <label
      class="glass stl-drop"
      :class="{ 'is-dragging': dragging, 'is-busy': busy, 'is-compact': hasModel }"
      @dragenter.prevent="dragging = true"
      @dragover.prevent="dragging = true"
      @dragleave="onDragLeave"
      @drop.prevent="onDrop"
    >
      <input type="file" class="stl-file-input" accept=".stl,model/stl" @change="onInputChange" />
      <span class="stl-drop-title">
        {{
          busy
            ? 'Modell wird geladen …'
            : hasModel
              ? 'Andere STL-Datei hierher ziehen oder klicken'
              : 'STL-Datei hierher ziehen'
        }}
      </span>
      <span v-if="!hasModel" class="stl-drop-sub">oder klicken, um eine Datei auszuwählen</span>
    </label>

    <p v-if="error" class="stl-msg stl-error" role="alert">{{ error }}</p>

    <div v-show="hasModel" class="glass stl-panel">
      <div class="stl-toolbar">
        <button type="button" class="stl-btn" @click="resetView">Ansicht zurücksetzen</button>
        <label class="stl-toggle">
          <input v-model="wireframe" type="checkbox" />
          Drahtgitter
        </label>
        <label class="stl-toggle">
          <input v-model="autoRotate" type="checkbox" />
          Automatisch drehen
        </label>
        <label class="stl-toggle">
          <input v-model="color" type="color" class="stl-color" aria-label="Modellfarbe" />
          Farbe
        </label>
      </div>

      <div ref="viewerRef" class="stl-viewer"></div>

      <dl v-if="fileInfo" class="stl-info">
        <div>
          <dt>Datei</dt>
          <dd>{{ fileInfo.name }} ({{ formatBytes(fileInfo.size) }})</dd>
        </div>
        <div>
          <dt>Abmessungen (X × Y × Z)</dt>
          <dd>
            {{ formatNumber(fileInfo.dims.x) }} × {{ formatNumber(fileInfo.dims.y) }} ×
            {{ formatNumber(fileInfo.dims.z) }} mm
          </dd>
        </div>
        <div>
          <dt>Volumen</dt>
          <dd>{{ formatNumber(fileInfo.volume / 1000) }} cm³</dd>
        </div>
        <div>
          <dt>Dreiecke</dt>
          <dd>{{ formatNumber(fileInfo.triangles, 0) }}</dd>
        </div>
      </dl>
      <p class="stl-hint">
        STL-Dateien enthalten keine Einheit. Angezeigt wird in Millimetern, wie bei
        3D-Druck-Dateien üblich.
      </p>
    </div>
  </section>
</template>

<style scoped>
.stl {
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 4rem;
  display: grid;
  gap: 1.5rem;
}

.stl-intro h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.stl-intro p {
  max-width: 62ch;
  margin: 0 0 0.75rem;
}

.stl-privacy {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.95rem;
}

/* Upload-Feld */
.stl-drop {
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

.stl-drop.is-compact {
  min-height: 0;
  padding: 1rem;
}

.stl-drop:hover,
.stl-drop.is-dragging {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 8%, transparent);
}

.stl-drop:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 3px;
}

.stl-drop.is-busy {
  cursor: progress;
  opacity: 0.7;
}

.stl-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.stl-drop-title {
  font-weight: 600;
}

.stl-drop-sub {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

/* Viewer */
.stl-panel {
  border-radius: var(--radius-lg, 20px);
  padding: 1.25rem;
}

.stl-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-bottom: 1rem;
}

.stl-btn {
  font-size: 0.85rem;
  padding: 0.45rem 0.9rem;
}

.stl-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.stl-color {
  width: 2rem;
  height: 1.6rem;
  padding: 0;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  border-radius: 6px;
  background: none;
  cursor: pointer;
}

.stl-viewer {
  position: relative;
  width: 100%;
  height: min(65vh, 640px);
  min-height: 320px;
  border-radius: var(--radius-md, 14px);
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0.25));
  cursor: grab;
}

.stl-viewer:active {
  cursor: grabbing;
}

.stl-viewer :deep(canvas) {
  display: block;
}

/* Infos */
.stl-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem 1.5rem;
  margin: 1.25rem 0 0;
}

.stl-info dt {
  font-size: 0.75rem;
  color: var(--gold, #c9a14a);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.stl-info dd {
  margin: 0.2rem 0 0;
  overflow-wrap: anywhere;
}

.stl-hint,
.stl-msg {
  margin: 1rem 0 0;
  font-size: 0.85rem;
  color: var(--ink-muted, #9a9a9a);
}

.stl-error {
  margin: 0;
  color: #e5675a;
}

@media (max-width: 600px) {
  .stl-viewer {
    height: 55vh;
    min-height: 260px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stl-drop {
    transition: none;
  }
}
</style>
