<template>
  <section class="py-32 bg-[var(--color-neutral)]/30">
    <div class="container mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-20">
        <h2 class="font-serif text-5xl mb-6">Support Designed Around Real Life</h2>
        <p class="text-gray-500 font-light italic">Whether you’re navigating personal challenges or family concerns, you’ll find care that meets you where you are.</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <div v-for="service in services" :key="service.title" 
             class="glass-card p-10 hover:bg-[var(--color-primary)] group transition-all duration-700">
          <div class="w-12 h-12 mb-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <i :class="service.icon" class="text-[var(--color-primary)] group-hover:text-white transition-colors"></i>
          </div>
          <h3 class="font-serif text-2xl mb-4 group-hover:text-white transition-colors">{{ service.title }}</h3>
          <p class="text-gray-500 group-hover:text-white/80 font-light leading-relaxed transition-colors">
            {{ service.desc }}
          </p>
        </div>
      </div>
      
      <div class="mt-16 text-center">
        <button class="btn-ghost underline underline-offset-8 decoration-[var(--color-accent)]">Explore All Services</button>
      </div>
    </div>
  </section>
</template>

<script setup>
const services = [
  { title: 'Individual Counselling', desc: 'Support for anxiety, depression, trauma, stress, and grief.', icon: 'fas fa-user' },
  { title: 'Couples Counselling', desc: 'Strengthen communication, rebuild trust, and reconnect.', icon: 'fas fa-heart' },
  { title: 'Child Counselling', desc: 'Professional support for emotional and behavioural challenges.', icon: 'fas fa-child' },
];
</script>