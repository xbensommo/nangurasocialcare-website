<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6">
    <div class="container mx-auto max-w-6xl">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        
        <div class="reveal-contact">
          <h1 class="font-serif text-6xl text-[var(--color-primary)] mb-10">Get in <span class="italic text-[var(--color-secondary)]">Touch</span></h1>
          
          <div class="space-y-8">
            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-secondary)] shadow-sm">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Phone & WhatsApp</h3>
                <p class="text-xl font-serif text-[var(--color-primary)]">+264 81 265 6253</p>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-secondary)] shadow-sm">
                <i class="fas fa-envelope"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Email</h3>
                <a href="mailto:info@nangurasocialcare.org" class="text-xl font-serif text-[var(--color-primary)] underline">info@nangurasocialcare.org</a>
              </div>
            </div>

            <div class="flex items-start gap-6">
              <div class="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--color-secondary)] shadow-sm">
                <i class="fas fa-map-pin"></i>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-sm uppercase tracking-wider mb-1">Location</h3>
                <p class="text-gray-600 font-light">Serving Namibia Nationwide (Online)</p>
              </div>
            </div>

            <div class="p-6 bg-white rounded-3xl border border-gray-100 mt-8">
              <h3 class="font-bold text-[var(--color-primary)] text-sm uppercase mb-3">Working Hours</h3>
              <div class="flex justify-between text-sm text-gray-500 border-b border-gray-100 pb-2 mb-2">
                <span>Mon – Fri</span>
                <span>08:00 – 17:00</span>
              </div>
              <div class="flex justify-between text-sm text-gray-500">
                <span>Saturday</span>
                <span>08:00 – 12:00</span>
              </div>
            </div>
          </div>
        </div>

        <div class="h-[500px] bg-[var(--color-primary)]/5 rounded-[50px] overflow-hidden relative reveal-contact">
          <div class="absolute inset-0 flex items-center justify-center">
            <p class="text-[var(--color-primary)]/40 font-serif italic text-2xl">Interactive Map Placeholder</p>
          </div>
          </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { gsap } from 'gsap';
import { useHead } from '@vueuse/head'

useHead({
  title: 'Contact Nangura Social Care | Tsumeb Counselling | Namibia Therapy',
  meta: [
    {
      name: 'description',
      content: 'Contact our compassionate team in Tsumeb, Namibia. Call +264 81 123 4567 or email info@nangurasocialcare.org. In-person and online counselling available nationwide. If you\'re in crisis, please contact emergency services immediately.'
    },
    {
      name: 'keywords',
      content: 'Contact Counsellor Tsumeb, Therapy Appointments Namibia, Mental Health Support Namibia, Crisis Helpline Namibia, Book Counselling Session'
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://nangurasocialcare.org/contact' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Nangura Social Care",
        "description": "Get in touch with our counselling team in Tsumeb, Namibia",
        "url": "https://nangurasocialcare.org/contact",
        "mainEntity": {
          "@type": "MedicalBusiness",
          "name": "Nangura Social Care",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Namibia",
            "addressRegion": "Africa",
            "addressCountry": "NA"
          },
          "telephone": "+264812656253",
          "email": "info@nangurasocialcare.org",
          "openingHours": "Mo-Fr 08:00-17:00, Sa 08:00-12:00",
          "areaServed": ["Khomas", "Erongo Region", "Oshikoto region", "Hardap", "Otjozondjupa", "Zambezi", "Botwasana", "Zambia", "Angola", "Namibia"],
          "availableChannel": {
            "@type": "ServiceChannel",
            "availableLanguage": ["English", "Afrikaans", "Oshiwambo"],
            "serviceUrl": "https://nangurasocialcare.org/about"
          }
        },
        "hasPart": {
          "@type": "WPHeader",
          "about": {
            "@type": "Thing",
            "name": "Crisis Support Information",
            "description": "If you are in immediate crisis, please contact emergency services or your nearest hospital."
          }
        }
      })
    }
  ]
})

onMounted(() => {
  gsap.from(".reveal-contact", { x: -30, opacity: 0, duration: 1, stagger: 0.3, ease: "power3.out" });
});
</script>