<template>
  <div class="min-h-screen bg-[#F8F8F7] pt-6 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold italic">Practitioner Portal</span>
          <div class="flex items-center gap-4 mt-2">
            <h1 class="font-serif text-4xl text-[var(--color-primary)]">{{ currentCalendarTitle }}</h1>
            <div class="flex gap-1 ml-4">
              <button @click="navigateDate(-1)" class="p-2 hover:text-[var(--color-secondary)] transition-colors"><i class="fas fa-chevron-left text-xs"></i></button>
              <button @click="setToday" class="px-3 py-1 text-[9px] font-bold uppercase tracking-widest border border-gray-200 rounded-lg hover:bg-white">Today</button>
              <button @click="navigateDate(1)" class="p-2 hover:text-[var(--color-secondary)] transition-colors"><i class="fas fa-chevron-right text-xs"></i></button>
            </div>
          </div>
        </div>
        
        <div class="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          <button v-for="view in ['Day', 'Week', 'Month']" :key="view"
                  @click="currentView = view"
                  class="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all"
                  :class="currentView === view ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-gray-400 hover:text-[var(--color-primary)]'">
            {{ view }}
          </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
        <main class="lg:col-span-8">
          <transition name="fade" mode="out-in">
            <div v-if="currentView === 'Day'" class="space-y-4">
              <div v-for="slot in dayTimeline" :key="slot.time" class="group relative flex gap-6">
                <div class="w-16 pt-2 text-right">
                  <span class="text-[10px] font-bold text-gray-400 tracking-tighter">{{ slot.time }}</span>
                </div>
                <div class="flex-1 pb-6">
                  <div v-if="slot.booking" 
                       class="bg-white border-l-4 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md"
                       :class="getCardClass(slot.booking)">
                    <div class="flex justify-between items-start">
                      <div @click="viewClientDetails(slot.booking)">
                        <div class="flex items-center gap-3 mb-1">
                          <span class="text-[9px] uppercase font-bold tracking-widest" :class="slot.booking.isBlocked ? 'text-red-400' : 'text-[var(--color-secondary)]'">
                            {{ slot.booking.isBlocked ? 'Restricted Slot' : slot.booking.service }}
                          </span>
                          <span v-if="slot.booking.isOnline" class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-bold uppercase">Online</span>
                        </div>
                        <h3 class="font-serif text-lg text-[var(--color-primary)]">{{ slot.booking.clientName }}</h3>
                        <p v-if="!slot.booking.isBlocked" class="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <i class="fab fa-whatsapp text-green-500"></i> {{ slot.booking.phone }}
                        </p>
                      </div>
                      <div class="flex gap-2">
                        <button v-if="!slot.booking.isBlocked" @click="openReschedule(slot.booking)" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                          <i class="fas fa-calendar-alt text-xs"></i>
                        </button>
                        <button @click="handleCancelOrUnblock(slot.booking)" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <i class="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="!isPast(slot.time)" 
                       class="h-20 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center group-hover:border-gray-200 transition-all">
                    <button @click="blockSlot(slot.time)" class="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 group-hover:text-[var(--color-primary)]">
                      + Block Manually
                    </button>
                  </div>
                  <div v-else class="h-12 flex items-center px-6 opacity-40 italic text-xs text-gray-400">Time Period Concluded</div>
                </div>
              </div>
            </div>

            <div v-else class="bg-white rounded-[40px] p-20 text-center border border-dashed border-gray-200">
               <i class="fas fa-calendar-week text-4xl text-gray-100 mb-4"></i>
               <p class="font-serif text-xl text-gray-300 italic">{{ currentView }} View Matrix loading...</p>
            </div>
          </transition>
        </main>

        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-[var(--color-primary)] rounded-[32px] p-8 text-white shadow-xl shadow-[var(--color-primary)]/10">
            <h3 class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-6">Schedule Health</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p class="text-2xl font-serif">{{ stats.totalHours }}</p>
                <p class="text-[9px] uppercase opacity-50 font-bold">Planned Hours</p>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p class="text-2xl font-serif">{{ stats.sessionCount }}</p>
                <p class="text-[9px] uppercase opacity-50 font-bold">Confirmed</p>
              </div>
            </div>
            <div class="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <span class="text-[10px] font-bold uppercase opacity-40">Utilization</span>
              <span class="text-sm font-serif italic">{{ stats.utilization }}%</span>
            </div>
          </div>

          <div class="p-8 bg-white rounded-[32px] border border-gray-100">
            <h4 class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Management Protocol</h4>
            <div class="space-y-3">
              <button @click="blockEntireDay" 
                      class="w-full py-4 rounded-2xl border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                <i class="fas fa-ban text-[10px]"></i> Block Entire Day
              </button>
              <button class="w-full py-4 rounded-2xl border border-gray-100 text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                Export Daily Log (PDF)
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <transition name="fade">
      <div v-if="activeReschedule" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[var(--color-primary)]/40 backdrop-blur-sm">
        <div class="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
          <h2 class="font-serif text-2xl text-[var(--color-primary)] mb-2">Reschedule Session</h2>
          <p class="text-sm text-gray-500 mb-8">Move <b>{{ activeReschedule.clientName }}</b> to a new date.</p>
          <div class="space-y-6">
            <div>
              <label class="text-[10px] uppercase font-bold text-gray-400 block mb-2 tracking-widest">Select New Date</label>
              <input type="date" :min="minDate" v-model="rescheduleDate" class="w-full p-4 bg-[#FAFAF9] rounded-2xl border-none outline-none focus:ring-2 ring-[var(--color-secondary)] transition-all">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <button @click="activeReschedule = null" class="py-4 rounded-full text-xs font-bold uppercase text-gray-400 tracking-widest">Cancel</button>
              <button @click="processReschedule" class="py-4 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20">Confirm Move</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

/**
 * @typedef {Object} Booking
 * @property {number|string} id - Unique identifier for the booking
 * @property {string} clientName - Full name of the client
 * @property {string} service - Title of service (e.g., 'Individual Counselling')
 * @property {string} phone - Contact number (Namibia format)
 * @property {boolean} isOnline - True if session is virtual
 * @property {string} status - 'confirmed' | 'rescheduling' | 'cancelled'
 * @property {boolean} [isBlocked] - True if slot is manually restricted by admin
 */

/** @type {import('vue').Ref<string>} */
const currentView = ref('Day');

/** @type {import('vue').Ref<Date>} */
const selectedDate = ref(new Date());

/** @type {import('vue').Ref<Booking|null>} */
const activeReschedule = ref(null);
const rescheduleDate = ref('');

const minDate = new Date().toISOString().split('T')[0];

/** @type {Booking[]} */
const dayTimeline = ref([
  { time: '08:00', booking: { id: 1, clientName: 'Ndapewa S.', service: 'Individual', phone: '+264 81 234 5678', isOnline: true, status: 'confirmed' } },
  { time: '09:00', booking: null },
  { time: '10:00', booking: { id: 2, clientName: 'Corporate: MTC Team', service: 'Wellness Event', phone: '+264 81 999 0000', isOnline: false, status: 'confirmed' } },
  { time: '11:00', booking: null },
  { time: '14:00', booking: null },
  { time: '15:00', booking: null },
]);

/**
 * @description Stats for the aside panel computed from timeline data
 */
const stats = computed(() => ({
  totalHours: dayTimeline.value.length,
  sessionCount: dayTimeline.value.filter(s => s.booking && !s.booking.isBlocked).length,
  utilization: Math.round((dayTimeline.value.filter(s => s.booking).length / dayTimeline.value.length) * 100)
}));

const currentCalendarTitle = computed(() => {
  return selectedDate.value.toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });
});

/**
 * @function isPast
 * @description Prevents interaction with historical slots
 * @param {string} timeStr - HH:mm format
 * @returns {boolean}
 */
const isPast = (timeStr) => {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':');
  const slotTime = new Date(selectedDate.value);
  slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return slotTime < now;
};

/**
 * @function blockEntireDay
 * @description Bulk updates all empty slots for the selected date to 'Blocked'
 */
const blockEntireDay = () => {
  if (confirm("This will prevent all new bookings for today. Proceed?")) {
    dayTimeline.value = dayTimeline.value.map(slot => {
      if (!slot.booking && !isPast(slot.time)) {
        return { ...slot, booking: { id: Date.now(), clientName: 'Admin Restricted', isBlocked: true } };
      }
      return slot;
    });
  }
};

/**
 * @function blockSlot
 * @description Manually restricts a single time slot
 * @param {string} time
 */
const blockSlot = (time) => {
  const slotIndex = dayTimeline.value.findIndex(s => s.time === time);
  dayTimeline.value[slotIndex].booking = { id: Date.now(), clientName: 'Manual Block', isBlocked: true };
};

/**
 * @function handleCancelOrUnblock
 * @param {Booking} booking 
 */
const handleCancelOrUnblock = (booking) => {
  if (booking.isBlocked) {
    const slotIndex = dayTimeline.value.findIndex(s => s.booking?.id === booking.id);
    dayTimeline.value[slotIndex].booking = null;
  } else {
    cancelBooking(booking.id);
  }
};

const cancelBooking = (id) => {
  if(confirm("Notify client of cancellation?")) {
    dayTimeline.value = dayTimeline.value.map(s => s.booking?.id === id ? { ...s, booking: null } : s);
  }
};

const getCardClass = (booking) => {
  if (booking.isBlocked) return 'border-red-400 bg-red-50/20';
  if (booking.status === 'rescheduling') return 'border-orange-400 bg-orange-50/30';
  return 'border-[var(--color-primary)]';
};

const navigateDate = (days) => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + days);
  selectedDate.value = newDate;
};

const setToday = () => selectedDate.value = new Date();

const openReschedule = (booking) => activeReschedule.value = booking;

const processReschedule = () => {
  activeReschedule.value = null;
  alert("Slot updated and client notified via WhatsApp.");
};
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>