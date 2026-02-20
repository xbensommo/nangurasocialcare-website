<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-24 px-6">
    <div class="container mx-auto max-w-3xl">

      <div class="text-center mb-16">
        <h1 class="font-serif text-5xl text-[var(--color-primary)] mb-4">Common Questions</h1>
        <p class="text-gray-500">Clarity on our process and ethics.</p>
      </div>

      <div class="space-y-4">
        <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <button @click="toggle(index)" class="w-full text-left p-6 flex justify-between items-center group">
            <span class="font-serif text-xl text-[var(--color-primary)]">{{ faq.q }}</span>
            <span class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
              <i :class="['fas', activeIndex === index ? 'fa-minus' : 'fa-plus']"></i>
            </span>
          </button>
          <div v-show="activeIndex === index" class="px-6 pb-6 text-gray-600 font-light leading-relaxed">
            {{ faq.a }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useHead } from '@vueuse/head'

  const activeIndex = ref(0);
  const toggle = (i) => activeIndex.value = activeIndex.value === i ? null : i;

  const faqs = [
    { q: "Are sessions confidential?", a: "Yes. All sessions are strictly confidential in accordance with professional ethical standards." },
    { q: "How long is each session?", a: "Sessions typically last 45–60 minutes." },
    { q: "How do I book?", a: "You may book via WhatsApp, phone call, or using our online booking form." },
    { q: "Are online sessions secure?", a: "Yes. We use secure, encrypted platforms to protect your privacy and data." },
    { q: "How often should I attend?", a: "This depends on your individual needs and goals. We will discuss a suitable schedule during your first session." }
  ];

  useHead({
    title: 'Mental Health Support in Namibia | If You Are in Crisis',

    meta: [
      {
        name: 'description',
        content: 'Professional individual counselling in Namibia. Support for anxiety, depression, trauma and life challenges. Available in Tsumeb and online nationwide.'
      },
      {
        name: 'keywords',
        content: 'Individual Counselling Namibia, Depression Therapy Namibia, Anxiety Counselling Namibia, Private Therapy Namibia'
      }
    ],

    link: [
      { rel: 'canonical', href: 'https://nangurasocialcare.org/faq' }
      ],

      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalTherapy",
            "name": "Individual Counselling in Namibia",
            "provider": {
              "@type": "MedicalBusiness",
              "name": "Nangura Social Care"
            }
          })
        }
      ]
    })

  </script>