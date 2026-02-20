<template>
  <div v-if="content" :key="route.params.slug" class="min-h-screen bg-[#FAFAF9]">
    
    <div class="fixed top-24 left-0 w-full z-20 px-6 pointer-events-none">
      <div class="container mx-auto max-w-7xl">
        <router-link to="/services" class="pointer-events-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors bg-black/10 backdrop-blur-md py-2 px-4 rounded-full">
          <i class="fas fa-chevron-left"></i> Back to Services
        </router-link>
      </div>
    </div>

    <header class="relative pt-48 pb-24 px-6 overflow-hidden rounded-b-[60px] bg-[var(--color-primary)]">
      <div class="absolute inset-0 z-0">
        <img :src="content.image" class="w-full h-full object-cover opacity-30 grayscale contrast-125" alt="Background">
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-transparent to-transparent"></div>
      </div>
      
      <div class="container mx-auto max-w-4xl relative z-10 text-center reveal-header">
        <span class="inline-block py-1 px-4 rounded-full border border-white/20 text-[10px] tracking-[0.3em] uppercase text-white/80 mb-6">Service Overview</span>
        <h1 class="font-serif text-5xl md:text-8xl text-white mb-8">{{ content.title }}</h1>
        <p class="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed italic">
          "{{ content.intro }}"
        </p>
      </div>
    </header>

    <div class="container mx-auto max-w-6xl px-6 py-24">
      <div class="grid lg:grid-cols-12 gap-16">
        
        <div class="lg:col-span-7 space-y-20">
          
          <div class="reveal-content">
            <h2 class="font-serif text-4xl text-[var(--color-primary)] mb-10 flex items-center gap-4">
              Areas of Support
              <div class="h-px flex-1 bg-gray-200"></div>
            </h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="item in content.supportAreas" :key="item" 
                   class="p-6 rounded-[32px] bg-white border border-gray-100 flex items-center gap-4 hover:border-[var(--color-accent)] transition-all group">
                <div class="w-2 h-2 rounded-full bg-[var(--color-accent)] group-hover:scale-150 transition-transform"></div>
                <span class="text-gray-700 text-sm font-medium">{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="reveal-content relative p-12 rounded-[50px] overflow-hidden bg-white border border-gray-100 shadow-sm">
            <div class="absolute top-0 left-0 w-2 h-full bg-[var(--color-secondary)]"></div>
            <h2 class="font-serif text-3xl text-[var(--color-primary)] mb-6">What to Expect</h2>
            <p class="text-xl text-gray-500 font-light leading-relaxed italic mb-10">
              {{ content.expectations }}
            </p>
            <div class="flex items-center gap-4 py-6 border-t border-gray-50">
              <div class="w-12 h-12 rounded-full bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div>
                <p class="text-xs uppercase tracking-[0.2em] font-bold text-[var(--color-primary)]">Confidentiality</p>
                <p class="text-sm text-gray-400">Professional ethics and privacy standards are strictly upheld.</p>
              </div>
            </div>
          </div>

        </div>

        <div class="lg:col-span-5 relative">
          <div class="sticky top-32 space-y-6 reveal-content">
            <div class="bg-[var(--color-primary)] text-white p-10 rounded-[50px] shadow-2xl relative overflow-hidden">
              <div class="relative z-10">
                <h3 class="font-serif text-3xl mb-4">Ready to begin?</h3>
                <p class="text-white/70 text-sm mb-10 leading-relaxed">Book a consultation today. Sessions are available online nationwide or in-person at our Tsumeb practice.</p>
                <button @click="goToBookSessionPage" class="w-full py-5 bg-[var(--color-accent)] text-[var(--color-primary)] rounded-full font-bold flex items-center justify-center group hover:bg-white transition-all">
                  Book a Session 
                  <i class="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
                </button>
              </div>
              <i class="fas fa-spa absolute -right-8 -bottom-8 text-white/5 text-[200px] rotate-12"></i>
            </div>
            
            <router-link to="/fees" class="p-8 border border-gray-200 rounded-[40px] flex items-center justify-between group bg-white/50 hover:bg-white transition-all">
              <div class="flex items-center gap-4">
                <i class="fas fa-receipt text-gray-300 group-hover:text-[var(--color-secondary)] transition-colors"></i>
                <span class="text-gray-600 font-medium">Transparency in Fees</span>
              </div>
              <i class="fas fa-chevron-right text-xs text-gray-300"></i>
            </router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
  
  <div v-else class="h-screen flex flex-col items-center justify-center bg-[#FAFAF9]">
    <h2 class="font-serif text-3xl text-[var(--color-primary)] mb-6">Service not found.</h2>
    <router-link to="/services" class="btn-primary">Return to Services</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';
import { servicesData } from './servicesData.js';
import { gsap } from 'gsap';

const route = useRoute(); const router = useRouter();
const content = computed(() => servicesData[route.params.slug]);

// SEO Management
useHead({
  title: computed(() => content.value ? `${content.value.title} | Nangura Social Care` : 'Service | Nangura Social Care'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => content.value ? content.value.intro : 'Professional psychological services in Namibia.')
    }
  ]
});

const animate = () => {
  gsap.from(".reveal-header", { y: 60, opacity: 0, duration: 1.2, ease: "power4.out" });
  gsap.from(".reveal-content", { y: 40, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.3 });
};

const goToBookSessionPage = () => {
  router.push('/booking')
  //router.push({ name: 'BookingPage', params: { id: sessId } });
}

watch(() => route.params.slug, () => {
  window.scrollTo(0, 0);
  setTimeout(animate, 50);
});

onMounted(animate);
</script>