<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6">
    <div class="container mx-auto max-w-7xl">
      <div class="text-center mb-20 reveal-pricing">
        <span class="text-[var(--color-secondary)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">Transparency</span>
        <h1 class="font-serif text-5xl md:text-7xl text-[var(--color-primary)] mb-6">Investment in <span class="italic">You</span></h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          We believe mental health support should be accessible and clearly communicated. No hidden costs, just professional care.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8 mb-24">
        <div v-for="(plan, index) in pricingPlans" :key="index" 
        class="pricing-card glass-panel p-10 rounded-[40px] border border-white flex flex-col transition-all duration-500 hover:-translate-y-4">
        <div class="mb-8">
          <h3 class="font-serif text-3xl text-[var(--color-primary)] mb-2">{{ plan.name }}</h3>
          <p class="text-sm text-gray-400 uppercase tracking-widest font-bold">{{ plan.duration }} Session</p>
        </div>
        <div class="flex items-baseline gap-1 mb-8">
          <span class="text-4xl font-serif text-[var(--color-secondary)]">N$</span>
          <span class="text-6xl font-bold tracking-tighter text-[var(--color-primary)]">{{ plan.price }}</span>
        </div>
        <ul class="space-y-4 mb-10 flex-grow">
          <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-gray-600 text-sm">
            <i class="fas fa-check text-[var(--color-accent)]"></i> {{ feature }}
          </li>
        </ul>
        <button @click="$emit('select-plan', plan.name)" class="btn-primary w-full justify-center">Select Plan</button>
      </div>
    </div>

    <div class="bg-red-50 border border-red-100 p-10 rounded-[40px] flex flex-col lg:flex-row items-center justify-between gap-8 reveal-pricing">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div>
          <h4 class="font-serif text-2xl text-red-900 mb-1">Immediate Emotional Crisis?</h4>
          <p class="text-red-700/70 text-sm">Please contact your nearest hospital or emergency service. You deserve safety.</p>
        </div>
      </div>
      <router-link to="/crisis" class="bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-colors">Emergency Contacts</router-link>
    </div>
  </div>
</div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { gsap } from 'gsap';
  import { useHead } from '@vueuse/head'

  useHead({
    title: 'Therapy Fees Namibia | Counselling Costs Tsumeb | Nangura Social Care',
    meta: [
      {
        name: 'description',
        content: 'Transparent counselling fees in Namibia. Individual N$450, Couples N$650, Child/Family N$500 per session. Affordable therapy in Tsumeb and online nationwide.'
      },
      {
        name: 'keywords',
        content: 'Counselling Fees Namibia, Therapy Costs Tsumeb, Session Prices Namibia, Affordable Counselling Namibia, Mental Health Investment'
      }
    ],
    link: [
      { rel: 'canonical', href: 'https://nangurasocialcare.org/fees' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthTopic",
          "name": "Counselling Fees and Pricing",
          "description": "Transparent pricing for mental health services in Namibia",
          "provider": {
            "@type": "MedicalBusiness",
            "name": "Nangura Social Care",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Namibia",
              "addressCountry": "NA"
            }
          },
          "offers": {
            "@type": "Offer",
            "description": "Professional counselling sessions",
            "price": "450",
            "priceCurrency": "NAD",
            "availability": "https://schema.org/InStock"
          }
        })
      }
    ]
  })

  const pricingPlans = [
    { name: 'Individual', price: '450', duration: '60 Min', features: ['Confidential 1-on-1', 'CBT Techniques', 'In-person or Online', 'Post-session summary'] },
    { name: 'Couples', price: '650', duration: '90 Min', features: ['Relationship Mediation', 'Communication Tools', 'Neutral Environment', 'Actionable Home Tasks'] },
    { name: 'Child/Family', price: '500', duration: '60 Min', features: ['Child-led Approach', 'Parental Guidance', 'Developmental Support', 'School Liaison avail.'] }
  ];

  onMounted(() => {
    gsap.from(".pricing-card", {
      y: 50, opacity: 0.5, duration: 1, stagger: 0.2, ease: "power4.out"
    });
  });
</script>