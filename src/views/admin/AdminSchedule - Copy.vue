<template>
  <div class="min-h-screen bg-[#F8F8F7] pt-24 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold italic">Practitioner Portal</span>
          <h1 class="font-serif text-4xl text-[var(--color-primary)] mt-2">Clinical Schedule</h1>
        </div>
        
        <div class="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          <button v-for="view in ['Day', 'Week', 'Month']" :key="view"
                  @click="currentView = view"
                  class="px-6 py-2 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all"
                  :class="currentView === view ? 'bg-[var(--color-primary)] text-white' : 'text-gray-400 hover:text-[var(--color-primary)]'">
            {{ view }}
          </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">
        
        <main class="lg:col-span-8 space-y-4">
          <div v-for="slot in dayTimeline" :key="slot.time" 
               class="group relative flex gap-6">
            
            <div class="w-16 pt-2 text-right">
              <span class="text-[10px] font-bold text-gray-400 tracking-tighter">{{ slot.time }}</span>
            </div>

            <div class="flex-1 pb-6">
              <div v-if="slot.booking" 
                   class="bg-white border-l-4 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md"
                   :class="slot.booking.status === 'rescheduling' ? 'border-orange-400 bg-orange-50/30' : 'border-[var(--color-primary)]'">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-3 mb-1">
                      <span class="text-[9px] uppercase font-bold tracking-widest text-[var(--color-secondary)]">{{ slot.booking.service }}</span>
                      <span v-if="slot.booking.isOnline" class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[8px] font-bold uppercase">Online</span>
                    </div>
                    <h3 class="font-serif text-lg text-[var(--color-primary)]">{{ slot.booking.clientName }}</h3>
                    <p class="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <i class="fab fa-whatsapp text-green-500"></i> {{ slot.booking.phone }}
                    </p>
                  </div>

                  <div class="flex gap-2">
                    <button @click="openReschedule(slot.booking)" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-[var(--color-primary)] hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                      <i class="fas fa-calendar-alt text-xs"></i>
                    </button>
                    <button @click="cancelBooking(slot.booking.id)" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div v-else-if="!isPast(slot.time)" 
                   class="h-20 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center group-hover:border-gray-200 transition-all">
                <button class="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-300 group-hover:text-[var(--color-primary)]">
                  + Block Manually
                </button>
              </div>

              <div v-else class="h-12 flex items-center px-6 opacity-40 italic text-xs text-gray-400">
                Time Period Concluded
              </div>
            </div>
          </div>
        </main>

        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-[var(--color-primary)] rounded-[32px] p-8 text-white">
            <h3 class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-6">Day Summary</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-white/5 rounded-2xl">
                <p class="text-2xl font-serif">08</p>
                <p class="text-[9px] uppercase opacity-50 font-bold">Total Hours</p>
              </div>
              <div class="p-4 bg-white/5 rounded-2xl">
                <p class="text-2xl font-serif">05</p>
                <p class="text-[9px] uppercase opacity-50 font-bold">Sessions</p>
              </div>
            </div>
          </div>

          <div class="p-8 bg-white rounded-[32px] border border-gray-100">
            <h4 class="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Urgent Action</h4>
            <button class="w-full py-4 rounded-2xl border border-red-100 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-all">
              Block Entire Day
            </button>
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
              <label class="text-[10px] uppercase font-bold text-gray-400 block mb-2">New Future Date</label>
              <input type="date" :min="minDate" class="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 ring-[var(--color-secondary)]">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <button @click="activeReschedule = null" class="py-4 rounded-full text-xs font-bold uppercase text-gray-400 tracking-widest">Cancel</button>
              <button @click="processReschedule" class="py-4 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-widest">Confirm Move</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentView = ref('Day');
const activeReschedule = ref(null);

// Block selection of past dates in the reschedule modal
const minDate = new Date().toISOString().split('T')[0];

const dayTimeline = [
  { time: '08:00', booking: { id: 1, clientName: 'Ndapewa S.', service: 'Individual', phone: '+264 81 234 5678', isOnline: true } },
  { time: '09:00', booking: null },
  { time: '10:00', booking: { id: 2, clientName: 'Corporate: MTC Team', service: 'Wellness Event', phone: '+264 81 999 0000', isOnline: false } },
  { time: '11:00', booking: null },
  { time: '14:00', booking: null },
  { time: '15:00', booking: null },
];

// Logic: Check if slot time is in the past to prevent back-booking
const isPast = (timeStr) => {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':');
  const slotTime = new Date();
  slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return slotTime < now;
};

const openReschedule = (booking) => {
  activeReschedule.value = booking;
};

const cancelBooking = (id) => {
  if(confirm("Are you sure? This will notify the client via Email & WhatsApp.")) {
    // API Call: delete/update status to 'cancelled'
    console.log("Cancelled:", id);
  }
};

const processReschedule = () => {
  // Logic: Verify new slot is free -> Update Firestore -> Notify Client
  activeReschedule.value = null;
  alert("Client has been notified of the schedule change.");
};
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>