<script setup>
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ServiceOverview from '@/views/services/ServiceOverview.vue'

gsap.registerPlugin(ScrollTrigger);

const heroContainer = ref(null);

onMounted(() => {

  // Hero Text Reveal
  const tl = gsap.timeline();
  tl.from(".hero-title", { 
    y: 100, 
    opacity: 0, 
    duration: 1.2, 
    ease: "power4.out",
    delay: 0.5 
  })
  .from(".hero-sub", { 
    y: 30, 
    opacity: 0, 
    duration: 1, 
    ease: "power3.out" 
  }, "-=0.8")
  .from(".hero-cta", { 
    scale: 0.9, 
    opacity: 0, 
    duration: 0.8, 
    stagger: 0.2, 
    ease: "back.out(1.7)" 
  }, "-=0.5");

  // Floating Abstract Elements Animation
  gsap.to(".floating-stone", {
    y: -20,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.5
  });

  // Section Scroll Reveals
  gsap.utils.toArray('.reveal-section').forEach(section => {
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none"
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });
});
</script>

<template>
  <div class="selection:bg-[var(--color-secondary)]/30">
    
    <section class="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-white">
      <div class="absolute top-1/4 -right-20 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl floating-stone"></div>
      <div class="absolute bottom-1/4 -left-10 w-64 h-64 bg-[var(--color-secondary)]/10 rounded-full blur-3xl floating-stone"></div>

      <div class="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div class="z-10">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-sm font-medium mb-6 hero-sub">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
            </span>
            Certified Social Worker & UNAM Graduate
          </div>
          
          <h1 class="hero-title font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-primary)] mb-8">
            When Life Feels <span class="italic text-[var(--color-secondary)]">Heavy</span>, You Don’t Have to Carry It Alone.
          </h1>
          
          <p class="hero-sub text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed font-light">
            Confidential psychological counselling in Tsumeb and online across Namibia — supporting individuals, couples, children, and families.
          </p>
          
          <div class="hero-cta flex flex-wrap gap-4">
            <router-link to="/booking" class="btn-primary">
              Book a Session
              <i class="fas fa-calendar-alt ml-2 opacity-70"></i>
            </router-link>
            <a href="https://wa.me/264812656253" rel="noopener" target="_blank" class="btn-ghost border border-gray-200">
              <i class="fab fa-whatsapp mr-2 text-green-600"></i>
              Chat on WhatsApp
            </a>
          </div>
          <p class="mt-6 text-xs text-gray-400 uppercase tracking-widest font-medium">Serving Namibia Nationwide</p>
        </div>

        <div class="relative hidden lg:block">
          <div class="relative z-10 w-full h-[600px] rounded-[40px] overflow-hidden shadow-2xl floating-stone">
             <img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800" alt="Serenity" class="w-full h-full object-cover">
             <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/40 to-transparent"></div>
          </div>
          <svg class="absolute -top-10 -right-10 w-64 h-64 text-[var(--color-accent)]/20 animate-spin-slow" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.2,-69.2,70.1,-58.3,77.9,-44.9C85.7,-31.5,89.5,-15.7,88.4,-0.6C87.4,14.5,81.5,29,72.4,41.4C63.2,53.8,50.8,64.1,36.9,71.2C23.1,78.3,7.7,82.2,-7.4,80.1C-22.5,78,-37.2,69.9,-49.6,59.3C-62,48.7,-72.1,35.6,-77.8,20.8C-83.5,6,-84.9,-10.5,-80.4,-25.3C-75.9,-40.1,-65.4,-53.2,-52.3,-60.7C-39.2,-68.2,-23.5,-70.2,-8.1,-75.4C7.2,-80.6,22.7,-88.9,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
    </section>

    <section class="reveal-section py-24 bg-[var(--color-background)]">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="font-serif text-4xl md:text-6xl text-[var(--color-primary)] mb-12">
            Sometimes You Just Need a <br/> <span class="italic">Safe Place</span> to Be Heard.
          </h2>
          <div class="grid md:grid-cols-2 gap-12 text-left items-center">
            <div class="space-y-6 text-gray-700 leading-relaxed text-lg font-light">
              <p>There are moments when stress becomes overwhelming. When relationships feel strained. When anxiety won’t quiet down.</p>
              <p>At Nangura Social Care, you are welcomed into a confidential, respectful, and professional space where your story matters.</p>
            </div>
            <div class="glass-panel p-8 rounded-3xl border-l-4 border-l-[var(--color-primary)]">
              <blockquote class="text-xl italic font-serif text-[var(--color-primary)]">
                "Seeking support is not weakness. It is wisdom."
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ServiceOverview />

    <section class="reveal-section py-24 bg-[var(--color-primary)] text-white overflow-hidden rounded-[60px] mx-4 mb-24">
          <div class="container mx-auto px-6">
            <h2 class="font-serif text-5xl text-center mb-20 text-[var(--color-accent)]">What Happens When You Book?</h2>
            
            <div class="grid md:grid-cols-4 gap-12 relative">
              <div class="hidden md:block absolute top-10 left-0 w-full h-px bg-white/20"></div>
              
              <div class="relative group">
                <div class="w-20 h-20 rounded-full bg-white text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-8 relative z-10 group-hover:scale-110 transition-transform">01</div>
                <h4 class="font-serif text-xl mb-4 text-[var(--color-accent)]">Secure Reservation</h4>
                <p class="text-white/60 font-light text-sm">Your session is instantly logged into our secure database, ensuring your clinical data remains encrypted and private.</p>
              </div>

              <div class="relative group">
                <div class="w-20 h-20 rounded-full bg-white text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-8 relative z-10 group-hover:scale-110 transition-transform">02</div>
                <h4 class="font-serif text-xl mb-4 text-[var(--color-accent)]">Automated Sync</h4>
                <p class="text-white/60 font-light text-sm">Our system synchronizes with the practitioner's calendar to generate a private, unique Google Meet room for your consultation.</p>
              </div>

              <div class="relative group">
                <div class="w-20 h-20 rounded-full bg-white text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-8 relative z-10 group-hover:scale-110 transition-transform">03</div>
                <h4 class="font-serif text-xl mb-4 text-[var(--color-accent)]">Verification</h4>
                <p class="text-white/60 font-light text-sm">You receive a professional validation via Zoho Mail with your secure entry link and a formal calendar invite.</p>
              </div>

              <div class="relative group">
                <div class="w-20 h-20 rounded-full bg-white text-[var(--color-primary)] flex items-center justify-center text-2xl font-bold mb-8 relative z-10 group-hover:scale-110 transition-transform">04</div>
                <h4 class="font-serif text-xl mb-4 text-[var(--color-accent)]">Care Continuity</h4>
                <p class="text-white/60 font-light text-sm">On the morning of your session, an automated reminder is sent to ensure you are prepared for your journey toward well-being.</p>
              </div>

            </div>
          </div>
    </section>

    <section class="reveal-section container mx-auto px-6 mb-24">
      <div class="bg-red-50 border border-red-100 p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
        <div class="w-20 h-20 flex-shrink-0 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div>
          <h3 class="font-serif text-3xl text-red-900 mb-2">If You Are in Immediate Emotional Crisis</h3>
          <p class="text-red-800/70 text-lg leading-relaxed">
            Please contact your nearest hospital or emergency service immediately. You deserve urgent support and safety.
          </p>
        </div>
        <router-link to="/crisis" class="btn-primary bg-red-600 hover:bg-red-700 whitespace-nowrap">Emergency Contacts</router-link>
      </div>
    </section>

  </div>
</template>

<style>

/* Elegant Text Highlight */
.italic {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 400;
}
</style>