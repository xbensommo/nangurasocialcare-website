<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'; // Added computed
import { useRoute } from 'vue-router';
import { useAppStore } from '@/stores/appStore'

const route = useRoute();
const store = useAppStore(); // Initialize your store

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

// Base links that are always visible
const baseLinks = [
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services/' },
  { name: 'Pricing', href: '/fees' }
];

const navLinks = computed(() => {
  const links = [...baseLinks];
  
  if (!store.currentUser) {
    links.push({ name: 'Sign Up', href: '/a/register' });
  } else {
    links.push({ name: 'Profile', href: '/my' });
  }
  
  return links;
});

const isActiveLink = (href) => {
  if (href === '') return false;
  return route.path === href;
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>

<template>
  <header 
    class="fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :class="[isScrolled ? 'py-4' : 'py-6']"
  >
    <div 
      class="container mx-auto px-6"
    >
      <nav 
        class="flex items-center justify-between rounded-full px-6 py-3 transition-all duration-500 border border-transparent"
        :class="[isScrolled ? 'bg-white/70 backdrop-blur-xl border-white/40 shadow-sm' : 'bg-transparent']"
      >
       <!--  <router-link to="/" class="group relative z-50 flex items-center gap-2">
          <div class="w-18 h-auto flex items-center justify-center relative overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-500">
            <img src="@/assets/transparent.png" alt="N S C Logo" class="w-full h-auto" />
          </div>
        </router-link> -->

        <router-link to="/" class="flex items-center space-x-4 group">
            <div class="w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <img 
              src="@/assets/transparent.png" 
              alt="Nangura Logo" 
              class="w-full h-full object-contain"
              />
            </div>

            <div class="flex flex-col">
              <span class="font-serif text-lg font-bold tracking-tighter leading-none italic uppercase">
                NANGURA
              </span>
              <span class="text-[8px] uppercase tracking-[0.4em] text-gray-400 font-bold">
                Social Care
              </span>
            </div>
          </router-link>


        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <router-link 
            v-for="link in navLinks" 
            :key="link.name" 
            :to="link.href"
            class="relative text-sm font-medium transition-colors group"
            :class="[
              isActiveLink(link.href) 
                ? 'text-[var(--color-primary)]' 
                : 'text-gray-600 hover:text-[var(--color-primary)]'
            ]"
          >
            {{ link.name }}
            <span 
              class="absolute -bottom-1 left-0 h-[2px] bg-[var(--color-secondary)] transition-all duration-300"
              :class="isActiveLink(link.href) ? 'w-full' : 'w-0 group-hover:w-full'"
            ></span>
          </router-link>
        </div>

        <div class="flex items-center gap-4">
          <router-link to="/booking" class="hidden md:flex btn-primary text-sm px-6 py-2.5 shadow-lg shadow-[var(--color-primary)]/20">
            Book Session
          </router-link>

          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 group"
          >
            <span class="w-6 h-0.5 bg-gray-800 transition-all duration-300" :class="{'rotate-45 translate-y-2': isMobileMenuOpen}"></span>
            <span class="w-6 h-0.5 bg-gray-800 transition-all duration-300" :class="{'opacity-0': isMobileMenuOpen}"></span>
            <span class="w-6 h-0.5 bg-gray-800 transition-all duration-300" :class="{'-rotate-45 -translate-y-2': isMobileMenuOpen}"></span>
          </button>
        </div>
      </nav>
    </div>

    <!-- Mobile Navigation -->
    <transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="fixed inset-0 bg-[#FAFAF9]/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center space-y-8"
      >
        <router-link 
          v-for="link in navLinks" 
          :key="link.name"
          :to="link.href"
          @click="isMobileMenuOpen = false"
          class="font-serif text-4xl transition-all"
          :class="[
            isActiveLink(link.href) 
              ? 'text-[var(--color-secondary)] scale-105' 
              : 'text-[var(--color-primary)] hover:text-[var(--color-secondary)] hover:scale-105'
          ]"
        >
          {{ link.name }}
        </router-link>
        <router-link to="/booking" class="btn-primary mt-8 text-xl px-10 py-4">Book Now</router-link>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>