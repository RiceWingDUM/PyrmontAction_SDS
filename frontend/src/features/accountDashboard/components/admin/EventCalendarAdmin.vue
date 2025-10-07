<template>
  <div class="page-wrapper">
    <div class="calendar container">
      <div class="topbar">
        <h1 class="ttl">Event Calendar (Admin)</h1>
        <button class="btn primary" @click="openCreate">Add Event</button>
      </div>

      <!-- Day groups -->
      <div v-for="(group, gi) in groups" :key="gi" class="day">
        <div class="dayHead">
          <div class="dayTitle">{{ group.label }}</div>
          <div class="daySub">{{ group.sub }}</div>
        </div>

        <div v-if="!group.events.length" class="nothing">Nothing Planned yet</div>

        <div
          v-for="ev in group.events"
          :key="ev.id"
          class="eventRow"
          @click="openView(ev)"
        >
          <div class="icon">🔔</div>

          <!-- image preview -->
          <div class="thumb" :style="imageStyle(ev.image)">
            <span v-if="!ev.image?.src" class="imgPh">Image</span>
          </div>

          <div class="info">
            <div class="label"><b>Name:</b> {{ ev.title }}</div>
            <div class="label"><b>Location:</b> {{ ev.location }}</div>
          </div>

          <div class="times">
            <div><b>Start:</b> {{ fmtTime(ev.start) }}</div>
            <div><b>End:</b> {{ fmtTime(ev.end) }}</div>
          </div>

          <div class="actions" @click.stop>
            <button class="btn sm" @click="openEdit(ev)">Edit</button>
            <button class="btn sm danger" @click="remove(ev.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- View modal -->
    <div v-if="viewer" class="modal">
      <div class="modalCard">
        <div class="modalHead">
          <h3 class="modalTtl">{{ viewer.title }}</h3>
          <button class="btn sm" @click="viewer = null">Close</button>
        </div>
        <div class="modalBody">
          <div class="cols">
            <div class="col">
              <div class="row"><b>Date:</b> {{ fmtDate(viewer.start) }}</div>
              <div class="row"><b>Time:</b> {{ fmtTime(viewer.start) }} – {{ fmtTime(viewer.end) }}</div>
              <div class="row"><b>Location:</b> {{ viewer.location }}</div>
            </div>
            <div class="col imageLg" :style="imageStyle(viewer.image, true)">
              <span v-if="!viewer.image?.src" class="imgPh">Image</span>
            </div>
          </div>

          <div class="subttl">Details</div>
          <ul class="bullets">
            <li v-for="(d,i) in viewer.details" :key="i">{{ d }}</li>
            <li v-if="!viewer.details?.length" class="muted">—</li>
          </ul>

          <div class="subttl">Why It Matters</div>
          <p class="muted">{{ viewer.why || '—' }}</p>
        </div>
      </div>
    </div>

    <!-- Create/Edit modal -->
    <div v-if="editor.open" class="modal">
      <div class="modalCard">
        <div class="modalHead">
          <h3 class="modalTtl">{{ editor.mode === 'create' ? 'Add Event' : 'Edit Event' }}</h3>
          <button class="btn sm" @click="closeEditor">Close</button>
        </div>

        <form class="form" @submit.prevent="saveEditor">
          <div class="grid2">
            <label>Title</label>
            <input v-model="editor.form.title" class="input" placeholder="Event title" required />

            <label>Date</label>
            <input v-model="editor.form.date" type="date" class="input" required />

            <label>Start time</label>
            <input v-model="editor.form.startTime" type="time" class="input" required />

            <label>End time</label>
            <input v-model="editor.form.endTime" type="time" class="input" required />

            <label>Location</label>
            <input v-model="editor.form.location" class="input" placeholder="Venue / address" required />

            <label>Details (bullets)</label>
            <textarea v-model="editor.form.detailsRaw" class="input" rows="3" placeholder="One item per line"></textarea>

            <label>Why it matters</label>
            <textarea v-model="editor.form.why" class="input" rows="3" placeholder="Short paragraph"></textarea>

            <!-- Image upload + adjustments -->
            <label>Image</label>
            <div class="imgControls">
              <div class="imgPreview" :style="imageStyle(editor.form.image, true)">
                <span v-if="!editor.form.image?.src" class="imgPh">Preview</span>
              </div>
              <div class="imgInputs">
                <input type="file" accept="image/*" @change="pickImage" />
                <div class="rowInline">
                  <label class="mini">Fit</label>
                  <select v-model="editor.form.image.fit" class="input mini">
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                  </select>
                </div>
                <div class="rowInline">
                  <label class="mini">Zoom</label>
                  <input type="range" min="0.5" max="2" step="0.01" v-model.number="editor.form.image.scale" />
                  <span class="mini">{{ (editor.form.image.scale * 100).toFixed(0) }}%</span>
                </div>
                <div class="rowInline">
                  <label class="mini">X</label>
                  <input type="range" min="0" max="100" step="1" v-model.number="editor.form.image.x" />
                  <span class="mini">{{ editor.form.image.x }}%</span>
                </div>
                <div class="rowInline">
                  <label class="mini">Y</label>
                  <input type="range" min="0" max="100" step="1" v-model.number="editor.form.image.y" />
                  <span class="mini">{{ editor.form.image.y }}%</span>
                </div>
                <button class="btn sm" type="button" @click="clearImage" :disabled="!editor.form.image.src">Remove Image</button>
              </div>
            </div>
          </div>

          <div class="actions mt">
            <button class="btn primary" type="submit">
              {{ editor.mode === 'create' ? 'Save Event' : 'Save Changes' }}
            </button>
            <button class="btn" type="button" @click="closeEditor">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

/* ---------- demo events (UI only) ---------- */
const events = ref([
  {
    id: 1,
    title: 'Pyrmont Action Fundraiser',
    location: 'Pyrmont Bay Park',
    start: setTime(new Date(), 9, 0),
    end:   setTime(new Date(), 17, 0),
    details: ['Guest Speakers','Live Music','Raffle Prizes'],
    why: 'Support a more connected Pyrmont with community-led action.',
    image: { src: '', fit: 'cover', scale: 1, x: 50, y: 50 },
  },
  {
    id: 2,
    title: 'Pyrmont Weekling Meeting',
    location: 'Pyrmont Community Centre',
    start: setTime(addDays(new Date(), 3), 16, 0),
    end:   setTime(addDays(new Date(), 3), 17, 0),
    details: ['Project updates','Volunteers welcome'],
    why: 'Monthly coordination across projects.',
    image: { src: '', fit: 'cover', scale: 1, x: 50, y: 50 },
  },
])

/* ---------- modals ---------- */
const viewer = ref(null)
function openView(ev){ viewer.value = ev }

const defaultImg = () => ({ src:'', fit:'cover', scale:1, x:50, y:50 })

const editor = ref({
  open: false,
  mode: 'create',
  id: null,
  form: { title:'', date:'', startTime:'', endTime:'', location:'', detailsRaw:'', why:'', image: defaultImg() }
})

function openCreate(){
  editor.value = {
    open: true, mode: 'create', id: null,
    form: { title:'', date: todayISO(), startTime:'09:00', endTime:'17:00', location:'', detailsRaw:'', why:'', image: defaultImg() }
  }
}
function openEdit(ev){
  const d = new Date(ev.start)
  editor.value = {
    open: true, mode: 'edit', id: ev.id,
    form: {
      title: ev.title,
      date: toISODate(d),
      startTime: toTime(d),
      endTime: toTime(new Date(ev.end)),
      location: ev.location,
      detailsRaw: (ev.details || []).join('\n'),
      why: ev.why || '',
      image: ev.image ? { ...ev.image } : defaultImg(),
    }
  }
}
function closeEditor(){ editor.value.open = false }

function pickImage(e){
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { editor.value.form.image.src = String(reader.result) }
  reader.readAsDataURL(file)
}
function clearImage(){ editor.value.form.image = defaultImg() }

function saveEditor(){
  const f = editor.value.form
  const start = combineDateTime(f.date, f.startTime)
  const end   = combineDateTime(f.date, f.endTime)
  const base = {
    title: f.title.trim(),
    location: f.location.trim(),
    start, end,
    details: (f.detailsRaw || '').split('\n').map(s => s.trim()).filter(Boolean),
    why: f.why.trim(),
    image: { ...f.image },
  }
  if (editor.value.mode === 'create') {
    events.value.push({ id: Date.now(), ...base })
  } else {
    const i = events.value.findIndex(e => e.id === editor.value.id)
    if (i > -1) events.value[i] = { id: editor.value.id, ...base }
  }
  editor.value.open = false
}

function remove(id){ events.value = events.value.filter(e => e.id !== id) }

/* ---------- grouping (Today / Tomorrow / Weekday) ---------- */
const groups = computed(() => {
  const byDay = groupByDate(events.value)
  return byDay.map(({ date, items }) => ({
    label: labelFor(date),
    sub: fmtDate(items[0]?.start ?? date),
    events: items.sort((a,b)=>a.start-b.start)
  }))
})

/* ---------- image style helper ---------- */
function imageStyle(img, large = false){
  const w = large ? 320 : 160
  const h = large ? 200 : 96
  const base = { width: w+'px', height: h+'px', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden', background: '#fff' }
  if (!img?.src) return base
  const size = img.fit === 'contain' ? 'contain' : `${Math.max(10, img.scale*100)}% auto`
  const position = `${img.x}% ${img.y}%`
  return {
    ...base,
    backgroundImage: `url('${img.src}')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: position,
    backgroundSize: size,
  }
}

/* ---------- helpers ---------- */
function addDays(d, n){ const x = new Date(d); x.setDate(x.getDate()+n); return x }
function setTime(d, h, m){ const x = new Date(d); x.setHours(h, m, 0, 0); return x }
function startOfDay(t){ const d = new Date(t); d.setHours(0,0,0,0); return d }
function sameDay(a,b){ const A=new Date(a), B=new Date(b); return A.getFullYear()===B.getFullYear() && A.getMonth()===B.getMonth() && A.getDate()===B.getDate() }
function groupByDate(list){
  const days = []
  list.forEach(ev => {
    const key = startOfDay(ev.start).toISOString()
    let g = days.find(d => d.key === key)
    if (!g) { g = { key, date: new Date(key), items: [] }; days.push(g) }
    g.items.push(ev)
  })
  return days.sort((a,b)=>a.date-b.date)
}
function labelFor(date){
  const d = startOfDay(date), today = startOfDay(new Date()), tomorrow = addDays(today,1)
  if (sameDay(d,today)) return 'Today'
  if (sameDay(d,tomorrow)) return 'Tomorrow'
  return d.toLocaleDateString(undefined, { weekday:'long' })
}
function fmtDate(t){ return new Date(t).toLocaleDateString(undefined, { day:'numeric', month:'long' }) }
function fmtTime(t){ return new Date(t).toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit' }) }
function todayISO(){ return toISODate(new Date()) }
function toISODate(d){ return d.toISOString().slice(0,10) }
function toTime(d){ return d.toTimeString().slice(0,5) }
function combineDateTime(dateStr, timeStr){
  const [y,m,da] = dateStr.split('-').map(n=>parseInt(n,10))
  const [hh,mm]  = timeStr.split(':').map(n=>parseInt(n,10))
  return new Date(y, m-1, da, hh, mm, 0, 0)
}
</script>

<style scoped>
/* ===== layout wrapper so footer stays down (no App.vue edit) ===== */
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical center */
  align-items: center;     /* horizontal center */
  background: linear-gradient(135deg, #f5f6fa 60%, #e9ecef 100%);
  padding: 0;
}

/* ===== main container ===== */
.container {
  max-width: 700px;
  width: 100%;
  margin: 40px 0;
  padding: 48px 40px 48px 40px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(60, 60, 90, 0.12), 0 1.5px 6px rgba(0,0,0,0.04);
  border: 1px solid #ececec;
  transition: box-shadow 0.2s;
}

.topbar {
  margin-bottom: 32px;
}

.ttl{font-size: clamp(24px, 3.2vw, 34px);font-weight:700;margin:0}

/* ===== day blocks ===== */
.day{margin:32px 0}
.dayHead{display:flex;align-items:baseline;gap:10px;margin-bottom:10px}
.dayTitle{font-weight:700}
.daySub{color:#6b7280;font-size:14px}
.nothing {
  color: #b0b3b8;
  padding: 18px 0;
  border-top: 1px solid #eee;
  text-align: center;
  font-size: 16px;
}

/* ===== event row ===== */
.eventRow {
  margin: 24px 0;
  padding: 20px 20px;
  border-radius: 14px;
  background: #f8fafc;
  box-shadow: 0 2px 8px rgba(60,60,90,0.05);
  border: 1px solid #f0f0f0;
}

/* ===== modal ===== */
.modal{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
.modalCard {
  max-width: min(1200px, 98vw);
  padding: 32px;
  border-radius: 18px;
}
.modalHead{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.modalTtl{margin:0;font-size:20px;font-weight:700}
.modalBody{font-size:15px}
.cols{display:grid;grid-template-columns:1fr 320px;gap:18px;align-items:start;margin-bottom:14px}
.imageLg{
  height:200px;border:1px solid #e5e7eb;border-radius:12px;display:flex;
  align-items:center;justify-content:center;color:#6b7280;overflow:hidden;background:#fff
}
.subttl{font-weight:700;margin-top:10px}
.bullets{margin:6px 0 0 18px}
.muted{color:#6b7280}

/* ===== editor form ===== */
.form{margin-top:6px}
.grid2{display:grid;grid-template-columns:180px 1fr;gap:12px 14px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:9px 12px;background:#fff}

/* ===== image editor ===== */
.imgControls{display:grid;grid-template-columns:320px 1fr;gap:14px;align-items:start}
.imgPreview{
  width:320px;height:200px;border:1px solid #e5e7eb;border-radius:12px;display:flex;
  align-items:center;justify-content:center;overflow:hidden;background:#fff
}
.imgInputs{display:grid;gap:8px}
.rowInline{display:flex;align-items:center;gap:8px}
.mini{font-size:12px;color:#4b5563}

/* ===== responsive ===== */
@media (max-width: 1280px) {
  .container {
    max-width: 98vw;
    padding: 24px 8px 40px;
  }
  .modalCard {
    padding: 18px;
  }
}

@media (max-width: 1024px){
  .eventRow {
    grid-template-columns: 48px 120px 1fr;
    font-size: 15px;
  }
  .container {
    padding: 12px 2vw 24px;
  }
}

@media (max-width: 900px) {
  .container {
    max-width: 98vw;
    padding: 24px 8px 32px 8px;
  }
}

/* ===== only-while-this-page-is-mounted footer tweaks ===== */
:deep(footer){
  padding-top: 24px !important;
  padding-bottom: 24px !important;
}
:deep(footer .container), :deep(footer .inner), :deep(footer .wrap){
  max-width: 1100px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}
</style>
