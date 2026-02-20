<template>
  <div class="min-h-screen bg-[#FAFAF9] flex items-center justify-center py-20 px-6">
    <div class="w-full max-w-2xl bg-white rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden relative">
      
      <div class="absolute top-0 left-0 h-1.5 bg-[var(--color-secondary)] transition-all duration-700" 
           :style="{ width: `${(step / 4) * 100}%` }"></div>

      <div class="p-12 md:p-16">
        <div v-if="step === 1" class="step-container">
          <h2 class="font-serif text-4xl text-[var(--color-primary)] mb-4">How can we help?</h2>
          <p class="text-gray-500 mb-10">Select the type of care you are looking for.</p>
          <div class="grid gap-4">
            <button v-for="s in ['Individual', 'Couples', 'Child', 'Workplace']" :key="s"
              @click="formData.service = s; nextStep()"
              class="flex items-center justify-between p-6 rounded-3xl border border-gray-100 hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 transition-all text-left group">
              <span class="font-serif text-xl">{{ s }} Counselling</span>
              <i class="fas fa-chevron-right text-gray-300 group-hover:text-[var(--color-secondary)]"></i>
            </button>
          </div>
        </div>

        <div v-if="step === 2" class="step-container">
          <button @click="prevStep" class="text-sm text-gray-400 mb-8 hover:text-[var(--color-primary)]">
            <i class="fas fa-arrow-left mr-2"></i> Back
          </button>
          <h2 class="font-serif text-4xl text-[var(--color-primary)] mb-8">Preferred Setting</h2>
          <div class="flex gap-4 mb-10">
            <button @click="formData.mode = 'online'" :class="modeBtnClass('online')">Online</button>
            <button @click="formData.mode = 'tsumeb'" :class="modeBtnClass('tsumeb')">In-Person (Tsumeb)</button>
          </div>
          <input type="date" v-model="formData.date" class="w-full p-5 rounded-2xl bg-gray-50 border-none mb-8 focus:ring-2 ring-[var(--color-secondary)]/20" />
          <button @click="nextStep" :disabled="!formData.date" class="btn-primary w-full justify-center">Continue</button>
        </div>

        <div v-if="step === 3" class="step-container">
          <button @click="prevStep" class="text-sm text-gray-400 mb-8 hover:text-[var(--color-primary)]">
            <i class="fas fa-arrow-left mr-2"></i> Back
          </button>
          <h2 class="font-serif text-4xl text-[var(--color-primary)] mb-8">Your Information</h2>
          <div class="space-y-4">
            <input type="text" placeholder="Full Name" v-model="formData.name" class="input-field" />
            <input type="email" placeholder="Email Address" v-model="formData.email" class="input-field" />
            <input type="tel" placeholder="Phone / WhatsApp" v-model="formData.phone" class="input-field" />
            <textarea placeholder="Briefly describe what's on your mind (Optional)" v-model="formData.notes" class="input-field h-32"></textarea>
          </div>
          <button @click="nextStep" class="btn-primary w-full justify-center mt-8">Review Request</button>
        </div>

        <div v-if="step === 4" class="step-container text-center">
          <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-8">
            <i class="fas fa-check"></i>
          </div>
          <h2 class="font-serif text-4xl text-[var(--color-primary)] mb-4">Request Sent</h2>
          <p class="text-gray-500 mb-10 leading-relaxed">
            Bertha will review your request and reach out within 24 hours to confirm your appointment.
          </p>
          <div class="bg-gray-50 p-6 rounded-3xl text-left mb-10">
            <div class="flex justify-between text-sm mb-2"><span>Service:</span> <b>{{ formData.service }}</b></div>
            <div class="flex justify-between text-sm mb-2"><span>Mode:</span> <b>{{ formData.mode }}</b></div>
            <div class="flex justify-between text-sm"><span>Date:</span> <b>{{ formData.date }}</b></div>
          </div>
          <button @click="reset" class="btn-ghost">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { gsap } from 'gsap';

const step = ref(1);
const formData = reactive({
  service: '', mode: 'online', date: '', name: '', email: '', phone: '', notes: ''
});

const nextStep = () => {
  gsap.to(".step-container", { x: -20, opacity: 0, duration: 0.3, onComplete: () => {
    step.value++;
    gsap.fromTo(".step-container", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 });
  }});
};

const prevStep = () => {
  step.value--;
};

const modeBtnClass = (mode) => [
  'flex-1 py-4 rounded-2xl border transition-all font-medium',
  formData.mode === mode ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-gray-500 border-gray-100'
];

const reset = () => { step.value = 1; };
</script>

<style scoped>

</style>