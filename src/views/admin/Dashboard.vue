<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';

const store = useAppStore();

// --- Reactive Data ---
const sessions = ref([]);
const clients = ref([]);
const notifications = ref([]);
const activityLogs = ref([]);
const notes = ref([]);

const totalSessions = ref(0);
const totalClients = ref(0);
const totalNotifications = ref(0);
const totalNotes = ref(0);

// Pagination states
const sessionPage = ref(1);
const clientPage = ref(1);
const sessionLoading = ref(false);
const clientLoading = ref(false);

// --- Fetch initial dashboard data ---
const loadDashboard = async () => {
  totalSessions.value = await store.sessionsActions.getAggregatedCount();
  totalClients.value = await store.usersActions.getAggregatedCount();
  totalNotifications.value = await store.notificationsActions.getAggregatedCount({ read: false });
  totalNotes.value = await store.notesActions.getAggregatedCount();

  // Fetch first page of items
  await store.sessionsActions.fetchInitialPage();
  sessions.value = store.sessions.items;

  await store.usersActions.fetchInitialPage({ role: 'user'});
  clients.value = store.users.items;

  await store.notificationsActions.fetchInitialPage();
  notifications.value = store.notifications.items;

  await store.notesActions.fetchInitialPage();
  activityLogs.value = store.users.items;

  await store.notesActions.fetchInitialPage();
  notes.value = store.notes.items;
};

onMounted(() => {
  loadDashboard();
});

// --- Pagination Methods ---
const loadMoreSessions = async () => {
  if (sessionLoading.value) return;
  sessionLoading.value = true;
  await store.sessionsActions.fetchNextPage();
  sessions.value = [...store.sessions.items];
  sessionPage.value++;
  sessionLoading.value = false;
};

const loadMoreClients = async () => {
  if (clientLoading.value) return;
  clientLoading.value = true;
  await store.usersActions.fetchNextPage({
    role: 'user'
  });
  clients.value = [...store.users.items];
  clientPage.value++;
  clientLoading.value = false;
};
</script>

<template>
  <div class="p-4 lg:p-8 space-y-6">

    <!-- Dashboard Top Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-[var(--color-neutral)] rounded-xl p-4 flex items-center gap-3 shadow-lg">
        <i class="fas fa-video text-[var(--color-primary)] text-2xl"></i>
        <div>
          <p class="text-sm text-[var(--color-primary)]">Sessions</p>
          <h3 class="text-xl font-bold text-gray-800">{{ totalSessions.count }}</h3>
        </div>
      </div>

      <div class="bg-[var(--color-neutral)] rounded-xl p-4 flex items-center gap-3 shadow-lg">
        <i class="fas fa-users text-[var(--color-primary)] text-2xl"></i>
        <div>
          <p class="text-sm text-[var(--color-primary)]">Clients</p>
          <h3 class="text-xl font-bold text-gray-800">{{ totalClients.count }}</h3>
        </div>
      </div>

      <div class="bg-[var(--color-neutral)] rounded-xl p-4 flex items-center gap-3 shadow-lg">
        <i class="fas fa-bell text-[var(--color-primary)] text-2xl"></i>
        <div>
          <p class="text-sm text-[var(--color-primary)]">Notifications</p>
          <h3 class="text-xl font-bold text-gray-800">{{ totalNotifications.count }}</h3>
        </div>
      </div>

      <!-- <div class="bg-[var(--color-neutral)] rounded-xl p-4 flex items-center gap-3 shadow-lg">
        <i class="fas fa-sticky-note text-[var(--color-primary)] text-2xl"></i>
        <div>
          <p class="text-sm text-[var(--color-primary)]">Notes</p>
          <h3 class="text-xl font-bold text-white">{{ totalNotes.count }}</h3>
        </div>
      </div> -->
    </div>

    <!-- Recent Sessions Table -->
    <div class="bg-[var(--color-neutral)] rounded-xl p-4 shadow-lg">
      <h2 class="text-gray-800 font-bold text-lg mb-4">Recent Sessions</h2>
      <table class="w-full text-left table-auto">
        <thead>
          <tr class="text-[var(--color-primary)] text-sm uppercase">
            <th class="p-2">Client</th>
            <th class="p-2">Date</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions" :key="session.id" class="border-b border-white/10 hover:bg-white/5">
            <td class="p-2">{{ session.fullName}}</td>
            <td class="p-2">{{ session.startDate ? new Date(session.date).toLocaleString() : '-' }}</td>
            <td class="p-2 capitalize">{{ session.status }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-2">
        <button @click="loadMoreSessions"
                class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-primary)]/80"
                :disabled="sessionLoading">
          {{ sessionLoading ? 'Loading...' : 'Load More Sessions' }}
        </button>
      </div>
    </div>

    <!-- Recent Clients Table -->
    <div class="bg-[var(--color-secondary)] rounded-xl p-4 shadow-lg">
      <h2 class="text-white font-bold text-lg mb-4">Recent Clients</h2>
      <table class="w-full text-left table-auto">
        <thead>
          <tr class="text-[var(--color-neutral)] text-sm uppercase">
            <th class="p-2">Name</th>
            <th class="p-2">Email</th>
            <th class="p-2">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id" class="border-b border-white/10 hover:bg-white/5">
            <td class="p-2">{{ client.fullName }}</td>
            <td class="p-2">{{ client.email }}</td>
            <td class="p-2">{{ client.createdAt ? new Date(client.createdAt).toLocaleString() : '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center mt-2">
        <button @click="loadMoreClients"
                class="bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl hover:bg-[var(--color-primary)]/80"
                :disabled="clientLoading">
          {{ clientLoading ? 'Loading...' : 'Load More Clients' }}
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <div class="bg-[var(--color-secondary)] rounded-xl p-4 shadow-lg">
      <h2 class="text-white font-bold text-lg mb-4">Notifications</h2>
      <ul class="space-y-2">
        <li v-for="note in notifications" :key="note.id"
            class="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg">
          <span>{{ note.message }}</span>
          <span class="text-[var(--color-neutral)] text-xs">{{ note.date ? new Date(note.date).toLocaleString() : '-' }}</span>
        </li>
      </ul>
    </div>

    <!-- Activity Logs -->
    <!-- <div class="bg-[var(--color-secondary)] rounded-xl p-4 shadow-lg">
      <h2 class="text-white font-bold text-lg mb-4">Activity Logs</h2>
      <ul class="space-y-2">
        <li v-for="log in activityLogs" :key="log.id"
            class="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg">
          <span>{{ log.action }}</span>
          <span class="text-[var(--color-neutral)] text-xs">{{ log.timestamp ? new Date(log.timestamp).toLocaleString() : '-' }}</span>
        </li>
      </ul>
    </div> -->

  </div>
</template>

<style scoped>
table th, table td { padding: 0.5rem; }
tr:hover { background-color: rgba(255, 255, 255, 0.05); }
</style>