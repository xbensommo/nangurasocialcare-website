<template>
  <div class="min-h-screen bg-[#FFF5F5] flex items-center justify-center px-4 py-12 md:py-20">
    <div class="max-w-3xl w-full bg-white rounded-[40px] shadow-2xl border border-red-100 overflow-hidden">
      
      <div class="bg-red-600 p-8 md:p-12 text-center text-white">
        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 backdrop-blur-md">
          <i class="fas fa-phone-alt animate-pulse"></i>
        </div>
        <h1 class="font-serif text-4xl md:text-5xl mb-4">Immediate Assistance</h1>
        <p class="text-red-100 font-light max-w-xl mx-auto leading-relaxed">
          If you are in danger or experiencing thoughts of self-harm, please reach out to these emergency services immediately. You are not alone.
        </p>
      </div>

      <div class="p-8 md:p-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <a href="tel:112" class="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 hover:bg-red-100 transition-colors group">
            <span class="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Mobile Emergency</span>
            <span class="text-4xl font-mono font-bold text-red-700 group-hover:scale-110 transition-transform">112</span>
          </a>
          <a href="tel:10111" class="flex flex-col items-center p-6 bg-red-50 rounded-3xl border border-red-100 hover:bg-red-100 transition-colors group">
            <span class="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">National Police</span>
            <span class="text-4xl font-mono font-bold text-red-700 group-hover:scale-110 transition-transform">10111</span>
          </a>
        </div>

        <div class="space-y-4 mb-12">
          <h2 class="font-serif text-2xl text-gray-800 mb-6 flex items-center gap-3">
             Medical Rescue <div class="h-px flex-1 bg-gray-100"></div>
          </h2>
          
          <div class="grid grid-cols-1 gap-3">
            <div v-for="contact in medicalContacts" :key="contact.name" 
                 class="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <p class="font-bold text-gray-800">{{ contact.name }}</p>
                <p class="text-xs text-gray-500">{{ contact.note }}</p>
              </div>
              <a :href="`tel:${contact.number.replace(/\s+/g, '')}`" class="px-5 py-2 bg-white rounded-full text-[var(--color-secondary)] font-bold shadow-sm hover:shadow-md transition-all">
                {{ contact.number }}
              </a>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-[30px] p-8 text-center border border-gray-100">
          <p class="text-gray-500 text-sm italic mb-6">
            "This practice does not provide emergency intervention, but once you are safe, we are here to support your long-term healing."
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/booking" class="px-8 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[var(--color-primary)]/20 transition-all">
              Book a Safe Session
            </router-link>
            <router-link to="/" class="px-8 py-4 bg-white text-gray-400 rounded-full font-medium border border-gray-200 hover:bg-gray-50">
              Return Home
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head';

const medicalContacts = [
  { name: "E-Med Rescue 24", number: "924", note: "Private Ambulance & Air Rescue" },
  { name: "Lifelink Emergency", number: "999", note: "Landline Emergency Service" },
  { name: "EMA Rescue", number: "085 9112", note: "Free assistance for non-medical aid holders" },
  { name: "City of Windhoek Fire/Rescue", number: "061 211 111", note: "Regional specialized rescue" }
];

useHead({
  title: 'Mental Health Support in Namibia | Crisis & Emergency Contacts',
  meta: [
    { name: 'description', content: 'Immediate mental health support in Namibia. If you are in crisis, please find emergency numbers for suicide prevention, gender-based violence, and hospital contacts here.' },
    { name: 'robots', content: 'index, follow' } // Important: Let people find this page!
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who do I call for a mental health emergency in Namibia?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Please contact the Lifeline/Childline Namibia at 116 or go to your nearest hospital casualty department immediately."
            }
          }
        ]
      })
    }
  ]
})
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
</style>