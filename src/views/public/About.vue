<template>
  <div class="min-h-screen bg-[#FAFAF9] selection:bg-[var(--color-secondary)]/20 overflow-x-hidden">

    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
      <div class="container mx-auto max-w-7xl">
        <div class="flex flex-col lg:flex-row gap-16 items-center">
          
          <div class="w-full lg:w-1/2 relative flex justify-center order-2 lg:order-1">
            <div class="relative w-full max-w-[500px] aspect-square">
              <div class="absolute -top-10 -left-10 w-64 h-64 bg-[var(--color-accent)]/20 rounded-full blur-3xl animate-float"></div>
              
              <div ref="profileImage" class="morphing-blob w-full h-full overflow-hidden border-2 border-[var(--color-primary)]/10 shadow-2xl relative z-10 bg-white">
                <img 
                  src="@/assets/Profile/bright.jpg" 
                  alt="Bertha Ndara" 
                  class="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000"
                />
              </div>

              <div class="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-20 reveal-item">
                <p class="text-[var(--color-primary)] font-bold text-xs tracking-widest uppercase">Expertise</p>
                <p class="font-serif text-3xl">{{ (new Date().getFullYear()) - 2022 }}+ Years</p>
              </div>
            </div>
          </div>

          <div class="w-full lg:w-1/2 order-1 lg:order-2">
            <span class="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-6 reveal-item">
              Founder & Social Worker
            </span>
            <h1 class="font-serif text-6xl md:text-8xl text-[var(--color-primary)] leading-[0.85] mb-8 reveal-item">
              Meet <br/> <span class="italic text-[var(--color-secondary)]">Bertha Ndara</span>
            </h1>
            <p class="text-xl text-gray-600 font-light leading-relaxed mb-10 reveal-item">
              Rooted in Namibia. Serving Namibia. Bertha is a qualified Social Worker dedicated to providing a structured, non-judgmental, and confidential environment where healing begins.
            </p>
            
            <div class="flex flex-wrap gap-4 reveal-item">
              <a href="mailto:bertha@nangurasocialcare.org" class="flex items-center gap-3 glass-panel px-6 py-3 rounded-xl border border-gray-200 hover:border-[var(--color-secondary)] transition-all">
                <i class="fas fa-envelope text-[var(--color-accent)]"></i>
                <span class="text-sm font-medium">bertha@nangurasocialcare.org</span>
              </a>
              <a href="mailto:info@nangurasocialcare.org" class="flex items-center gap-3 glass-panel px-6 py-3 rounded-xl border border-gray-200 hover:border-[var(--color-secondary)] transition-all">
                <i class="fas fa-envelope text-[var(--color-secondary)]"></i>
                <span class="text-sm font-medium">info@nangurasocialcare.org</span>
              </a>
              <a href="tel:+264818772011" class="flex items-center gap-3 glass-panel px-6 py-3 rounded-xl border border-gray-200 hover:border-[var(--color-secondary)] transition-all">
                <i class="fab fa-whatsapp text-green-500 text-lg"></i>
                <span class="text-sm font-medium">+264 81 265 6253</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="biography" class="py-24 bg-white">
      <div class="container mx-auto max-w-5xl px-6">
        <div class="grid lg:grid-cols-12 gap-16">
          <div class="lg:col-span-4">
            <h2 class="font-serif text-4xl text-[var(--color-primary)] sticky top-32">The Professional <br/>Journey</h2>
          </div>
          <div class="lg:col-span-8 space-y-8 text-lg text-gray-600 font-light leading-relaxed">
            <p class="reveal-scroll">
              Bertha Ndara is a qualified Social Worker with professional experience supporting children, families, couples, and individuals across Namibia. She has worked extensively in child protection services, assisting vulnerable children and strengthening family systems through structured case management.
            </p>
            
            <div class="grid md:grid-cols-2 gap-6 my-12 reveal-scroll">
              <div class="p-8 rounded-3xl bg-[var(--color-background)] border border-gray-100">
                <h4 class="font-serif text-xl text-[var(--color-primary)] mb-4 italic">Experience In:</h4>
                <ul class="space-y-3 text-sm">
                  <li class="flex items-center gap-2"><i class="fas fa-check text-[var(--color-accent)]"></i> Child Protection Services</li>
                  <li class="flex items-center gap-2"><i class="fas fa-check text-[var(--color-accent)]"></i> Therapeutic Group Sessions</li>
                  <li class="flex items-center gap-2"><i class="fas fa-check text-[var(--color-accent)]"></i> Psychosocial Education</li>
                  <li class="flex items-center gap-2"><i class="fas fa-check text-[var(--color-accent)]"></i> Community Awareness</li>
                </ul>
              </div>
              <div class="p-8 rounded-3xl bg-[var(--color-primary)] text-white shadow-xl">
                <h4 class="font-serif text-xl mb-4 italic">Academic Base:</h4>
                <p class="text-sm text-white/80">Graduate of the University of Namibia (UNAM). Practicing Evidence-Based techniques including Cognitive Behavioral Therapy (CBT).</p>
              </div>
            </div>

            <p class="reveal-scroll">
              Through <span class="font-medium text-gray-900">Nangura Social Care</span>, Bertha has created a platform that makes professional mental health services more accessible for Namibians nationwide. Online sessions allow clients to receive professional support from the comfort and privacy of their own homes.
            </p>
          </div>
        </div>
      </div>
    </section>

   
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const profileImage = ref(null);

onMounted(() => {
  // 1. Initial Hero Stagger
  gsap.from(".reveal-item", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power4.out",
    delay: 0.5
  });

  // 2. Morphing Blob Animation
  gsap.to(".morphing-blob", {
    borderRadius: "40% 60% 70% 30% / 50% 60% 30% 50%",
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // 3. Scroll Reveals for Bio Text
  gsap.utils.toArray('.reveal-scroll').forEach((el) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
      y: 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // 4. Parallax effect on the blob photo
  gsap.to(".morphing-blob img", {
    scrollTrigger: {
      trigger: ".morphing-blob",
      start: "top bottom",
      scrub: true
    },
    y: -50,
    ease: "none"
  });
});
</script>

<style>
/* Awwwards Styling Hooks */
:root {
  --color-primary: #2E5B28;
  --color-secondary: #2B75BC;
  --color-accent: #8BC53F;
  --color-background: #FAFAF9;
}

.font-serif {
  font-family: 'Playfair Display', serif;
}

.font-sans {
  font-family: 'Jost', sans-serif;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.morphing-blob {
  /* Initial state before GSAP kicks in */
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.btn-primary-sm:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(46, 91, 40, 0.2);
  transition: all 0.3s ease;
}
</style>