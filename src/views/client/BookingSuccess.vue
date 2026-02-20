<template>
  <div class="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6">
    <div v-if="loading" class="text-center">
      <i class="fas fa-circle-notch fa-spin text-2xl text-[var(--color-primary)]"></i>
      <p class="mt-4 text-[10px] uppercase font-bold tracking-widest text-gray-400">Retrieving Booking...</p>
    </div>

    <div v-else class="max-w-xl w-full bg-white rounded-[50px] p-12 shadow-2xl shadow-gray-200/50 text-center border border-gray-50 animate-in fade-in zoom-in duration-500">
      
      <div class="w-20 h-20 bg-[var(--color-secondary)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <i class="fas fa-check text-[var(--color-secondary)] text-2xl"></i>
      </div>

      <h2 class="font-serif text-4xl text-[var(--color-primary)] italic mb-4">Space Reserved</h2>
      <p class="text-sm text-gray-500 leading-relaxed mb-10 uppercase tracking-widest font-bold">
        Thank you, {{ session?.fullName }}.<br/>
        Your session is confirmed.
      </p>

      <div class="bg-[#FAFAF9] rounded-[32px] p-8 mb-10 border border-gray-100 relative overflow-hidden">
        
        <div v-if="session?.service?.type === 'online'" class="flex flex-col items-center gap-4">
          <span class="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-full">
            Online Session
          </span>
          
          <div v-if="session?.meetLink" class="w-full">
            <div class="flex items-center justify-center gap-2 mb-2">
              <i class="fas fa-video text-blue-500"></i>
              <span class="font-bold text-gray-700">Google Meet Ready</span>
            </div>
            <code class="block w-full text-[10px] bg-white px-4 py-3 rounded-xl border border-gray-200 text-gray-500 mb-4 select-all">
              {{ session.meetLink }}
            </code>
            <a :href="session.meetLink" target="_blank" class="block w-full py-3 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors">
              Test Link
            </a>
          </div>

          <div v-else class="flex flex-col items-center py-4">
            <i class="fas fa-cog fa-spin text-gray-300 mb-2"></i>
            <p class="text-[10px] text-gray-400 italic">Generating secure encrypted link...</p>
          </div>
        </div>

        <div v-else>
           <span class="text-[9px] font-bold text-[var(--color-secondary)] uppercase tracking-[0.3em] bg-orange-50 px-3 py-1 rounded-full">
            In-Person
          </span>
          <p class="mt-4 text-xs text-gray-500">
            Nangura Social Care Center<br/>
            14 Main Street, Tsumeb
          </p>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200/50 flex justify-between text-[10px] uppercase font-bold text-gray-400">
          <span>{{ formatDate(session?.date) }}</span>
          <span>{{ session?.time }}</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <button @click="router.push('/dashboard')" class="py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-[var(--color-primary)]">
          My Dashboard
        </button>
        <button @click="addToCalendar" class="py-4 bg-[var(--color-primary)] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20 hover:opacity-90">
          Add to Calendar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'vue-sonner';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const loading = ref(true);
const session = ref(null);
let pollInterval = null;

/**
 * 1. Fetch Session Data
 * We use the store to get the document by ID.
 */
const fetchSession = async () => {
  const id = route.query.id;
  if (!id) {
    //router.push('/');
    return;
  }

  try {
    // Assuming your store has a getById method
    // If not, you can use store.sessionsActions.fetch() and find it
    const data = await store.sessionsActions.getById(id);
    session.value = data;
    loading.value = false;

    // 2. If Online & No Link yet, poll for updates
    // (This handles the delay from the backend function)
    if (data.service?.type === 'online' && !data.meetLink) {
      startPolling(id);
    }
  } catch (error) {
    console.error('Error fetching session:', error);
    toast.error("Could not retrieve session details");
  }
};

/**
 * 3. Polling Mechanism (Low Budget Real-time)
 * Instead of setting up complex sockets, we just check every 2 seconds
 * for the backend to finish generating the link.
 */
const startPolling = (id) => {
  if (pollInterval) return;
  
  pollInterval = setInterval(async () => {
    const updatedData = await store.sessionsActions.getById(id);
    if (updatedData.meetLink) {
      session.value = updatedData;
      clearInterval(pollInterval);
      toast.success("Secure link generated!");
    }
  }, 2000); // Check every 2 seconds
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { 
    weekday: 'short', month: 'long', day: 'numeric' 
  });
};

const addToCalendar = () => {
  // Simple .ics generation or Google Calendar URL logic here
  toast.info("Calendar invite downloaded");
};

onMounted(() => {
  fetchSession();
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>