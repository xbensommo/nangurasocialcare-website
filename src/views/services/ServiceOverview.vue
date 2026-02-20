<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6" id="#services">
    <div class="container mx-auto max-w-7xl">
      
      <div class="text-center mb-20 reveal-services">
        <span class="text-[var(--color-secondary)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block"> Expertise</span>
        <h1 class="font-serif text-5xl md:text-6xl text-[var(--color-primary)] mb-6">Psychological Counselling <br> <span class="italic">Services in Namibia</span></h1>
        <p class="text-gray-600 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Life presents challenges in many forms. The right support can make those challenges manageable. Nangura Social Care offers structured counselling services tailored to different stages of life.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <router-link 
          v-for="(service, index) in services" 
          :key="index" 
          :to="service.link"
          class="service-card group relative bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden block"
        >
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-[var(--color-primary)]/10   rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          
          <div class="relative z-10">
            <h3 class="font-serif text-2xl text-[var(--color-primary)] mb-4">{{ service.title }}</h3>
            <p class="text-gray-500 font-light leading-relaxed mb-8 min-h-[80px]">
              {{ service.desc }}
            </p>
            <div class="inline-flex items-center text-[var(--color-secondary)] font-medium text-sm group-hover:translate-x-2 transition-transform">
              Explore Service <i class="fas fa-arrow-right ml-2 text-xs"></i>
            </div>
          </div>
        </router-link>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from 'gsap';

// Updated links to match the dynamic :slug parameter in your router
const services = [
  { title: "Individual Counselling", desc: "Support for anxiety, depression, grief, stress, trauma, and life transitions.", link: "/services/individual-counselling" },
  { title: "Couples Counselling", desc: "Helping partners improve communication, resolve conflict, and rebuild trust.", link: "/services/couples-counselling" },
  { title: "Child Counselling", desc: "Professional support for emotional and behavioural challenges in children.", link: "/services/child-counselling" },
  { title: "Trauma Counselling", desc: "Structured support for individuals processing distressing life events.", link: "/services/trauma-counselling" },
  { title: "Workplace & Burnout", desc: "Support for professionals facing chronic stress and performance pressure.", link: "/services/workplace-counselling" },
  { title: "Online Therapy", desc: "Secure virtual sessions accessible from anywhere across Namibia.", link: "/services/online-therapy" }
];

onMounted(() => {
  gsap.from(".reveal-services", { 
    y: 30, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
  });
  
  gsap.from(".service-card", { 
    y: 50, 
    opacity: 1, 
    duration: 0.8, 
    stagger: 0.1, 
    ease: "power3.out", 
    delay: 0.3 
  });
});
</script>