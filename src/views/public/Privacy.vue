<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-8 pb-20 px-4 md:px-6">
    <div class="max-w-4xl mx-auto space-y-8">

      <div class="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
        <h1 class="text-3xl font-serif text-[var(--color-primary)] italic mb-6">
          Privacy & Data Policy
        </h1>

        <p class="text-sm text-gray-600 mb-4">
          Nangura Social Care is committed to protecting your privacy. This policy outlines how we collect, use, and store your personal information.
        </p>

        <div class="space-y-4 text-gray-700 text-sm">
          <section>
            <h2 class="font-bold mb-1">1. Information Collection</h2>
            <p>We collect personal information such as name, email, phone number, and session history for providing counseling services.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">2. Use of Information</h2>
            <p>Collected data is used to manage sessions, provide personalized support, and communicate important updates.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">3. Data Sharing</h2>
            <p>We do not sell or share personal data with third parties, except as required by law or with your explicit consent.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">4. Data Security</h2>
            <p>We implement appropriate security measures to protect your data from unauthorized access or disclosure.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">5. Cookies & Tracking</h2>
            <p>Our website may use cookies to improve user experience. You can manage cookie preferences through your browser.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">6. Changes to Policy</h2>
            <p>We may update this Privacy Policy from time to time. Continued use of our platform constitutes acceptance of any updates.</p>
          </section>

          <section>
            <h2 class="font-bold mb-1">7. Contact Us</h2>
            <p>For questions about your data, email us at <a href="mailto:privacy@nangurasocialcare.org" class="text-[var(--color-primary)] underline">privacy@nangurasocialcare.org</a>.</p>
          </section>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'

useHead({
  title: 'Privacy & Data Policy | Nangura Social Care',
  meta: [
    { name: 'description', content: 'Learn how Nangura Social Care collects, uses, and protects your personal data while using our platform.' },
    { property: 'og:title', content: 'Privacy & Data Policy | Nangura Social Care' },
    { property: 'og:description', content: 'Learn how Nangura Social Care collects, uses, and protects your personal data while using our platform.' },
    { property: 'og:type', content: 'website' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.nangurasocialcare.org/privacy-policy' }
  ]
})
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
a { text-decoration: underline; }
</style>