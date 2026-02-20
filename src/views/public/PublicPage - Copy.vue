<script setup>
import { ref, computed } from 'vue';

const moods = [
  { id: 'heavy', label: 'Heavy', color: 'from-slate-200 to-slate-400', recommend: 'Individual Therapy' },
  { id: 'chaos', label: 'Overwhelmed', color: 'from-orange-100 to-amber-200', recommend: 'Stress Management' },
  { id: 'foggy', label: 'Unclear', color: 'from-teal-100 to-emerald-200', recommend: 'Career Counselling' }
];

const activeMood = ref(null);

// This emits the color change event to the parent layout to shift the background theme
const selectMood = (mood) => {
  activeMood.value = mood;
  document.documentElement.style.setProperty('--bg-gradient-dynamic', mood.color);
};
import { useHead } from '@vueuse/head'

useHead({
  title: 'Certified Psychologist in Namibia | Nangura Social Care | Online & Tsumeb Therapy',

  meta: [
    {
      name: 'description',
      content: 'Nangura Social Care offers confidential psychological counselling in Tsumeb and online across Namibia. Individual, couples, trauma and child therapy with a certified social worker.'
    },
    {
      name: 'keywords',
      content: 'Psychologist Namibia, Counselling Namibia, Psychologist Tsumeb, Online Therapy Namibia, Couples Counselling Namibia, Child Therapy Namibia'
    },
    { name: 'author', content: 'Nangura Social Care | Namibia' },
    { name: 'robots', content: 'index, follow' },

    // Open Graph
    { property: 'og:title', content: 'Certified Psychologist in Namibia | Nangura Social Care' },
    { property: 'og:description', content: 'Confidential counselling services in Tsumeb and online across Namibia.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://nangurasocialcare.org' }
  ],

  link: [
    { rel: 'canonical', href: 'https://nangurasocialcare.org' }
  ],

  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "name": "Nangura Social Care",
        "url": "https://nangurasocialcare.org",
        "telephone": "+264811234567",
        "email": "info@nangurasocialcare.org",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tsumeb",
          "addressRegion": "Oshikoto Region",
          "addressCountry": "NA"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Namibia"
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday","Tuesday","Wednesday","Thursday","Friday"
            ],
            "opens": "08:00",
            "closes": "17:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "08:00",
            "closes": "12:00"
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="glass-panel p-8 rounded-3xl max-w-md mx-auto transition-all duration-700 hover:shadow-2xl">
    <h2 class="font-serif text-3xl text-[var(--color-primary)] mb-6">How is your inner weather?</h2>
    
    <div class="grid grid-cols-3 gap-4">
      <button 
        v-for="mood in moods" 
        :key="mood.id"
        @click="selectMood(mood)"
        class="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-white/50 group"
        :class="{ 'bg-white shadow-md scale-105': activeMood?.id === mood.id }"
      >
        <div class="w-12 h-12 rounded-full bg-gradient-to-br opacity-80 group-hover:scale-110 transition-transform"
             :class="mood.color"></div>
        <span class="font-sans text-sm text-gray-600 font-medium">{{ mood.label }}</span>
      </button>
    </div>

    <transition name="fade-slide">
      <div v-if="activeMood" class="mt-8 pt-6 border-t border-gray-100">
        <p class="text-sm text-gray-400 font-sans uppercase tracking-widest mb-2">We suggest</p>
        <p class="font-serif text-2xl text-[var(--color-secondary)]">{{ activeMood.recommend }}</p>
        <button class="btn-primary mt-4 w-full">Book a Session</button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Vue Transition Classes for smooth entry */
.fade-slide-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
