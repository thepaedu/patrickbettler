<script setup>
import { ref, shallowRef, computed } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
  title: 'Instagram-Check – Patrick Bettler',
  meta: [
    {
      name: 'description',
      content:
        'Finde heraus, wer dir auf Instagram nicht zurückfolgt. Die Auswertung läuft komplett in deinem Browser.',
    },
  ],
})

// ---------------------------------------------------------------------------
// Zustand
// ---------------------------------------------------------------------------

// Jede geladene Datei: { name, kind: 'followers' | 'following', entries }
// shallowRef, weil die Einträge-Arrays mehrere tausend Objekte haben können
// und Vue sie nicht tief reaktiv machen muss.
const sources = shallowRef([])
const error = ref('')
const notice = ref('')
const busy = ref(false)
const dragging = ref(false)
const generating = ref(false)
const query = ref('')
const sortBy = ref('az')

// ---------------------------------------------------------------------------
// Hilfsfunktionen für das Instagram-Format
// ---------------------------------------------------------------------------

// Follower: Name steht in string_list_data[0].value.
// Following (neues Format): Name steht in title, value fehlt oft.
// Diese Funktion deckt beide Fälle ab.
function usernameOf(entry) {
  return entry?.string_list_data?.[0]?.value || entry?.title || ''
}

function hrefOf(entry, username) {
  return (
    entry?.string_list_data?.[0]?.href ||
    `https://www.instagram.com/${encodeURIComponent(username)}/`
  )
}

function timestampOf(entry) {
  return entry?.string_list_data?.[0]?.timestamp || 0
}

function baseName(path) {
  return path.split('/').pop()
}

// Erkennt anhand von Dateiname und Inhalt, ob es eine Follower- oder
// Following-Datei ist. Gibt null zurück, wenn die Datei nicht passt.
function classify(fileName, data) {
  const name = baseName(fileName).toLowerCase()

  if (data && !Array.isArray(data) && Array.isArray(data.relationships_following)) {
    return { kind: 'following', entries: data.relationships_following }
  }
  if (data && !Array.isArray(data) && Array.isArray(data.relationships_followers)) {
    return { kind: 'followers', entries: data.relationships_followers }
  }
  if (Array.isArray(data) && /^followers_\d+\.json$/.test(name)) {
    return { kind: 'followers', entries: data }
  }
  if (Array.isArray(data) && name === 'following.json') {
    return { kind: 'following', entries: data }
  }
  return null
}

// Liest eine JSON-Datei ein und speichert sie. Eine bereits geladene Datei
// mit gleichem Namen wird ersetzt, damit doppeltes Hochladen nichts verfälscht.
function ingest(fileName, text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error(`„${baseName(fileName)}“ ist keine gültige JSON-Datei.`)
  }

  const result = classify(fileName, data)
  if (!result) return false

  const name = baseName(fileName)
  sources.value = [
    ...sources.value.filter((s) => s.name !== name),
    { name, ...result },
  ]
  return true
}

// ---------------------------------------------------------------------------
// Datei-Upload
// ---------------------------------------------------------------------------

async function handleFiles(fileList) {
  const files = Array.from(fileList || [])
  if (!files.length) return

  error.value = ''
  notice.value = ''
  busy.value = true
  const skipped = []

  try {
    for (const file of files) {
      const lower = file.name.toLowerCase()

      if (lower.endsWith('.zip')) {
        // Erst bei Bedarf laden, damit die Seite schlank bleibt
        // und beim Prerendern nichts davon ausgeführt wird.
        const { default: JSZip } = await import('jszip')
        const zip = await JSZip.loadAsync(file)
        const all = Object.values(zip.files).filter((f) => !f.dir)

        const relevant = all.filter((f) =>
          /(^|\/)(followers_\d+|following)\.json$/i.test(f.name)
        )

        if (!relevant.length) {
          const hasHtml = all.some((f) =>
            /(^|\/)(followers_\d+|following)\.html$/i.test(f.name)
          )
          throw new Error(
            hasHtml
              ? 'Dieser Export ist im HTML-Format. Fordere ihn bei Instagram bitte im Format JSON an.'
              : `In „${file.name}“ wurden keine Follower-Dateien gefunden.`
          )
        }

        for (const entry of relevant) {
          ingest(entry.name, await entry.async('string'))
        }
      } else if (lower.endsWith('.json')) {
        const ok = ingest(file.name, await file.text())
        if (!ok) skipped.push(file.name)
      } else {
        skipped.push(file.name)
      }
    }

    if (skipped.length) {
      notice.value = `Nicht verwendet: ${skipped.join(', ')}. Benötigt werden followers_1.json (ggf. weitere followers_X.json) und following.json.`
    }
  } catch (e) {
    error.value = e?.message || 'Die Dateien konnten nicht gelesen werden.'
  } finally {
    busy.value = false
  }
}

function onInputChange(event) {
  handleFiles(event.target.files)
  // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann
  event.target.value = ''
}

function onDrop(event) {
  dragging.value = false
  handleFiles(event.dataTransfer?.files)
}

function onDragLeave(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) dragging.value = false
}

function removeSource(name) {
  sources.value = sources.value.filter((s) => s.name !== name)
}

function resetAll() {
  sources.value = []
  error.value = ''
  notice.value = ''
  query.value = ''
}

// ---------------------------------------------------------------------------
// Auswertung (entspricht der Logik aus dem C#-Programm)
// ---------------------------------------------------------------------------

const followerFiles = computed(() => sources.value.filter((s) => s.kind === 'followers'))
const followingFiles = computed(() => sources.value.filter((s) => s.kind === 'following'))
const ready = computed(() => followerFiles.value.length > 0 && followingFiles.value.length > 0)

// Wie das HashSet mit OrdinalIgnoreCase in C#
const followerSet = computed(() => {
  const set = new Set()
  for (const file of followerFiles.value) {
    for (const entry of file.entries) {
      const name = usernameOf(entry)
      if (name) set.add(name.toLowerCase())
    }
  }
  return set
})

// Following-Liste ohne Duplikate
const followingList = computed(() => {
  const map = new Map()
  for (const file of followingFiles.value) {
    for (const entry of file.entries) {
      const username = usernameOf(entry)
      if (!username) continue
      const key = username.toLowerCase()
      if (!map.has(key)) {
        map.set(key, {
          key,
          username,
          href: hrefOf(entry, username),
          timestamp: timestampOf(entry),
        })
      }
    }
  }
  return [...map.values()]
})

const notFollowingBack = computed(() => {
  const list = followingList.value.filter((f) => !followerSet.value.has(f.key))

  if (sortBy.value === 'az') {
    return list.sort((a, b) => a.username.localeCompare(b.username, 'de'))
  }
  // Einträge ohne Datum landen immer am Ende
  const dir = sortBy.value === 'oldest' ? 1 : -1
  return list.sort((a, b) => {
    if (!a.timestamp) return 1
    if (!b.timestamp) return -1
    return (a.timestamp - b.timestamp) * dir
  })
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return notFollowingBack.value
  return notFollowingBack.value.filter((f) => f.key.includes(q))
})

function formatDate(ts) {
  if (!ts) return ''
  return new Date(ts * 1000).toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function countLabel(n, singular, plural) {
  return `${n.toLocaleString('de-CH')} ${n === 1 ? singular : plural}`
}

// ---------------------------------------------------------------------------
// PDF-Export
// ---------------------------------------------------------------------------

async function downloadPdf() {
  if (!notFollowingBack.value.length) return
  generating.value = true
  error.value = ''

  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()
    const margin = 18
    const rowH = 7.5
    const bottomLimit = pageH - margin - 8
    const gold = [176, 138, 62]
    const ink = [33, 33, 33]
    const muted = [115, 115, 115]
    const rule = [225, 225, 225]

    const colNr = margin
    const colName = margin + 14
    const colDate = pageW - margin

    const list = notFollowingBack.value
    const today = new Date()

    // Kopfbereich (nur erste Seite)
    let y = margin + 4
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(...ink)
    doc.text('Accounts, die dir nicht zurückfolgen', margin, y)

    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...muted)
    doc.text(
      `${countLabel(list.length, 'Account', 'Accounts')} von ${countLabel(
        followingList.value.length,
        'Account',
        'Accounts'
      )}, denen du folgst.`,
      margin,
      y
    )
    y += 5
    doc.text(
      `Erstellt am ${today.toLocaleDateString('de-CH')} aus deinem Instagram-Datenexport.`,
      margin,
      y
    )

    y += 4
    doc.setDrawColor(...gold)
    doc.setLineWidth(0.6)
    doc.line(margin, y, margin + 30, y)
    y += 9

    const drawTableHeader = () => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(...muted)
      doc.text('Nr.', colNr, y)
      doc.text('Benutzername', colName, y)
      doc.text('Gefolgt seit', colDate, y, { align: 'right' })
      y += 2.5
      doc.setDrawColor(...rule)
      doc.setLineWidth(0.3)
      doc.line(margin, y, pageW - margin, y)
      y += rowH - 2
    }

    drawTableHeader()

    list.forEach((item, i) => {
      if (y > bottomLimit) {
        doc.addPage()
        y = margin + 4
        drawTableHeader()
      }

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...muted)
      doc.text(String(i + 1), colNr, y)

      doc.setTextColor(...ink)
      doc.textWithLink(`@${item.username}`, colName, y, { url: item.href })

      if (item.timestamp) {
        doc.setTextColor(...muted)
        doc.text(formatDate(item.timestamp), colDate, y, { align: 'right' })
      }

      doc.setDrawColor(...rule)
      doc.setLineWidth(0.2)
      doc.line(margin, y + 2.6, pageW - margin, y + 2.6)
      y += rowH
    })

    // Seitenzahlen
    const pages = doc.getNumberOfPages()
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...muted)
      doc.text(`Seite ${p} von ${pages}`, pageW - margin, pageH - margin + 6, {
        align: 'right',
      })
    }

    const stamp = today.toISOString().slice(0, 10)
    doc.save(`instagram-nicht-zurueckfolgen-${stamp}.pdf`)
  } catch (e) {
    error.value = 'Das PDF konnte nicht erstellt werden. Bitte versuche es erneut.'
    console.error(e)
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="ig container">
    <header class="ig-intro">
      <h1>Wer folgt dir nicht zurück?</h1>
      <p>
        Lade deinen Instagram-Datenexport hoch und erhalte eine Liste aller Accounts,
        denen du folgst, die dir aber nicht zurückfolgen. Als PDF zum Herunterladen.
      </p>
      <p class="ig-privacy">
        Die Auswertung läuft vollständig in deinem Browser. Deine Dateien werden
        nirgends hochgeladen oder gespeichert.
      </p>
    </header>

    <div class="ig-grid">
      <div class="glass ig-panel">
        <label
          class="ig-drop"
          :class="{ 'is-dragging': dragging, 'is-busy': busy }"
          @dragenter.prevent="dragging = true"
          @dragover.prevent="dragging = true"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop"
        >
          <input
            type="file"
            class="ig-file-input"
            accept=".zip,.json,application/zip,application/json"
            multiple
            @change="onInputChange"
          />
          <span class="ig-drop-title">
            {{ busy ? 'Dateien werden gelesen …' : 'ZIP-Datei oder JSON-Dateien hierher ziehen' }}
          </span>
          <span class="ig-drop-sub">oder klicken, um Dateien auszuwählen</span>
        </label>

        <ul class="ig-checklist">
          <li :class="{ done: followerFiles.length }">
            <span class="ig-check" aria-hidden="true">{{ followerFiles.length ? '✓' : '' }}</span>
            Follower
            <small v-if="followerFiles.length">
              {{ countLabel(followerSet.size, 'Account', 'Accounts') }}
            </small>
            <small v-else>followers_1.json</small>
          </li>
          <li :class="{ done: followingFiles.length }">
            <span class="ig-check" aria-hidden="true">{{ followingFiles.length ? '✓' : '' }}</span>
            Gefolgt
            <small v-if="followingFiles.length">
              {{ countLabel(followingList.length, 'Account', 'Accounts') }}
            </small>
            <small v-else>following.json</small>
          </li>
        </ul>

        <ul v-if="sources.length" class="ig-files">
          <li v-for="s in sources" :key="s.name">
            <span>{{ s.name }}</span>
            <button type="button" class="ig-link-btn" @click="removeSource(s.name)">
              Entfernen
            </button>
          </li>
        </ul>

        <p v-if="error" class="ig-msg ig-error" role="alert">{{ error }}</p>
        <p v-if="notice" class="ig-msg">{{ notice }}</p>

        <button v-if="sources.length" type="button" class="ig-link-btn" @click="resetAll">
          Alles zurücksetzen
        </button>
      </div>

      <details class="glass ig-panel ig-help">
        <summary>So bekommst du deine Daten</summary>
        <ol>
          <li>Öffne in Instagram die <strong>Kontenübersicht</strong> (Einstellungen).</li>
          <li>Wähle <strong>Deine Informationen und Berechtigungen</strong> und dann <strong>Deine Informationen herunterladen</strong>.</li>
          <li>Wähle <strong>Einige deiner Informationen</strong> und hake nur <strong>Follower und gefolgte Personen</strong> an.</li>
          <li>Als Ziel <strong>Auf Gerät herunterladen</strong>, Zeitraum <strong>Gesamter Zeitraum</strong> und Format <strong>JSON</strong> wählen.</li>
          <li>Sobald Instagram den Export bereitstellt, lädst du die ZIP-Datei herunter und ziehst sie hier hinein.</li>
        </ol>
        <p>
          Du kannst auch die einzelnen Dateien aus dem Ordner
          <code>connections/followers_and_following</code> hochladen. Bei vielen Followern
          gibt es mehrere Dateien (<code>followers_1.json</code>, <code>followers_2.json</code> …),
          lade dann alle hoch.
        </p>
      </details>
    </div>

    <section v-if="ready" class="glass ig-panel ig-results" aria-live="polite">
      <div class="ig-results-head">
        <div>
          <h2>
            {{ countLabel(notFollowingBack.length, 'Account folgt', 'Accounts folgen') }}
            dir nicht zurück
          </h2>
          <p class="ig-sub">
            von {{ countLabel(followingList.length, 'Account', 'Accounts') }}, denen du folgst
          </p>
        </div>
        <button
          type="button"
          class="ig-primary"
          :disabled="generating || !notFollowingBack.length"
          @click="downloadPdf"
        >
          {{ generating ? 'PDF wird erstellt …' : 'PDF herunterladen' }}
        </button>
      </div>

      <template v-if="notFollowingBack.length">
        <div class="ig-toolbar">
          <input
            v-model="query"
            type="search"
            class="ig-input"
            placeholder="Benutzername suchen"
            aria-label="Benutzername suchen"
          />
          <select v-model="sortBy" class="ig-input" aria-label="Sortierung">
            <option value="az">Alphabetisch</option>
            <option value="oldest">Am längsten gefolgt</option>
            <option value="newest">Zuletzt gefolgt</option>
          </select>
        </div>

        <ul class="ig-list">
          <li v-for="item in filtered" :key="item.key">
            <a :href="item.href" target="_blank" rel="noopener noreferrer">@{{ item.username }}</a>
            <span v-if="item.timestamp" class="ig-date">seit {{ formatDate(item.timestamp) }}</span>
          </li>
        </ul>

        <p v-if="!filtered.length" class="ig-msg">Kein Treffer für „{{ query }}“.</p>
      </template>

      <p v-else class="ig-msg">Alle Accounts, denen du folgst, folgen dir auch zurück.</p>
    </section>
  </section>
</template>

<style scoped>
.ig {
  text-align: left;
  padding-top: 3rem;
  padding-bottom: 4rem;
  display: grid;
  gap: 1.5rem;
}

.ig-intro h1 {
  margin: 0 0 1rem;
  font-size: clamp(2rem, 5vw, 3rem);
}

.ig-intro p {
  max-width: 62ch;
  margin: 0 0 0.75rem;
}

.ig-privacy {
  color: var(--ink-muted, #9a9a9a);
  font-size: 0.95rem;
}

.ig-grid {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  gap: 1.5rem;
  align-items: start;
}

.ig-panel {
  border-radius: var(--radius-lg, 20px);
  padding: 1.5rem;
}

/* Upload-Feld */
.ig-drop {
  position: relative;
  display: grid;
  place-items: center;
  gap: 0.35rem;
  min-height: 180px;
  padding: 1.5rem;
  text-align: center;
  border: 2px dashed var(--glass-border, rgba(255, 255, 255, 0.25));
  border-radius: var(--radius-md, 14px);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.ig-drop:hover,
.ig-drop.is-dragging {
  border-color: var(--gold, #c9a14a);
  background: color-mix(in srgb, var(--gold, #c9a14a) 8%, transparent);
}

.ig-drop:focus-within {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 3px;
}

.ig-drop.is-busy {
  cursor: progress;
  opacity: 0.7;
}

.ig-file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.ig-drop-title {
  font-weight: 600;
}

.ig-drop-sub {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

/* Status */
.ig-checklist {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}

.ig-checklist li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink-muted, #9a9a9a);
}

.ig-checklist li.done {
  color: inherit;
}

.ig-checklist small {
  color: var(--ink-muted, #9a9a9a);
}

.ig-check {
  display: inline-grid;
  place-items: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  font-size: 0.75rem;
  line-height: 1;
}

.done .ig-check {
  border-color: var(--gold, #c9a14a);
  background: var(--gold, #c9a14a);
  color: #1a1a1a;
}

.ig-files {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  font-size: 0.9rem;
}

.ig-files li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
}

.ig-link-btn {
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--ink-muted, #9a9a9a);
  text-decoration: underline;
  cursor: pointer;
}

.ig-files .ig-link-btn {
  margin-top: 0;
}

.ig-link-btn:hover {
  color: var(--gold, #c9a14a);
}

.ig-msg {
  margin: 1rem 0 0;
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
}

.ig-error {
  color: #e5675a;
}

/* Anleitung */
.ig-help summary {
  font-weight: 600;
  cursor: pointer;
}

.ig-help ol {
  padding-left: 1.25rem;
  margin: 1rem 0;
}

.ig-help li {
  margin-bottom: 0.5rem;
}

.ig-help p {
  font-size: 0.9rem;
  color: var(--ink-muted, #9a9a9a);
  margin: 0;
}

.ig-help code {
  font-size: 0.85em;
  word-break: break-word;
}

/* Ergebnis */
.ig-results-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.ig-results-head h2 {
  margin: 0;
  font-size: 1.5rem;
}

.ig-sub {
  margin: 0.25rem 0 0;
  color: var(--ink-muted, #9a9a9a);
}

.ig-primary {
  background: var(--gold, #c9a14a);
  color: #1a1a1a;
  font-weight: 600;
  border: none;
}

.ig-primary:hover:not(:disabled) {
  filter: brightness(1.08);
}

.ig-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ig-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ig-input {
  font: inherit;
  padding: 0.55rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
  background: var(--glass-bg-strong, rgba(0, 0, 0, 0.2));
  color: inherit;
}

.ig-toolbar input {
  flex: 1 1 220px;
}

.ig-input:focus-visible {
  outline: 2px solid var(--gold, #c9a14a);
  outline-offset: 1px;
}

.ig-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  column-gap: 1.5rem;
}

.ig-list li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid var(--glass-border, rgba(255, 255, 255, 0.12));
  min-width: 0;
}

.ig-list a {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ig-date {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: var(--ink-muted, #9a9a9a);
}

@media (max-width: 800px) {
  .ig-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ig-drop {
    transition: none;
  }
}
</style>
