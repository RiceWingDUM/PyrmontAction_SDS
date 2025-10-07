<template>
  <div class="card">
    <h2 class="title">Meeting Minutes</h2>

    <!-- Form -->
    <div class="form">
      <div class="row">
        <label class="lbl">Title</label>
        <input v-model="draft.title" class="input" placeholder="Enter title" />
      </div>

      <div class="row">
        <label class="lbl">Notes</label>
        <textarea v-model="draft.body" class="input" rows="6" placeholder="Type the meeting notes…"></textarea>
      </div>

      <div class="row">
        <label class="lbl">Attach PDF(s)</label>
        <div class="fileZone">
          <input ref="fileEl" type="file" accept="application/pdf" multiple @change="pickFiles" />
          <div v-if="draft.files.length" class="fileList">
            <div v-for="(f,i) in draft.files" :key="i" class="chip">
              <span class="chip-name">📄 {{ f.name }}</span>
              <button class="chip-x" title="Remove" @click="removeFile(i)">×</button>
            </div>
          </div>
          <div v-else class="hint">Select one or more PDF files…</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn" :disabled="!canSave" @click="saveDraft">Save Draft</button>
        <button class="btn primary" :disabled="!canPublish" @click="publish">Publish</button>
        <button class="btn" @click="clearDraft">Clear</button>
      </div>
    </div>

    <hr class="divider" />

    <!-- List -->
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th style="width:120px;">Date</th>
            <th>Title</th>
            <th style="width:140px;">Author</th>
            <th style="width:120px;">Status</th>
            <th style="width:160px;">Files</th>
            <th style="width:160px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in minutes" :key="m.id">
            <td>{{ m.date }}</td>
            <td>{{ m.title }}</td>
            <td>{{ m.author }}</td>
            <td>
              <span class="badge" :class="m.status === 'published' ? 'badge-pub' : 'badge-draft'">
                {{ m.status === 'published' ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td>
              <template v-if="m.files?.length">
                <span v-for="(f, i) in m.files" :key="i" class="fileBadge">{{ shortName(f.name) }}</span>
              </template>
              <span v-else class="muted">—</span>
            </td>
            <td class="actionsCell">
              <button class="btn sm" @click="publishItem(m)">Publish</button>
              <button class="btn sm" @click="startEdit(m)">Edit</button>
              <button class="btn sm danger" @click="deleteItem(m.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="!minutes.length">
            <td colspan="6" class="muted">No minutes yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const minutes = ref([

])

const draft = reactive({ id: null, title: '', body: '', files: [], status: null })
const fileEl = ref(null)

const canSave = computed(() => draft.title.trim().length > 0)
const canPublish = computed(() => draft.title.trim().length > 0)

function pickFiles(e) {
  const files = Array.from(e.target.files || [])
  draft.files = files.map(f => ({ name: f.name }))
}
function removeFile(i) { draft.files.splice(i, 1) }
function clearDraft() {
  draft.id = null
  draft.title = ''
  draft.body = ''
  draft.files = []
  draft.status = null
  if (fileEl.value) fileEl.value.value = ''
}

function saveDraft() {
  const base = { title: draft.title.trim(), body: draft.body.trim(), files: [...draft.files], author: 'Admin' }
  if (draft.id) {
    const i = minutes.value.findIndex(x => x.id === draft.id)
    if (i > -1) minutes.value[i] = { ...minutes.value[i], ...base, status: 'draft' }
  } else {
    minutes.value.unshift({ id: Date.now(), date: new Date().toISOString().slice(0, 10), ...base, status: 'draft' })
  }
  clearDraft()
}

function publish() {
  const base = { title: draft.title.trim(), body: draft.body.trim(), files: [...draft.files], author: 'Admin' }
  if (draft.id) {
    const i = minutes.value.findIndex(x => x.id === draft.id)
    if (i > -1) minutes.value[i] = { ...minutes.value[i], ...base, status: 'published' }
  } else {
    minutes.value.unshift({ id: Date.now(), date: new Date().toISOString().slice(0, 10), ...base, status: 'published' })
  }
  clearDraft()
}

function publishItem(m) { m.status = 'published' }
function startEdit(m) {
  draft.id = m.id
  draft.title = m.title
  draft.body = m.body
  draft.files = (m.files || []).map(f => ({ ...f }))
  draft.status = m.status
  if (fileEl.value) fileEl.value.value = ''
}
function deleteItem(id) { minutes.value = minutes.value.filter(x => x.id !== id) }

function shortName(name) { return name.length > 18 ? name.slice(0, 16) + '…' : name }
</script>

<style scoped>
.card{padding:16px;border:1px solid #e5e7eb;border-radius:12px;background:#fff}
.title{margin:0 0 12px 0;font-size:20px;font-weight:600}
.form{border:1px solid #f0f0f0;border-radius:10px;padding:12px;margin-top:8px;margin-bottom:12px;background:#fafafa}
.row{display:grid;grid-template-columns:140px 1fr;gap:10px 12px;align-items:start;margin-bottom:10px}
.lbl{font-size:14px;color:#374151;padding-top:8px}
.input{border:1px solid #e5e7eb;border-radius:10px;padding:10px 12px;width:100%;background:#fff;font:inherit}
.actions{display:flex;gap:8px;justify-content:flex-start;margin-top:4px}
.btn{border:1px solid #e5e7eb;background:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
.btn.sm{padding:6px 10px}
.btn.primary{background:#111;color:#fff;border-color:#111}
.btn.danger{border-color:#ef4444;color:#ef4444}
.muted{color:#6b7280}
.divider{border:0;border-top:1px solid #f0f0f0;margin:12px 0}
.fileZone{border:1px dashed #d1d5db;border-radius:10px;padding:10px;background:#fff}
.fileList{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.chip{display:flex;align-items:center;gap:6px;border:1px solid #e5e7eb;border-radius:999px;padding:4px 8px;background:#f8fafc}
.chip-x{border:none;background:transparent;cursor:pointer;font-size:14px;line-height:1}
.table-wrap{overflow-x:auto}
.table{width:100%;border-collapse:collapse;font-size:14px}
.table th,.table td{padding:10px 12px;border-top:1px solid #f3f4f6;text-align:left;vertical-align:top}
.fileBadge{display:inline-block;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:2px 8px;margin-right:6px;font-size:12px}
.badge{display:inline-block;border-radius:999px;padding:2px 8px;font-size:12px;border:1px solid #e5e7eb}
.badge-draft{background:#fff7ed;color:#9a3412;border-color:#fed7aa}
.badge-pub{background:#ecfeff;color:#155e75;border-color:#a5f3fc}
.actionsCell{display:flex;gap:6px}
@media (max-width: 640px){.row{grid-template-columns:1fr}}
</style>
