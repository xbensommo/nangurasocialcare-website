<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-4 pb-20 px-4 md:px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- LEFT SIDEBAR -->
      <aside class="lg:col-span-3 space-y-6 hidden lg:block">
        <div class="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div class="flex flex-col items-center text-center mb-8">
            <div class="w-20 h-20 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-2xl font-serif italic mb-4 shadow-inner">
              {{ initials }}
            </div>

            <h3 class="font-serif text-xl text-[var(--color-primary)]">
              {{ store.currentUser?.fullName }}
            </h3>

            <p class="text-[10px] text-[var(--color-secondary)] font-bold uppercase tracking-[0.2em] mt-1">
              {{ store.currentUser?.isDeleted ? 'Account Closed' : 'Active Client' }}
            </p>
          </div>

          <div class="space-y-4 pt-6 border-t border-gray-50">
            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-gray-400">Completed Sessions</span>
              <span class="text-[var(--color-primary)]">
                {{ store.sessions.aggregatedCount ?? 0 }}
              </span>
            </div>

            <div class="flex justify-between text-[10px] font-bold uppercase tracking-widest">
              <span class="text-gray-400">Next Session</span>
              <span class="text-[var(--color-secondary)]">
                {{ nextSessionText }}
              </span>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm space-y-4">
          <h4 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">
            Account Actions
          </h4>

          <button @click="editProfile"
                  class="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary)]/80 transition-all">
            Edit Profile
          </button>

          <button @click="changePassword"
                  class="w-full py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-primary)]/5 transition-all">
            Change Password
          </button>

          <button @click="closeAccount"
                  class="w-full py-3 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all">
            Close Account
          </button>
        </div>
      </aside>

      <!-- CENTER -->
      <main class="lg:col-span-6 space-y-8">

        <!-- Mindful Quote -->
        <div class="bg-white rounded-[32px] border border-gray-100 p-6">
          <p class="text-sm italic text-gray-600">
            “Healing is not linear. Be patient with your progress.”
          </p>
        </div>

        <!-- NEXT SESSION CARD -->
        <div v-if="nextSession"
             class="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">

          <p class="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-2">
            Your Next Session
          </p>

          <h3 class="text-2xl font-serif text-[var(--color-primary)] italic mb-2">
            {{ nextSession.serviceTitle }}
          </h3>

          <p class="text-sm text-gray-500 mb-6">
            {{ nextSession.startDate }} • {{ nextSession.startTime }}
          </p>

          <button
            class="px-8 py-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all">
            View Session
          </button>
        </div>

        <!-- NO UPCOMING -->
        <div v-else
             class="bg-white rounded-[40px] border border-gray-100 p-8 text-center">

          <p class="text-gray-500 mb-6">
            You have no upcoming sessions.
          </p>

          <router-link to="/my/book-next-session"
            class="px-8 py-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg hover:-translate-y-1 transition-all">
            Book a Session
          </router-link>
        </div>

        <!-- Security & Settings -->
        <div class="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm space-y-4">
          <h4 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-2">
            Security & Preferences
          </h4>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-600">Two-Factor Authentication</span>
            <input type="checkbox" v-model="security.twoFA" class="toggle toggle-primary" />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-gray-600">Email Notifications</span>
            <input type="checkbox" v-model="security.emailNotifications" class="toggle toggle-primary" />
          </div>
        </div>

      </main>

      <!-- RIGHT SIDEBAR -->
      <aside class="lg:col-span-3 space-y-8">

        <div class="bg-[var(--color-primary)] rounded-[32px] p-8 text-white">
          <h3 class="text-[9px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-8">
            Recent Sessions
          </h3>

          <div v-if="recentCompleted.length" class="space-y-6">
            <div v-for="session in recentCompleted"
                 :key="session.id"
                 class="relative pl-6 border-l border-white/10">

              <div class="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
              <p class="text-[8px] uppercase tracking-widest text-white/40 font-bold mb-1">
                {{ session.startDate }} • {{ session.startTime }}
              </p>

              <p class="text-sm font-serif italic mb-2">
                {{ session.serviceTitle }}
              </p>

              <p class="text-[10px] text-white/60">
                Session Completed
              </p>
            </div>
          </div>

          <div v-else class="text-white/60 text-sm">
            No completed sessions yet.
          </div>
        </div>

      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/appStore'

const store = useAppStore()

const completedSessions = ref([])
const confirmedSessions = ref([])

const security = ref({
  twoFA: false,
  emailNotifications: true
})

const initials = computed(() => {
  const name = store.currentUser?.fullName || ''
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
})

onMounted(async () => {
  const clientId = store.currentUser?.uid
  if (!clientId) return

  await store.sessionsActions.fetchByFilters({ status: 'completed', clientId })
  completedSessions.value = [...store.sessions.items]

  await store.sessionsActions.getAggregatedCount({ status: 'completed', clientId })

  await store.sessionsActions.fetchByFilters({ status: 'confirmed', clientId })
  confirmedSessions.value = [...store.sessions.items]
})

const nextSession = computed(() => {
  const now = new Date()
  const future = confirmedSessions.value
    .filter(s => new Date(`${s.startDate}T${s.startTime}`) > now)
    .sort((a,b) => new Date(`${a.startDate}T${a.startTime}`) - new Date(`${b.startDate}T${b.startTime}`))
  return future[0] || null
})

const nextSessionText = computed(() =>
  nextSession.value
    ? `${nextSession.value.startDate} • ${nextSession.value.startTime}`
    : 'No Upcoming'
)

const recentCompleted = computed(() =>
  [...completedSessions.value].sort((a,b) => new Date(`${b.startDate}T${b.startTime}`) - new Date(`${a.startDate}T${a.startTime}`)).slice(0,3)
)

// ACTIONS
const editProfile = () => {
  // Redirect to edit page or open modal
  console.log('Edit profile clicked')
}

const changePassword = () => {
  // Redirect to change password page or modal
  console.log('Change password clicked')
}

const closeAccount = async () => {
  if (!confirm('Are you sure you want to close your account? This action cannot be undone.')) return
  await store.currentUserActions.closeAccount(store.currentUser?.uid)
  alert('Your account has been closed.')
}
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
</style>