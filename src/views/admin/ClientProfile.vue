<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-24 pb-20 px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Page Title -->
      <h1 class="font-serif text-4xl text-[var(--color-primary)] mb-8 text-center">
        Client Profile
      </h1>

      <!-- Loader -->
      <Loader v-if="loading" class="mx-auto my-20" />

      <div v-else>
        <!-- Client Info -->
        <div class="bg-white shadow-xl rounded-3xl p-6 mb-6">
          <h2 class="font-bold text-xl mb-2">{{ client.fullName || 'N/A' }}</h2>
          <p class="text-gray-500 text-sm mb-1">Email: {{ client.email || 'N/A' }}</p>
          <p class="text-gray-500 text-sm mb-1">Phone: {{ client.phone || 'N/A' }}</p>
          <p class="text-gray-500 text-sm mb-1">Role: {{ client.role || 'N/A' }}</p>
        </div>

        <!-- Actions -->
        <div class="bg-white shadow-xl rounded-3xl p-6 mb-6 space-y-3">
          <h3 class="font-bold text-lg mb-2">Actions</h3>
          <button @click="openAddNoteModal" class="w-full py-3 bg-[var(--color-primary)] text-white rounded-2xl text-sm font-bold hover:bg-[var(--color-primary)]/80 transition-all flex justify-center items-center">
            <span v-if="!addingNote">Add Note</span>
            <Loader v-else class="h-4 w-4"/>
          </button>

          <button @click="openAddFileModal" class="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl text-sm font-bold hover:bg-gray-300 transition-all">
            Add Attachment
          </button>

          <button @click="openPostponeModal" class="w-full py-3 bg-yellow-500 text-white rounded-2xl text-sm font-bold hover:bg-yellow-600 transition-all">
            Postpone Booking
          </button>
        </div>

        <!-- Client Sessions -->
        <div class="bg-white shadow-xl rounded-3xl p-6 space-y-4">
          <h3 class="font-bold text-lg">Client Sessions</h3>
          <div v-if="clientSessions.length">
            <div v-for="session in clientSessions" :key="session.id" class="border-b border-gray-100 py-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-bold">{{ session.service?.title || 'N/A' }}</p>
                  <p class="text-gray-500 text-xs">{{ session.startDate || 'TBD' }} at {{ session.time || 'TBD' }}</p>
                  <p class="text-gray-500 text-xs">Status: {{ session.status || 'Unknown' }}</p>
                </div>
                <button @click="openSessionNotesModal(session)" class="px-2 py-1 bg-gray-200 rounded-md text-xs hover:bg-gray-300">
                  Notes
                </button>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-center py-4">No sessions found for this client.</p>
        </div>
      </div>

      <!-- Add Note Modal -->
      <div v-if="showNoteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
          <h3 class="font-bold text-lg mb-3">Add Note</h3>
          <textarea v-model="newNote" rows="4" class="w-full border rounded-md p-2"></textarea>
          <div class="mt-3 flex justify-end space-x-2">
            <button @click="addNote" class="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md" :disabled="addingNote">
              <span v-if="!addingNote">Add</span>
              <Loader v-else class="h-4 w-4"/>
            </button>
            <button @click="closeNoteModal" class="px-3 py-1 border rounded-md">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Add File Modal -->
      <div v-if="showFileModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
          <h3 class="font-bold text-lg mb-3">Upload Attachment</h3>
          <input type="file" @change="handleFileUpload" class="w-full border rounded-md p-2 mb-3"/>
          <div class="flex justify-end space-x-2">
            <button @click="uploadFile" class="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md" :disabled="uploadingFile">
              <span v-if="!uploadingFile">Upload</span>
              <Loader v-else class="h-4 w-4"/>
            </button>
            <button @click="closeFileModal" class="px-3 py-1 border rounded-md">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Postpone Modal -->
      <div v-if="showPostponeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
          <h3 class="font-bold text-lg mb-3">Postpone Booking</h3>
          <input type="date" v-model="postponeDate" class="w-full border rounded-md p-2 mb-2"/>
          <input type="time" v-model="postponeTime" class="w-full border rounded-md p-2 mb-3"/>
          <div class="flex justify-end space-x-2">
            <button @click="postponeBooking" class="px-3 py-1 bg-yellow-500 text-white rounded-md" :disabled="updating">
              <span v-if="!updating">Postpone</span>
              <Loader v-else class="h-4 w-4"/>
            </button>
            <button @click="closePostponeModal" class="px-3 py-1 border rounded-md">Cancel</button>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAppStore } from '@/stores/appStore';
import Loader from '@/components/SkeletonLoader.vue';
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner';

const store = useAppStore();
const loading = ref(true);
const route = useRoute(), router = useRouter();
const clientId = computed(() => route.params.userId);
const updating = ref(false);
const addingNote = ref(false);
const uploadingFile = ref(false);

const client = reactive({});
const clientSessions = ref([]);

const showNoteModal = ref(false);
const showFileModal = ref(false);
const showPostponeModal = ref(false);

const newNote = ref('');
const selectedFile = ref(null);
const postponeDate = ref('');
const postponeTime = ref('');

// --- Fetch client by id ---
const fetchClient = async (id) => {
  try {
    const data = await store.usersActions.getById(clientId.value);
    Object.assign(client, data);
    // Fetch sessions for this client
    clientSessions.value = store.sessions.items.filter(s => s.clientId === client.uid);
  } catch (err) {
    toast.error('Failed to fetch client');
    console.error(err);
  } finally { loading.value = false; }
};

// --- Notes ---
const openAddNoteModal = () => { newNote.value = ''; showNoteModal.value = true; };
const closeNoteModal = () => { showNoteModal.value = false; };
const addNote = async () => {
  if (!newNote.value.trim()) return;
  addingNote.value = true;
  try {
    await store.usersActions.addSubItem(client.uid, 'sessions', 'notes', { note: newNote.value, createdAt: new Date() });
    toast.success('Note added successfully!');
    closeNoteModal();
  } catch (err) { toast.error('Failed to add note'); console.error(err); }
  finally { addingNote.value = false; }
};

// --- File Upload ---
const openAddFileModal = () => { selectedFile.value = null; showFileModal.value = true; };
const closeFileModal = () => { showFileModal.value = false; };
const handleFileUpload = (e) => { selectedFile.value = e.target.files[0]; };
const uploadFile = async () => {
  if (!selectedFile.value) return;
  uploadingFile.value = true;
  try {
    // Replace with your storage upload logic
    const fileData = { name: selectedFile.value.name, uploadedAt: new Date() };
    await store.usersActions.addSubItem(client.uid, 'users', 'attachments', fileData);
    toast.success('File uploaded successfully!');
    closeFileModal();
  } catch (err) { toast.error('Failed to upload file'); console.error(err); }
  finally { uploadingFile.value = false; }
};

// --- Postpone Booking ---
const openPostponeModal = () => { postponeDate.value = ''; postponeTime.value = ''; showPostponeModal.value = true; };
const closePostponeModal = () => { showPostponeModal.value = false; };
const postponeBooking = async () => {
  if (!postponeDate.value || !postponeTime.value) return toast.error('Select date and time');
  updating.value = true;
  try {
    // Update first session for simplicity (or allow selection)
    const session = clientSessions.value[0];
    session.startDate = postponeDate.value;
    session.time = postponeTime.value;
    session.status = 'postponed';
    await store.usersActions.addSubItem(session.id, 'users', 'notes', { note: `Booking postponed to ${postponeDate.value} at ${postponeTime.value}`, createdAt: new Date() });
    await store.sessionsActions.update(session.id, { startDate: postponeDate.value, time: postponeTime.value, status: 'postponed' });
    toast.success('Booking postponed successfully!');
    closePostponeModal();
  } catch (err) { toast.error('Failed to postpone'); console.error(err); }
  finally { updating.value = false; }
};

// --- On mounted ---
onMounted(async () => {
  await fetchClient(clientId);
});
</script>
