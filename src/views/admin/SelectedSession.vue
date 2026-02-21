<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-24 pb-20 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <!-- Header with Back Button -->
      <div class="flex items-center gap-4 mb-8">
        <button @click="goBack" class="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all">
          <i class="fas fa-arrow-left text-[var(--color-primary)]"></i>
        </button>
        <h1 class="font-serif text-2xl sm:text-3xl text-[var(--color-primary)] flex items-center gap-2">
          <i class="fas fa-calendar-alt"></i> Session Details
        </h1>
      </div>

      <!-- Loader -->
      <Loader v-if="loading" :loading="loading" class="mx-auto my-20"/>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-3xl shadow-xl p-8 text-center">
        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button @click="fetchSession" class="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/80 transition-all">
          <i class="fas fa-sync-alt mr-2"></i>Try Again
        </button>
      </div>

      <!-- Session Not Found -->
      <div v-else-if="!session" class="bg-white rounded-3xl shadow-xl p-8 text-center">
        <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Session Not Found</h2>
        <p class="text-gray-500 mb-4">The session you're looking for doesn't exist or has been removed.</p>
        <button @click="goBack" class="px-6 py-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary)]/80 transition-all">
          <i class="fas fa-arrow-left mr-2"></i>Go Back
        </button>
      </div>

      <!-- Session Content -->
      <div v-else class="space-y-6">
        <!-- Status Banner -->
        <div :class="{
          'bg-green-50 border-green-200': session?.status === 'confirmed',
          'bg-yellow-50 border-yellow-200': session?.status === 'pending',
          'bg-red-50 border-red-200': session?.status === 'cancelled',
          'bg-orange-50 border-orange-200': session?.status === 'postponed'
        }" class="border rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div class="flex items-center gap-3">
            <div :class="{
              'bg-green-500': session?.status === 'confirmed',
              'bg-yellow-500': session?.status === 'pending',
              'bg-red-500': session?.status === 'cancelled',
              'bg-orange-500': session?.status === 'postponed'
            }" class="w-3 h-3 rounded-full"></div>
            <span class="font-bold text-lg capitalize">{{ session?.status }}</span>
          </div>
          <div class="flex gap-2 w-full sm:w-auto">
            <button @click="openStatusModal('confirmed')" class="flex-1 sm:flex-none px-4 py-2 bg-green-500 text-white rounded-xl text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-1">
              <i class="fas fa-check-circle"></i> Confirm
            </button>
            <button @click="openStatusModal('cancelled')" class="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-xl text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-1">
              <i class="fas fa-times-circle"></i> Cancel
            </button>
            <button @click="openPostponeModal" class="flex-1 sm:flex-none px-4 py-2 bg-yellow-500 text-white rounded-xl text-sm hover:bg-yellow-600 transition-all flex items-center justify-center gap-1">
              <i class="fas fa-clock"></i> Postpone
            </button>
          </div>
        </div>

        <!-- Main Info Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Client Info Card -->
          <div class="bg-white rounded-3xl shadow-xl p-6 lg:col-span-2">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-primary)]">
              <i class="fas fa-user-circle"></i> Client Information
            </h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="fas" :class="session?.isOrganization ? 'fa-building' : 'fa-user'"></i>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Name</div>
                  <div class="font-bold">{{ session?.isOrganization ? session?.organizationName : session?.fullName || 'N/A' }}</div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-if="session?.isOrganization">
                  <div class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-user-tie"></i> Contact Person
                  </div>
                  <div>{{ session?.contactPerson || 'N/A' }}</div>
                </div>
                <div v-else>
                  <div class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-envelope"></i> Email
                  </div>
                  <div>{{ session?.email || 'N/A' }}</div>
                </div>
                
                <div v-if="session?.isOrganization">
                  <div class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-envelope"></i> Email
                  </div>
                  <div>{{ session?.email || 'N/A' }}</div>
                </div>
                
                <div>
                  <div class="text-sm text-gray-500 flex items-center gap-1">
                    <i class="fas fa-phone"></i> Phone
                  </div>
                  <div>{{ session?.phone || 'N/A' }}</div>
                </div>
              </div>

              <div v-if="session?.address">
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-map-marker-alt"></i> Address
                </div>
                <div>{{ session.address }}</div>
              </div>

              <div v-if="session?.notes">
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-sticky-note"></i> Additional Notes
                </div>
                <div class="bg-gray-50 p-3 rounded-xl text-sm">{{ session.notes }}</div>
              </div>
            </div>
          </div>

          <!-- Session Info Card -->
          <div class="bg-white rounded-3xl shadow-xl p-6">
            <h2 class="font-bold text-lg mb-4 flex items-center gap-2 text-[var(--color-primary)]">
              <i class="fas fa-clock"></i> Session Details
            </h2>
            <div class="space-y-4">
              <div>
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-briefcase"></i> Service
                </div>
                <div class="font-bold">{{ session?.service?.title || 'N/A' }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-calendar-day"></i> Date
                </div>
                <div class="font-bold">{{ formatDate(session?.startDate) }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-clock"></i> Time
                </div>
                <div class="font-bold">{{ formatTime(session?.time) }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-hourglass-half"></i> Duration
                </div>
                <div class="font-bold">{{ session?.duration || '60' }} minutes</div>
              </div>

              <div v-if="session?.price">
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-tag"></i> Price
                </div>
                <div class="font-bold text-lg text-[var(--color-primary)]">${{ session.price }}</div>
              </div>

              <div>
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-calendar-plus"></i> Created
                </div>
                <div>{{ formatDateTime(session?.createdAt) }}</div>
              </div>

              <div v-if="session?.updatedAt">
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-edit"></i> Last Updated
                </div>
                <div>{{ formatDateTime(session?.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div class="bg-white rounded-3xl shadow-xl p-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 class="font-bold text-lg flex items-center gap-2 text-[var(--color-primary)]">
              <i class="fas fa-sticky-note"></i> Session Notes ({{ notes.length }})
            </h2>
            <button @click="openAddNoteModal" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl text-sm hover:bg-[var(--color-primary)]/80 transition-all flex items-center gap-1">
              <i class="fas fa-plus"></i> Add Note
            </button>
          </div>

          <!-- Notes List -->
          <div v-if="notes.length" class="space-y-4">
            <div v-for="note in sortedNotes" :key="note.id" class="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
              <div class="flex justify-between items-start gap-4 mb-2">
                <div class="text-sm text-gray-500 flex items-center gap-1">
                  <i class="fas fa-clock"></i>
                  {{ formatDateTime(note.createdAt) }}
                </div>
                <button @click="deleteNote(note.id)" class="text-gray-400 hover:text-red-500 transition-colors">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
              <p class="text-gray-700 whitespace-pre-wrap">{{ note.note }}</p>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">
            <i class="fas fa-sticky-note text-3xl mb-2"></i>
            <p>No notes yet</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3">
          <button @click="printSession" class="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <i class="fas fa-print"></i> Print Details
          </button>
          <button @click="sendReminder" class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <i class="fas fa-bell"></i> Send Reminder
          </button>
        </div>
      </div>
    </div>

    <!-- Status Change Modal -->
    <div v-if="showStatusModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeStatusModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2" :class="{
          'text-green-600': statusAction === 'confirmed',
          'text-red-600': statusAction === 'cancelled'
        }">
          <i :class="{
            'fas fa-check-circle': statusAction === 'confirmed',
            'fas fa-times-circle': statusAction === 'cancelled'
          }"></i>
          {{ statusAction === 'confirmed' ? 'Confirm Booking' : 'Cancel Booking' }}
        </h3>
        
        <p class="text-gray-600 mb-4">
          Are you sure you want to {{ statusAction }} this booking?
        </p>

        <textarea v-model="statusNote" rows="3" class="w-full border rounded-md p-2 mb-4" :placeholder="`Add a note about why this is ${statusAction} (optional)`"></textarea>

        <div class="flex flex-col sm:flex-row justify-end gap-2">
          <button @click="updateBookingStatus" class="px-4 py-2" :class="{
            'bg-green-500 hover:bg-green-600': statusAction === 'confirmed',
            'bg-red-500 hover:bg-red-600': statusAction === 'cancelled'
          }" :disabled="updating">
            <span v-if="!updating">Yes, {{ statusAction }}</span>
            <Loader v-else class="h-4 w-4"/>
          </button>
          <button @click="closeStatusModal" class="px-4 py-2 border rounded-md">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Add Note Modal -->
    <div v-if="showAddNoteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeAddNoteModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2 text-[var(--color-primary)]">
          <i class="fas fa-sticky-note"></i> Add Note
        </h3>
        <textarea v-model="newNote" rows="4" class="w-full border rounded-md p-2 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" placeholder="Enter your note here..."></textarea>
        <div class="mt-3 flex flex-col sm:flex-row justify-end gap-2">
          <button @click="addNote" class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md flex items-center justify-center gap-1" :disabled="addingNote">
            <i class="fas fa-plus"></i>
            <span v-if="!addingNote">Add Note</span>
            <Loader v-else class="h-4 w-4"/>
          </button>
          <button @click="closeAddNoteModal" class="px-4 py-2 border rounded-md">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Postpone Modal -->
    <div v-if="showPostponeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closePostponeModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2 text-yellow-500">
          <i class="fas fa-calendar-alt"></i> Postpone Booking
        </h3>
        
        <div class="space-y-3">
          <div>
            <label class="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <i class="fas fa-calendar-day"></i> New Date
            </label>
            <input 
              type="date" 
              v-model="postponeDate" 
              :min="minDate"
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              @change="validateDateTime"
            />
          </div>
          
          <div>
            <label class="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <i class="fas fa-clock"></i> New Time
            </label>
            <input 
              type="time" 
              v-model="postponeTime" 
              :min="minTimeForSelectedDate"
              class="w-full border rounded-md p-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              @change="validateDateTime"
            />
          </div>

          <p v-if="dateTimeError" class="text-xs text-red-500 flex items-center gap-1">
            <i class="fas fa-exclamation-circle"></i> {{ dateTimeError }}
          </p>

          <textarea v-model="postponeNote" rows="2" class="w-full border rounded-md p-2" placeholder="Reason for postponement (optional)"></textarea>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <button @click="postponeBooking" class="px-4 py-2 bg-yellow-500 text-white rounded-md flex items-center justify-center gap-1" :disabled="updating || !isDateTimeValid">
            <i class="fas fa-save"></i>
            <span v-if="!updating">Postpone</span>
            <Loader v-else class="h-4 w-4"/>
          </button>
          <button @click="closePostponeModal" class="px-4 py-2 border rounded-md">Cancel</button>
        </div>
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import Loader from '@/components/SkeletonLoader.vue';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const sessionId = computed(() => route.params.id);

const loading = ref(true);
const error = ref('');
const session = ref(null);
const notes = ref([]);

// Status Modal
const showStatusModal = ref(false);
const statusAction = ref('');
const statusNote = ref('');

// Note Modal
const showAddNoteModal = ref(false);
const newNote = ref('');

// Postpone Modal
const showPostponeModal = ref(false);
const postponeDate = ref('');
const postponeTime = ref('');
const postponeNote = ref('');
const dateTimeError = ref('');

// UI State
const updating = ref(false);
const addingNote = ref(false);

// Date/Time Validation
const now = new Date();
const minDate = computed(() => {
  const date = new Date();
  return date.toISOString().split('T')[0];
});

const minTimeForSelectedDate = computed(() => {
  if (!postponeDate.value) return '00:00';
  
  const selectedDate = new Date(postponeDate.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate.getTime() === today.getTime()) {
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const hours = threeHoursFromNow.getHours().toString().padStart(2, '0');
    const minutes = threeHoursFromNow.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  return '00:00';
});

const isDateTimeValid = computed(() => {
  if (!postponeDate.value || !postponeTime.value) return false;
  
  const selectedDateTime = new Date(`${postponeDate.value}T${postponeTime.value}`);
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  return selectedDateTime >= threeHoursFromNow;
});

const validateDateTime = () => {
  if (!postponeDate.value || !postponeTime.value) {
    dateTimeError.value = 'Please select both date and time';
    return false;
  }
  
  const selectedDateTime = new Date(`${postponeDate.value}T${postponeTime.value}`);
  const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  
  if (selectedDateTime < threeHoursFromNow) {
    dateTimeError.value = 'Selected time must be at least 3 hours from now';
    return false;
  }
  
  dateTimeError.value = '';
  return true;
};

// Sorted notes by date (newest first)
const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );
});

// Formatting functions
const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return date;
  }
};

const formatTime = (time) => {
  if (!time) return 'N/A';
  try {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric'
    });
  } catch {
    return time;
  }
};

const formatDateTime = (datetime) => {
  if (!datetime) return 'N/A';
  try {
    return new Date(datetime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  } catch {
    return datetime;
  }
};

// Navigation
const goBack = () => {
  router.back();
};

// Fetch session data
const fetchSession = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // Fetch session details
    const sessionData = await store.sessionsActions.getById(sessionId.value);
    if (!sessionData) {
      throw new Error('Session not found');
    }
    session.value = sessionData;
    
    // Fetch notes
    const notesData = await store.sessionsActions.fetchSubItems(sessionId.value, 'sessions', 'notes');
    notes.value = notesData || [];
    
  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.message || 'Failed to load session';
    toast.error('Failed to load session details');
  } finally {
    loading.value = false;
  }
};

// Status Management
const openStatusModal = (action) => {
  statusAction.value = action;
  statusNote.value = '';
  showStatusModal.value = true;
};

const closeStatusModal = () => {
  showStatusModal.value = false;
  statusAction.value = '';
  statusNote.value = '';
};

const updateBookingStatus = async () => {
  updating.value = true;
  
  try {
    // Update status
    await store.sessionsActions.update(sessionId.value, { 
      status: statusAction.value 
    });
    
    // Add note if provided
    if (statusNote.value.trim()) {
      await store.sessionsActions.addSubItem(sessionId.value, 'sessions', 'notes', {
        note: `Status changed to ${statusAction.value}: ${statusNote.value}`,
        createdAt: new Date().toISOString()
      });
    } else {
      // Add automatic note
      await store.sessionsActions.addSubItem(sessionId.value, 'sessions', 'notes', {
        note: `Status changed to ${statusAction.value}`,
        createdAt: new Date().toISOString()
      });
    }
    
    // Refresh session data
    await fetchSession();
    
    toast.success(`Booking ${statusAction.value} successfully!`, {
      icon: statusAction.value === 'confirmed' ? '✅' : '❌'
    });
    
    closeStatusModal();
  } catch (err) {
    console.error('Update error:', err);
    toast.error('Failed to update booking');
  } finally {
    updating.value = false;
  }
};

// Notes Management
const openAddNoteModal = () => {
  newNote.value = '';
  showAddNoteModal.value = true;
};

const closeAddNoteModal = () => {
  showAddNoteModal.value = false;
  newNote.value = '';
};

const addNote = async () => {
  if (!newNote.value.trim()) {
    toast.error('Note cannot be empty');
    return;
  }
  
  addingNote.value = true;
  
  try {
    await store.sessionsActions.addSubItem(sessionId.value, 'sessions', 'notes', {
      note: newNote.value,
      createdAt: new Date().toISOString()
    });
        /** 
     * Fetch items from subcollection
     * @param {string} parentId - Parent document ID
     * @param {string|Date} shardSource - Parent shard
     * @param {string} subColName - Subcollection name
     * @param {Object} [options] - Options including sort, pageSize
     * @returns {Promise<Array>} Subdocuments
     * 
     * fetchSubItems: (parentId, shardSource, subColName, options = {}) => 
      subcollectionManager.fetchSubItems(parentId, shardSource, subColName, options),
     */
    
    // Refresh notes
    const notesData = await store.sessionsActions.fetchSubItems(sessionId.value, 'sessions', 'notes');

    notes.value = notesData || [];
    
    toast.success('Note added successfully!', { icon: '📝' });
    closeAddNoteModal();
  } catch (err) {
    console.error('Add note error:', err);
    toast.error('Failed to add note');
  } finally {
    addingNote.value = false;
  }
};

const deleteNote = async (noteId) => {
  if (!confirm('Are you sure you want to delete this note?')) return;
  
  try {
    await store.sessionsActions.deleteSubItem(sessionId.value, 'sessions', 'notes', noteId);
    
    // Refresh notes
    const notesData = await store.sessionsActions.fetchSubItems(sessionId.value, 'sessions', 'notes');
    notes.value = notesData || [];
    
    toast.success('Note deleted successfully!');
  } catch (err) {
    console.error('Delete note error:', err);
    toast.error('Failed to delete note');
  }
};

// Postpone Management
const openPostponeModal = () => {
  postponeDate.value = '';
  postponeTime.value = '';
  postponeNote.value = '';
  dateTimeError.value = '';
  showPostponeModal.value = true;
};

const closePostponeModal = () => {
  showPostponeModal.value = false;
  postponeDate.value = '';
  postponeTime.value = '';
  postponeNote.value = '';
  dateTimeError.value = '';
};

const postponeBooking = async () => {
  if (!validateDateTime()) return;
  
  updating.value = true;
  
  try {
    // Update session
    await store.sessionsActions.update(sessionId.value, {
      startDate: postponeDate.value,
      time: postponeTime.value,
      status: 'postponed'
    });
    
    // Add note
    const noteText = postponeNote.value.trim() 
      ? `Booking postponed to ${formatDate(postponeDate.value)} at ${formatTime(postponeTime.value)}. Reason: ${postponeNote.value}`
      : `Booking postponed to ${formatDate(postponeDate.value)} at ${formatTime(postponeTime.value)}`;
    
    await store.sessionsActions.addSubItem(sessionId.value, 'sessions', 'notes', {
      note: noteText,
      createdAt: new Date().toISOString()
    });
    
    // Refresh session data
    await fetchSession();
    
    toast.success('Booking postponed successfully!', { icon: '📅' });
    closePostponeModal();
  } catch (err) {
    console.error('Postpone error:', err);
    toast.error('Failed to postpone booking');
  } finally {
    updating.value = false;
  }
};

// Additional Actions
const printSession = () => {
  window.print();
};

const sendReminder = async () => {
  try {
    // This would integrate with your notification service
    toast.success('Reminder sent successfully!', { icon: '🔔' });
  } catch (err) {
    toast.error('Failed to send reminder');
  }
};

// Lifecycle
onMounted(() => {
  fetchSession();
});

// Watch for route changes
watch(sessionId, () => {
  fetchSession();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

/* Print styles */
@media print {
  button, .shadow-xl, .bg-black\/50 {
    display: none !important;
  }
  
  body {
    background: white;
  }
  
  .min-h-screen {
    padding: 20px !important;
  }
}

/* Touch targets */
@media (max-width: 640px) {
  button, [role="button"] {
    min-height: 44px;
  }
  
  input, select, textarea {
    font-size: 16px !important;
  }
}
</style>