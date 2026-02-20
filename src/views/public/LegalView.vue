<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6">
    <div class="container mx-auto max-w-3xl bg-white p-12 rounded-[40px] shadow-sm border border-gray-100">
      
      <h1 class="font-serif text-4xl text-[var(--color-primary)] mb-8 pb-8 border-b border-gray-100">
        {{ pageTitle }}
      </h1>

      <div class="prose prose-lg prose-p:text-gray-600 prose-p:font-light prose-headings:font-serif prose-headings:text-[var(--color-primary)] prose-li:text-gray-600">
        
        <div v-if="pageType === 'privacy'">
          <p>Nangura Social Care is committed to protecting your privacy.</p>
          <h3>Information Collected</h3>
          <ul>
            <li>Name</li>
            <li>Contact details</li>
            <li>Booking information</li>
          </ul>
          <h3>How we use it</h3>
          <p>Personal information is stored securely, never sold, and used only for service provision. Online sessions use encrypted platforms. All counselling is confidential per Namibian regulations.</p>
          <p>Contact: info@nangurasocialcare.org</p>
        </div>

        <div v-if="pageType === 'terms'">
          <p>By booking a session with Nangura Social Care, you agree to provide accurate information and respect scheduled times.</p>
          <h3>Cancellations</h3>
          <p>Missed appointments without reasonable notice may incur fees.</p>
          <h3>Scope</h3>
          <p>This service does not replace emergency medical services. All care is provided within professional ethical standards.</p>
        </div>

        <div v-if="pageType === 'cookies'">
          <p>This website may use cookies to improve user experience and analyze site performance.</p>
          <p>Cookies do not collect sensitive personal counselling information. By using this site, you consent to the use of cookies.</p>
        </div>

         <div v-if="pageType === 'disclaimer'">
          <p>The information on this website is for informational purposes only. It does not replace professional medical or psychiatric advice.</p>
          <p>Nangura Social Care provides structured counselling services within professional scope and ethical guidelines.</p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Simple logic to switch content based on URL path
const pageType = computed(() => {
  if (route.path.includes('privacy')) return 'privacy';
  if (route.path.includes('terms')) return 'terms';
  if (route.path.includes('cookie')) return 'cookies';
  return 'disclaimer';
});

const pageTitle = computed(() => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    cookies: 'Cookie Policy',
    disclaimer: 'Disclaimer'
  };
  return titles[pageType.value] || 'Legal';
});
</script>