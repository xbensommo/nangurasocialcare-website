<template>
  <section class="py-24 bg-white overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div class="max-w-2xl">
          <span class="text-[var(--color-accent)] font-bold tracking-widest text-xs uppercase mb-4 block reveal-journal">Psychosocial Education</span>
          <h2 class="font-serif text-5xl md:text-7xl text-[var(--color-primary)] reveal-journal">The <span class="italic text-[var(--color-secondary)]">Journal</span> of Calm</h2>
        </div>
        <button class="btn-ghost group reveal-journal">
          View All Resources <i class="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div class="md:col-span-8 group cursor-pointer reveal-journal">
          <div class="relative overflow-hidden rounded-[40px] aspect-[16/9] mb-6">
            <img src="https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=1200" 
                 class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Mental Clarity">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            <div class="absolute bottom-8 left-8 text-white">
              <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs mb-4 inline-block">Wellness</span>
              <h3 class="font-serif text-3xl md:text-4xl">Understanding the Weight of Burnout in the Workplace</h3>
            </div>
          </div>
        </div>

        <div class="md:col-span-4 flex flex-col gap-8">
          <div v-for="i in 2" :key="i" class="group cursor-pointer reveal-journal">
            <div class="relative overflow-hidden rounded-[30px] aspect-square mb-4">
              <img :src="`https://images.unsplash.com/photo-1516302752625-fbc3c8819f07?auto=format&fit=crop&q=80&w=600&sig=${i}`" 
                   class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Article">
            </div>
            <h4 class="font-serif text-2xl text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors">
              {{ i === 1 ? '5 Signs Your Child Needs Emotional Support' : 'The Power of Boundaried Communication' }}
            </h4>
            <p class="text-sm text-gray-400 mt-2 uppercase tracking-tighter">4 Min Read • By Bertha Ndara</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  gsap.from(".reveal-journal", {
    scrollTrigger: {
      trigger: ".reveal-journal",
      start: "top 85%",
    },
    y: 40,
    opacity: 0,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out"
  });
});
</script>