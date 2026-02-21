<template>
  <div class="min-h-screen bg-[#FAFAF9] font-sans text-[var(--color-primary)] selection:bg-[var(--color-accent)] selection:text-[var(--color-primary)]">
    
    <div class="fixed inset-0 pointer-events-none opacity-[0.02] z-0" 
         style="background-image: radial-gradient(var(--color-primary) 0.5px, transparent 0.5px); background-size: 30px 30px;">
    </div>

    <nav class="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <router-link to="/my" class="flex items-center gap-3 group">
          <img src="@/assets/logo.png" alt="Nangura" class="h-10 w-auto object-contain" />
        </router-link>

        <div class="hidden md:flex items-center gap-8">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path"
            class="text-[10px] uppercase tracking-[0.2em] font-bold transition-all relative group"
            :class="route.path.startsWith(item.path) ? 'text-[var(--color-secondary)]' : 'text-gray-400 hover:text-[var(--color-primary)]'">
            {{ item.label }}
            <span class="absolute -bottom-1 left-0 h-[2px] bg-[var(--color-secondary)] transition-all"
                  :class="route.path.startsWith(item.path) ? 'w-full' : 'w-0 group-hover:w-full'"></span>
          </router-link>
        </div>

        <div class="flex items-center gap-4">
          
          <button class="relative p-2.5 text-gray-400 hover:text-[var(--color-primary)] transition-colors bg-gray-50 rounded-full">
            <i class="fas fa-bell text-xs"></i>
            <span v-if="hasNotifications" class="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--color-secondary)] rounded-full ring-2 ring-white"></span>
          </button>

          <div class="relative group">
            <button class="flex items-center gap-3 p-1.5 pl-4 rounded-full border border-gray-100 hover:border-gray-200 transition-all bg-white">
              <div class="text-right hidden sm:block">
                <p class="text-[10px] font-bold uppercase tracking-tight text-[var(--color-primary)]">{{ store.currentUser?.fullName }}</p>
                <p class="text-[8px] font-medium text-green-600 uppercase">CLIENT</p>
              </div>
              <div class="w-9 h-9 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-[11px] font-serif italic shadow-inner">
                {{ userInitials }}
              </div>
              <i class="fas fa-chevron-down text-[8px] mr-2 text-gray-300 group-hover:text-[var(--color-primary)] transition-colors"></i>
            </button>

            <div class="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-gray-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[110] p-2">
              <router-link to="/my/profile" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#FAFAF9] text-gray-600 hover:text-[var(--color-primary)] transition-all">
                <i class="fas fa-user-circle opacity-50"></i>
                <span class="text-sm font-medium">My Profile</span>
              </router-link>
              <router-link to="/my/data" class="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#FAFAF9] text-gray-600 hover:text-[var(--color-primary)] transition-all">
                <i class="fas fa-shield-alt opacity-50"></i>
                <span class="text-sm font-medium">Privacy & Data</span>
              </router-link>
              <div class="h-px bg-gray-50 my-1"></div>
              <router-link to="/logout" class="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-500 transition-all text-left">
                <i class="fas fa-right-from-bracket opacity-50"></i>
                <span class="text-sm font-bold">Sign Out</span>
              </router-link>
            </div>
          </div>

          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden w-10 h-10 flex items-center justify-center text-[var(--color-primary)] bg-gray-100 rounded-full">
            <i :class="mobileMenuOpen ? 'fas fa-times' : 'fas fa-bars-staggered'" class="text-sm"></i>
          </button>
        </div>
      </div>

      <transition 
        enter-active-class="transition duration-300 ease-out" 
        enter-from-class="opacity-0 -translate-y-4" 
        enter-to-class="opacity-100 translate-y-0" 
        leave-active-class="transition duration-200 ease-in" 
        leave-from-class="opacity-100 translate-y-0" 
        leave-to-class="opacity-0 -translate-y-4">
        <div v-if="mobileMenuOpen" class="md:hidden bg-white border-b border-gray-100 px-6 py-10 space-y-6 shadow-xl">
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" @click="mobileMenuOpen = false"
            class="block text-3xl font-serif italic text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors">
            {{ item.label }}
          </router-link>
          
          <div class="pt-8 border-t border-gray-50">
             <router-link to="logout" class="flex items-center gap-3 text-red-500 font-bold uppercase tracking-widest text-xs">
              <i class="fas fa-right-from-bracket"></i> Sign Out
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <main class="relative z-10 pt-28 pb-32">
      <div class="max-w-7xl mx-auto px-6">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <div class="fixed bottom-0 w-full bg-white border-t border-gray-100 py-3 z-[90]">
      <div class="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">Secure Client Portal Active</span>
        </div>
        <p class="text-[9px] text-gray-300 uppercase tracking-widest">Confidentiality is our priority</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore'
const route = useRoute();
const router = useRouter();

// Mock store - Replace with your real appStore
const store = useAppStore();

const mobileMenuOpen = ref(false);
const hasNotifications = ref(true);

const userInitials = 'N'//computed(() => store.currentUser?.fullName.charAt(0) || 'N');


const navItems = [
  { label: 'Home', path: '/my/' },
  { label: 'Book Session', path: '/my/booking' },
  /*{ label: 'My Sessions', path: '/my/history' },
  { label: 'Resources', path: '/my/resources' },*/
];
</script>

<style scoped>
/* Refined Page Transitions */
.page-enter-active, .page-leave-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.page-enter-from { opacity: 0; transform: translateY(15px); }
.page-leave-to { opacity: 0; transform: translateY(-15px); }

.font-serif { font-family: 'Playfair Display', serif; }
</style>