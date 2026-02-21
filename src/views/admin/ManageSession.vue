<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-24 pb-20 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      <h1 class="font-serif text-3xl sm:text-4xl text-[var(--color-primary)] mb-8 text-center">
        <i class="fas fa-calendar-check mr-3"></i>Manage Bookings
      </h1>

      <!-- Loader -->
      <Loader v-if="loading" class="mx-auto my-20"/>

      <!-- Bookings Table -->
      <div v-else class="bg-white shadow-xl rounded-3xl overflow-hidden">
        <!-- Mobile Card View -->
        <div class="block lg:hidden">
          <div v-if="paginatedBookings.length" class="divide-y divide-gray-100">
            <div v-for="booking in paginatedBookings" :key="booking?.id" class="p-4 hover:bg-gray-50 transition-colors">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <div class="font-bold text-[var(--color-primary)]">
                    {{ booking?.isOrganization ? booking?.organizationName : booking?.fullName || 'N/A' }}
                  </div>
                  <div class="text-gray-400 text-xs flex items-center gap-1">
                    <i class="fas fa-envelope text-[10px]"></i>
                    {{ booking?.isOrganization ? booking?.contactPerson : booking?.email || 'N/A' }}
                  </div>
                </div>
                <span 
                  :class="{
                    'bg-green-50 text-green-700': booking?.status === 'confirmed',
                    'bg-yellow-50 text-yellow-700': booking?.status === 'pending',
                    'bg-red-50 text-red-700': booking?.status === 'cancelled',
                    'bg-orange-50 text-orange-700': booking?.status === 'postponed'
                  }"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                >
                  {{ booking?.status || 'Unknown' }}
                </span>
              </div>
              
              <div class="grid grid-cols-2 gap-2 mb-3 text-sm">
                <div>
                  <div class="text-gray-400 text-xs flex items-center gap-1">
                    <i class="fas fa-briefcase"></i> Service
                  </div>
                  <div>{{ booking?.service?.title || 'N/A' }}</div>
                </div>
                <div>
                  <div class="text-gray-400 text-xs flex items-center gap-1">
                    <i class="fas fa-clock"></i> Date & Time
                  </div>
                  <div>{{ formatDateTime(booking?.startDate, booking?.time) }}</div>
                </div>
              </div>
              
              <div class="flex gap-2 mt-2">
                <button @click="openBookingModal(booking)" class="flex-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-xl text-xs hover:bg-[var(--color-primary)]/80 transition-all flex items-center justify-center gap-1">
                  <i class="fas fa-cog"></i> Manage
                </button>
                <button @click="openAddNoteModal(booking)" class="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs hover:bg-gray-300 transition-all flex items-center justify-center gap-1">
                  <i class="fas fa-sticky-note"></i> Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <table class="w-full text-sm hidden lg:table">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="p-4 text-left uppercase text-xs text-gray-400">
                <i class="fas fa-user mr-2"></i>Client / Organization
              </th>
              <th class="p-4 text-left uppercase text-xs text-gray-400">
                <i class="fas fa-briefcase mr-2"></i>Service
              </th>
              <th class="p-4 text-left uppercase text-xs text-gray-400">
                <i class="fas fa-clock mr-2"></i>Date & Time
              </th>
              <th class="p-4 text-left uppercase text-xs text-gray-400">
                <i class="fas fa-circle mr-2"></i>Status
              </th>
              <th class="p-4 text-left uppercase text-xs text-gray-400">
                <i class="fas fa-tools mr-2"></i>Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" v-for="n in bookingsPerPage" :key="'skeleton-'+n" class="border-b border-gray-100">
              <td class="p-4"><Loader class="h-4 w-32"/></td>
              <td class="p-4"><Loader class="h-4 w-24"/></td>
              <td class="p-4"><Loader class="h-4 w-40"/></td>
              <td class="p-4"><Loader class="h-4 w-20 rounded-full"/></td>
              <td class="p-4"><Loader class="h-4 w-20 rounded-full"/></td>
            </tr>

            <!-- Actual Bookings -->
            <tr v-else v-for="booking in paginatedBookings" :key="booking?.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td class="p-4">
                <div class="font-bold flex items-center gap-1">
                  <i class="fas fa-building" v-if="booking?.isOrganization"></i>
                  <i class="fas fa-user" v-else></i>
                  {{ booking?.isOrganization ? booking?.organizationName : booking?.fullName || 'N/A' }}
                </div>
                <div class="text-gray-400 text-xs flex items-center gap-1">
                  <i class="fas fa-envelope"></i>
                  {{ booking?.isOrganization ? booking?.contactPerson : booking?.email || 'N/A' }}
                </div>
              </td>
              <td class="p-4">{{ booking?.service?.title || 'N/A' }}</td>
              <td class="p-4">{{ formatDateTime(booking?.startDate, booking?.time) }}</td>
              <td class="p-4">
                <span 
                  :class="{
                    'bg-green-50 text-green-700': booking?.status === 'confirmed',
                    'bg-yellow-50 text-yellow-700': booking?.status === 'pending',
                    'bg-red-50 text-red-700': booking?.status === 'cancelled',
                    'bg-orange-50 text-orange-700': booking?.status === 'postponed'
                  }"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit"
                >
                  <i class="fas fa-circle text-[6px]"></i>
                  {{ booking?.status || 'Unknown' }}
                </span>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <!-- Manage Button -->
                  <button @click="openBookingModal(booking)" 
                    class="px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-xs hover:bg-[var(--color-primary)]/80 transition-all flex items-center gap-1.5 shadow-sm hover:shadow">
                    <i class="fas fa-cog text-[10px]"></i>
                    <span>Manage</span>
                  </button>

                  <!-- Add Note Button -->
                  <button @click="openAddNoteModal(booking)" 
                    class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-all flex items-center gap-1.5">
                    <i class="fas fa-sticky-note text-[10px]"></i>
                    <span>Note</span>
                  </button>

                  <!-- View Details Link -->
                  <router-link :to="`/pra/sessions/${booking.id}/view`" 
                    class="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs hover:bg-green-100 transition-all flex items-center gap-1.5 group">
                    <i class="fas fa-eye text-[10px]"></i>
                    <span>View</span>
                    <i class="fas fa-chevron-right text-[8px] transition-transform group-hover:translate-x-0.5"></i>
                  </router-link>
                </div>
              </td>
            </tr>

            <tr v-if="!loading && !paginatedBookings.length">
              <td colspan="5" class="p-8 text-center text-gray-400">
                <i class="fas fa-calendar-times text-3xl mb-2"></i>
                <div>No bookings found.</div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="paginatedBookings.length" class="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-100 bg-gray-50">
          <button @click="prevPage" :disabled="currentPage === 1" 
            class="w-full sm:w-auto px-4 py-2 border rounded-full text-xs disabled:opacity-40 flex items-center justify-center gap-1 hover:bg-white transition-all">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <i class="fas fa-file"></i> Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button @click="nextPage" :disabled="currentPage === totalPages" 
            class="w-full sm:w-auto px-4 py-2 border rounded-full text-xs disabled:opacity-40 flex items-center justify-center gap-1 hover:bg-white transition-all">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Manage Booking Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
        <h2 class="font-serif text-2xl text-[var(--color-primary)] mb-4 flex items-center gap-2">
          <i class="fas fa-cog"></i> Manage Booking
        </h2>
        <p class="text-sm text-gray-500 mb-6 flex items-center gap-1">
          <i class="fas fa-user"></i>
          Client: <span class="font-bold">{{ selectedBooking?.isOrganization ? selectedBooking?.organizationName : selectedBooking?.fullName || 'N/A' }}</span>
        </p>

        <div class="space-y-3">
          <button @click="updateBookingStatus('confirmed')" 
            class="w-full py-3 bg-green-500 text-white rounded-2xl text-sm font-bold hover:bg-green-600 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg" 
            :disabled="updating">
            <i class="fas fa-check-circle"></i>
            <span v-if="!updating">Confirm Booking</span>
            <Loader v-else :loading="true" class="h-4 w-4"/>
          </button>

          <button @click="updateBookingStatus('cancelled')" 
            class="w-full py-3 bg-red-500 text-white rounded-2xl text-sm font-bold hover:bg-red-600 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg" 
            :disabled="updating">
            <i class="fas fa-times-circle"></i>
            <span v-if="!updating">Cancel Booking</span>
            <Loader v-else class="h-4 w-4"/>
          </button>

          <button @click="openPostponeModal()" 
            class="w-full py-3 bg-yellow-500 text-white rounded-2xl text-sm font-bold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
            <i class="fas fa-clock"></i> Postpone Booking
          </button>
        </div>

        <button @click="closeModal" 
          class="mt-6 w-full py-2 text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest font-bold flex items-center justify-center gap-1">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>

    <!-- Notes Modal -->
    <div v-if="showNoteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closeNoteModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2">
          <i class="fas fa-sticky-note text-[var(--color-primary)]"></i> Add Note
        </h3>
        <textarea v-model="newNote" rows="4" 
          class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent" 
          placeholder="Enter your note here..."></textarea>
        <div class="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <button @click="addNote" 
            class="px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center gap-1 hover:bg-[var(--color-primary)]/80 transition-all" 
            :disabled="addingNote">
            <i class="fas fa-plus"></i>
            <span v-if="!addingNote">Add Note</span>
            <Loader v-else class="h-4 w-4"/>
          </button>
          <button @click="closeNoteModal" 
            class="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Postpone Modal -->
    <div v-if="showPostponeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="closePostponeModal">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <h3 class="font-bold text-lg mb-3 flex items-center gap-2">
          <i class="fas fa-calendar-alt text-yellow-500"></i> Postpone Booking
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="text-xs text-gray-500 flex items-center gap-1 mb-1">
              <i class="fas fa-calendar-day"></i> New Date
            </label>
            <input 
              type="date" 
              v-model="postponeDate" 
              :min="minDate"
              class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              class="w-full border rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              @change="validateDateTime"
            />
          </div>

          <p v-if="dateTimeError" class="text-xs text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
            <i class="fas fa-exclamation-circle"></i> {{ dateTimeError }}
          </p>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button @click="postponeBooking" 
            class="px-4 py-2 bg-yellow-500 text-white rounded-xl flex items-center justify-center gap-1 hover:bg-yellow-600 transition-all" 
            :disabled="updating || !isDateTimeValid">
            <i class="fas fa-save"></i>
            <span v-if="!updating">Postpone Booking</span>
            <Loader v-else class="h-4 w-4"/>
          </button>
          <button @click="closePostponeModal" 
            class="px-4 py-2 border rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-1">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    </div>

    <Toaster position="top-right" :rich-colors="true" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import Loader from '@/components/SkeletonLoader.vue';
import { Toaster, toast } from 'vue-sonner';
import 'vue-sonner/style.css';

const router = useRouter();
const store = useAppStore();
const loading = ref(true);
const updating = ref(false);
const addingNote = ref(false);
const dateTimeError = ref('');

// --- Pagination ---
const bookingsPerPage = 8;
const currentPage = ref(1);
const allBookings = ref([]);
const totalPages = computed(() => Math.max(Math.ceil(allBookings.value?.length / bookingsPerPage), 1));
const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * bookingsPerPage;
  return allBookings.value?.slice(start, start + bookingsPerPage) || [];
});
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };
const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };

// --- Date/Time Validation ---
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

// Format date/time for display
const formatDateTime = (date, time) => {
  if (!date || !time) return 'TBD';
  try {
    const dateObj = new Date(`${date}T${time}`);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(dateObj);
  } catch {
    return `${date} at ${time}`;
  }
};

// View session details
const viewSessionDetails = (bookingId) => {
  router.push(`/pra/sessions/${bookingId}/view`);
};

// --- Booking Modals ---
const showModal = ref(false);
const showNoteModal = ref(false);
const showPostponeModal = ref(false);
const selectedBooking = reactive({});
const newNote = ref('');
const postponeDate = ref('');
const postponeTime = ref('');

const openBookingModal = (booking = {}) => { 
  if (!booking?.id) {
    toast.error('Invalid booking selected');
    return;
  }
  Object.assign(selectedBooking, JSON.parse(JSON.stringify(booking || {}))); 
  showModal.value = true; 
};

const closeModal = () => { 
  showModal.value = false; 
  Object.keys(selectedBooking).forEach(key => delete selectedBooking[key]);
};

const openAddNoteModal = (booking) => { 
  if (!booking?.id) {
    toast.error('Invalid booking selected');
    return;
  }
  Object.assign(selectedBooking, JSON.parse(JSON.stringify(booking || {}))); 
  newNote.value = ''; 
  showNoteModal.value = true; 
};

const closeNoteModal = () => { 
  showNoteModal.value = false; 
  newNote.value = '';
};

const openPostponeModal = () => { 
  postponeDate.value = '';
  postponeTime.value = '';
  dateTimeError.value = '';
  showPostponeModal.value = true; 
};

const closePostponeModal = () => { 
  showPostponeModal.value = false; 
  postponeDate.value = '';
  postponeTime.value = '';
  dateTimeError.value = '';
};

// --- Status & Notes ---
const updateBookingStatus = async (status) => {
  if (!selectedBooking.id) {
    toast.error('Booking not loaded.');
    return;
  }
  
  updating.value = true;
  try {
    const idx = allBookings.value.findIndex(b => b.id === selectedBooking.id);
    if (idx !== -1) {
      allBookings.value[idx] = { ...allBookings.value[idx], status };
    }
    
    await store.sessionsActions.addSubItem(selectedBooking.id, 'sessions', 'notes', { 
      note: `Status changed to ${status}`, 
      createdAt: new Date().toISOString() 
    });

    await store.sessionsActions.update(selectedBooking.id, { status });
    toast.success(`Booking ${status} successfully!`, {
      icon: status === 'confirmed' ? '✅' : '❌'
    });
    closeModal();
  } catch (err) {
    toast.error('Failed to update booking');
    console.error('Update error:', err);
  } finally { 
    updating.value = false; 
  }
};

const addNote = async () => {
  if (!newNote.value.trim()) {
    toast.error('Note cannot be empty');
    return;
  }
  
  addingNote.value = true;
  try {
    await store.sessionsActions.addSubItem(selectedBooking.id, 'sessions', 'notes', { 
      note: newNote.value, 
      createdAt: new Date().toISOString() 
    });
    toast.success('Note added successfully!', { icon: '📝' });
    closeNoteModal();
  } catch (err) { 
    toast.error('Failed to add note'); 
    console.error('Note error:', err); 
  } finally { 
    addingNote.value = false; 
  }
};

// --- Postpone Booking ---
const postponeBooking = async () => {
  if (!validateDateTime()) return;
  
  updating.value = true;
  try {
    const idx = allBookings.value.findIndex(b => b.id === selectedBooking.id);
    if (idx !== -1) {
      allBookings.value[idx] = {
        ...allBookings.value[idx],
        startDate: postponeDate.value,
        time: postponeTime.value,
        status: 'postponed'
      };
    }

    await store.sessionsActions.addSubItem(selectedBooking.id, 'sessions', 'notes', { 
      note: `Booking postponed to ${formatDateTime(postponeDate.value, postponeTime.value)}`, 
      createdAt: new Date().toISOString() 
    });
    
    await store.sessionsActions.update(selectedBooking.id, { 
      startDate: postponeDate.value, 
      time: postponeTime.value, 
      status: 'postponed' 
    });
    
    toast.success('Booking postponed successfully!', { icon: '📅' });
    closeModal();
    closePostponeModal();
  } catch (err) { 
    toast.error('Failed to postpone booking'); 
    console.error('Postpone error:', err); 
  } finally { 
    updating.value = false; 
  }
};

// --- Fetch Bookings ---
onMounted(async () => {
  try {
    await store.sessionsActions.fetchInitialPage();
    allBookings.value = store.sessions.items || [];
  } catch (err) { 
    toast.error('Failed to fetch bookings'); 
    console.error('Fetch error:', err); 
  } finally { 
    loading.value = false; 
  }
});

// Watch for modal close to reset
watch(showPostponeModal, (newVal) => {
  if (!newVal) {
    postponeDate.value = '';
    postponeTime.value = '';
    dateTimeError.value = '';
  }
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

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button, 
  [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  input, 
  select, 
  textarea {
    font-size: 16px !important;
  }
}

/* Hover effects for table rows */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Smooth transitions */
button, a {
  transition: all 0.2s ease;
}
</style>