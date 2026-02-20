<template>
  <section class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6 relative overflow-hidden">
    <!-- Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary)] rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-20 right-10 w-72 h-72 bg-[var(--color-secondary)] rounded-full filter blur-3xl"></div>
    </div>

    <div class="container mx-auto max-w-7xl relative z-10">
      <!-- Header -->
      <div class="text-center mb-20">
        <span class="text-[var(--color-secondary)] font-bold tracking-[0.3em] text-xs uppercase mb-4 block">What We Offer</span>
        <h1 class="font-serif text-5xl md:text-7xl text-[var(--color-primary)] mb-6">Services for <span class="italic">Every Journey</span></h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Professional, compassionate care tailored to your unique needs. Available in-person in Tsumeb and online across Namibia.
        </p>
      </div>

      <!-- Service Cards - Fixed visibility -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        <div v-for="(service, index) in services" :key="index" 
             class="group bg-white/90 backdrop-blur-sm p-8 rounded-[40px] border border-gray-100 hover:border-[var(--color-secondary)]/30 transition-all duration-500 hover:-translate-y-2 shadow-lg"
             :style="{ opacity: 1 }"> <!-- Explicit opacity 1 ensures visibility -->
          <div class="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i :class="service.icon" class="text-2xl text-[var(--color-secondary)]"></i>
          </div>
          <h3 class="font-serif text-2xl text-[var(--color-primary)] mb-3">{{ service.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed mb-4">{{ service.description }}</p>
          <ul class="space-y-2 mb-6">
            <li v-for="feature in service.features" :key="feature" class="text-xs text-gray-400 flex items-center gap-2">
              <i class="fas fa-check-circle text-[var(--color-accent)] text-xs"></i> {{ feature }}
            </li>
          </ul>
          <button @click="$emit('select-service', service.title)" 
                  class="w-full py-3 border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all">
            Learn More
          </button>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="grid md:grid-cols-3 gap-8 text-center">
        <div class="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100">
          <div class="text-3xl font-serif text-[var(--color-secondary)] mb-2">8+</div>
          <div class="text-sm text-gray-400 uppercase tracking-wider">Years Experience</div>
        </div>
        <div class="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100">
          <div class="text-3xl font-serif text-[var(--color-secondary)] mb-2">500+</div>
          <div class="text-sm text-gray-400 uppercase tracking-wider">Clients Supported</div>
        </div>
        <div class="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100">
          <div class="text-3xl font-serif text-[var(--color-secondary)] mb-2">100%</div>
          <div class="text-sm text-gray-400 uppercase tracking-wider">Confidential</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { useHead } from '@vueuse/head'

// SEO Configuration
useHead({
  title: 'Professional Counselling Services Namibia | Individual, Couples & Family Therapy | Nangura Social Care',
  meta: [
    {
      name: 'description',
      content: 'Comprehensive counselling services in Tsumeb and online across Namibia. Individual therapy (N$450), couples counselling (N$650), child & family support (N$500). CBT, trauma-informed care, and relationship mediation. Book your confidential session today.'
    },
    {
      name: 'keywords',
      content: 'Counselling Services Namibia, Therapy Tsumeb, Individual Counselling, Couples Therapy Namibia, Child Counselling, Family Therapy, Online Counselling Namibia, CBT Namibia, Trauma Therapy, Relationship Mediation, Mental Health Support Namibia'
    },
    // Open Graph tags for social sharing
    {
      property: 'og:title',
      content: 'Professional Counselling Services Namibia | Nangura Social Care'
    },
    {
      property: 'og:description',
      content: 'Expert counselling services in Tsumeb and online nationwide. Individual, couples, and family therapy with compassionate, professional care.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://nangurasocialcare.org/services'
    },
    {
      property: 'og:image',
      content: 'https://nangurasocialcare.org/images/services-og.jpg'
    },
    // Twitter Card tags
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'Professional Counselling Services Namibia'
    },
    {
      name: 'twitter:description',
      content: 'Individual, couples & family therapy in Tsumeb and online across Namibia.'
    }
  ],
  link: [
    { 
      rel: 'canonical', 
      href: 'https://nangurasocialcare.org/services' 
    },
    {
      rel: 'alternate',
      hreflang: 'en-NA',
      href: 'https://nangurasocialcare.org/services'
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        "@id": "https://nangurasocialcare.org/services",
        "name": "Nangura Social Care Counselling Services",
        "description": "Professional counselling services in Tsumeb and online across Namibia",
        "url": "https://nangurasocialcare.org/services",
        "telephone": "+264811234567",
        "email": "info@nangurasocialcare.org",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Tsumeb",
          "addressRegion": "Oshikoto",
          "addressCountry": "NA"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Namibia"
        },
        "priceRange": "N$450 - N$650",
        "openingHours": "Mo-Fr 08:00-17:00, Sa 08:00-12:00",
        "medicalSpecialty": ["Psychotherapy", "Counseling", "MentalHealth"],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Counselling Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Individual Counselling",
                "description": "One-on-one therapy for anxiety, depression, trauma, and life challenges",
                "price": "450",
                "priceCurrency": "NAD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Couples Counselling",
                "description": "Relationship mediation and communication tools for couples",
                "price": "650",
                "priceCurrency": "NAD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Child & Family Counselling",
                "description": "Developmental support and family therapy with child-led approach",
                "price": "500",
                "priceCurrency": "NAD"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Online Counselling",
                "description": "Secure video therapy sessions available nationwide",
                "price": "450",
                "priceCurrency": "NAD"
              }
            }
          ]
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "127"
        },
        "sameAs": [
          "https://www.facebook.com/nangurasocialcare",
          "https://www.instagram.com/nangurasocialcare"
        ]
      })
    }
  ]
})

// Services data with visibility ensured
const services = ref([
  { 
    icon: 'fas fa-user', 
    title: 'Individual', 
    description: 'Personalized one-on-one therapy for anxiety, depression, trauma, and life transitions.',
    features: ['CBT Techniques', 'Trauma-Informed', 'Goal-Oriented', 'Confidential']
  },
  { 
    icon: 'fas fa-heart', 
    title: 'Couples', 
    description: 'Strengthen your relationship with professional mediation and communication tools.',
    features: ['Conflict Resolution', 'Trust Building', 'Communication', 'Safe Space']
  },
  { 
    icon: 'fas fa-family', 
    title: 'Child & Family', 
    description: 'Support for children, teens, and families through developmental challenges.',
    features: ['Play Therapy', 'Parent Guidance', 'School Liaison', 'Family Dynamics']
  },
  { 
    icon: 'fas fa-video', 
    title: 'Online', 
    description: 'Secure video counselling sessions accessible from anywhere in Namibia.',
    features: ['Flexible Hours', 'Secure Platform', 'Nationwide', 'Same Quality Care']
  }
])

onMounted(() => {
  // Animation for service cards
  gsap.from(".group", {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  })
  
  // Animation for trust indicators
  gsap.from(".grid.md\\:grid-cols-3 > div", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    delay: 0.5,
    ease: "power3.out"
  })
})

// Emit event for parent components
defineEmits(['select-service'])
</script>

<style scoped>
/* Ensure cards are fully visible */
.group {
  opacity: 1 !important; /* Override any global opacity issues */
}

/* Optional hover effects */
.group:hover {
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}
</style>