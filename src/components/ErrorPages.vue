<script setup>
import { useRouter } from 'vue-router';
import { useHead } from '@vueuse/head';

const router = useRouter();
const props = defineProps(['code', 'message', 'description']);

useHead({
  title: `${props.code || 'Notice'} | Nangura Social Care`
});

const goBack = () => {
  if (router.options.history.state.back) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6">
    <div class="relative flex items-center justify-center mb-12">
      <h1 class="text-[25vw] font-serif font-bold text-[var(--color-primary)] opacity-[0.03] tracking-tighter leading-none select-none">
        {{ code || '403' }}
      </h1>
      
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-4 block">
          A Moment of Pause
        </span>
        <h2 class="text-4xl md:text-5xl font-serif text-[var(--color-primary)] tracking-tight italic">
          {{ message || 'Path Restricted' }}
        </h2>
      </div>
    </div>
    
    <p class="text-gray-500 text-base max-w-md text-center mb-12 leading-relaxed font-light">
      {{ description || "It seems this area is private or temporarily unavailable. We invite you to return to our main services where support is always available." }}
    </p>

    <div class="flex flex-col sm:flex-row gap-4">
      <button 
        @click="goBack" 
        class="px-10 py-4 rounded-full border border-gray-200 text-gray-500 hover:bg-white hover:shadow-md transition-all flex items-center justify-center group"
      >
        <i class="fas fa-arrow-left mr-3 text-xs group-hover:-translate-x-1 transition-transform"></i> 
        Go Back
      </button>
      
      <button 
        @click="router.push('/')" 
        class="px-10 py-4 rounded-full bg-[var(--color-primary)] text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all"
      >
        Return to Home
      </button>
    </div>

    <div class="mt-20 opacity-20">
      <i class="fas fa-leaf text-[var(--color-primary)] text-2xl"></i>
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>