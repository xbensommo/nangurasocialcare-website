<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import AOS from 'aos';

const store = useAppStore();
const route = useRoute();
const router = useRouter();

const isSidebarOpen = ref(true);
const isMobileMenuOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Navigation Schema (Desktop & Mobile)
const navigation = computed(() => [
  { group: 'Core', links: [
    { name: 'Dashboard', href: '/pra', icon: 'fas fa-chart-line' },
    { name: 'Clients', href: '/pra/users', icon: 'fas fa-users' },
  ]},
  { group: 'Modules', links: [
    /*{ name: 'Bookings', href: '/pra/bookings', icon: 'fas fa-calendar-check' },*/
    { name: 'Sessions', href: '/pra/manage/session', icon: 'fas fa-video' },
    /*{ name: 'Notes', href: '/pra/notes', icon: 'fas fa-sticky-note' },*/
    /*{ name: 'Activity Logs', href: '/pra/activitylogs', icon: 'fas fa-list-alt' },*/
    /*{ name: 'Slots', href: '/pra/slots', icon: 'fas fa-clock' },*/
    { name: 'Notifications', href: '/pra/notifications', icon: 'fas fa-bell' },
  ]},
  { group: 'System', links: [
    /*{ name: 'Settings', href: '/pra/settings', icon: 'fas fa-cogs' },*/
    { name: 'Log Out', href: '/logout', icon: 'fas fa-sign-out-alt' },
  ]}
]);

onMounted(() => {
  AOS.init({ duration: 600, once: true });
});

const handleLogout = () => router.push('/logout');
</script>

<template>
  <div class="min-h-screen bg-[var(--color-background)] font-[var(--fontfamily-sans)] text-[var(--color-text)] flex overflow-hidden">
    
    <!-- Desktop Sidebar -->
    <aside :class="isSidebarOpen ? 'w-72' : 'w-20'"
           class="hidden lg:flex h-screen bg-[var(--color-secondary)] backdrop-blur-2xl border-r border-white/5 sticky top-0 z-50 transition-all duration-500 flex-col">
      <div class="p-8 flex items-center gap-4 h-24">
        <div class="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(28,114,171,0.4)]">
          <i class="fas fa-user-shield text-white"></i>
        </div>
        <span v-if="isSidebarOpen" class="font-space font-bold text-xl tracking-tighter text-white">
          Admin Panel<span class="text-[var(--color-primary)]">.</span>
        </span>
      </div>

      <nav class="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        <div v-for="group in navigation" :key="group.group">
          <p v-if="isSidebarOpen" class="px-4 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.3em] mb-4">
            {{ group.group }}
          </p>
          <div class="space-y-1">
            <!-- <router-link v-for="link in group.links" :key="link.name" :to="link.href" 
                         class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative border border-transparent"
                         :class="route.path.startsWith(link.href) ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-white/5' : 'hover:bg-white/5 text-[var(--color-neutral)]'">
              <i :class="[link.icon, 'text-lg w-6']"></i>
              <span v-if="isSidebarOpen" class="font-medium text-sm tracking-wide">{{ link.name }}</span>
            </router-link> -->
            <router-link v-for="link in group.links" :key="link.name" :to="link.href" 
            class="flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative border border-transparent"
            :class="{
              'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-white/5': route.path === link.href,
              'hover:bg-white/5 text-[var(--color-neutral)]': route.path !== link.href
            }">
            <i :class="[link.icon, 'text-lg w-6']"></i>
            <span v-if="isSidebarOpen" class="font-medium text-sm tracking-wide">{{ link.name }}</span>
          </router-link>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Mobile Drawer -->
    <transition name="drawer">
      <div v-if="isMobileMenuOpen" class="lg:hidden fixed inset-0 z-[100] flex">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="closeMobileMenu"></div>
        <div class="relative w-80 h-full bg-[#0B0C14] border-r border-white/10 p-6 flex flex-col shadow-2xl">
          <div class="flex justify-between items-center mb-10">
            <span class="font-space font-bold text-xl text-white">Admin Panel<span class="text-[var(--color-primary)]">.</span></span>
            <button @click="closeMobileMenu" class="text-white/50"><i class="fas fa-times text-xl"></i></button>
          </div>
          <nav class="flex-1 overflow-y-auto space-y-6">
            <div v-for="group in navigation" :key="group.group">
              <p class="text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-widest mb-3 px-2">{{ group.group }}</p>
              <div class="space-y-1">
               <router-link v-for="link in group.links" :key="link.name" :to="link.href" @click="closeMobileMenu"
  class="flex items-center gap-4 px-4 py-4 rounded-xl transition-all"
  :class="{
    'bg-[var(--color-primary)]/20 text-[var(--color-primary)]': route.path === link.href,
    'text-[var(--color-neutral)] hover:bg-white/5': route.path !== link.href
  }">
  <i :class="link.icon"></i>
  <span class="font-medium">{{ link.name }}</span>
</router-link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
      <header class="h-18 lg:h-20 border-b border-white/5 bg-[#020106]/60 backdrop-blur-xl px-4 lg:px-8 flex items-center justify-between z-40">
        <div class="flex items-center gap-4 lg:gap-6">
          <button @click="isMobileMenuOpen = true" class="lg:hidden w-10 h-10 flex items-center justify-center text-white">
            <i class="fas fa-bars-staggered text-xl"></i>
          </button>

          <button @click="toggleSidebar" class="hidden lg:flex w-10 h-10 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-[var(--color-neutral)] hover:text-white transition-all">
            <i class="fas" :class="isSidebarOpen ? 'fa-indent' : 'fa-outdent'"></i>
          </button>

          <div class="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-3">
            <span class="text-[10px] lg:text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Admin</span>
            <span class="hidden lg:block text-white/20">/</span>
            <h2 class="text-xs lg:text-sm font-bold text-white tracking-tight">{{ route.name }}</h2>
          </div>
        </div>

        <div class="flex items-center gap-2 lg:gap-4">
          <div class="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
             <div class="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_green]"></div>
             <span class="text-[10px] font-bold uppercase tracking-tighter text-[var(--color-neutral)]">Node-01</span>
          </div>
          
          <div class="h-10 w-10 lg:w-auto lg:px-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
             <i class="fas fa-bell text-[var(--color-neutral)] text-sm"></i>
             <span class="hidden lg:inline text-[10px] font-bold text-white uppercase tracking-widest">Alerts</span>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-0">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-enter-from { opacity: 0; }
.drawer-enter-from .relative { transform: translateX(-100%); }
.drawer-leave-to .relative { transform: translateX(-100%); }

.page-fade-enter-active, .page-fade-leave-active { transition: all 0.2s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; transform: translateY(10px); }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>