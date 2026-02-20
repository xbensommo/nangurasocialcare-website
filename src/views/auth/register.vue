<template>
  <div class="glass-panel p-6 lg:p-8 animate-reveal">
    <header class="mb-10 text-center lg:text-left">
      <h3 class="text-3xl font-display font-bold uppercase tracking-tighter italic text-primary">New Client</h3>
      <p class="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-2">Create your account</p>
    </header>

    <!-- Progress Steps -->
    <div v-if="currentStep <= totalSteps" class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <div v-for="step in totalSteps" :key="step" class="flex-1 text-center">
          <div class="relative">
            <div class="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all"
              :class="[
                step < currentStep ? 'bg-primary text-white' : 
                step === currentStep ? 'bg-secondary text-white' : 
                'bg-gray-200 text-gray-400'
              ]">
              {{ step }}
            </div>
            <p class="text-[8px] uppercase tracking-wider mt-1 text-text-muted">{{ getStepLabel(step) }}</p>
          </div>
        </div>
      </div>
      <div class="relative h-1 bg-gray-200 rounded-full">
        <div class="absolute h-1 bg-primary rounded-full transition-all duration-300" 
             :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
      </div>
    </div>

    <!-- Social Signup - Only show on step 1 -->
    <div v-if="currentStep === 1" class="mb-8">
      <button 
        @click="handleSocialSignup('google')" 
        :disabled="isLoading"
        type="button" 
        class="btn-outline w-full flex items-center justify-center gap-3 border border-border hover:bg-white/5 transition-all py-3"
      >
        <i class="fa-brands fa-google text-primary"></i>
        <span class="text-[10px] uppercase tracking-widest font-bold">Continue with Google</span>
      </button>

      <div class="relative my-8 text-center">
        <hr class="border-border" />
        <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f1115] px-4 text-[9px] text-text-muted uppercase tracking-widest font-bold">
          OR
        </span>
      </div>
    </div>

    <form @submit.prevent="handleNext" class="space-y-5">
      <!-- Step 1: Personal Information -->
      <div v-if="currentStep === 1">
        <h4 class="text-sm font-bold text-primary mb-4">Personal Information</h4>
        <div v-for="field in step1Fields" :key="field.id" class="mb-4">
          <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block">
            {{ field.label }}
          </label>
          <input 
            v-model="form[field.id]"
            :type="field.type"
            class="glass-input input-field"
            :placeholder="field.placeholder"
            :readonly="field.id === 'location' && detectingLocation"
          />
          <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold">{{ errors[field.id] }}</p>
        </div>

        <!-- Location Detection Button -->
        <button type="button" @click="detectLocation" class="text-[9px] text-secondary mb-4" :disabled="detectingLocation">
          <i class="fas fa-location-dot mr-1"></i> {{ detectingLocation ? 'Detecting...' : 'Auto-detect location' }}
        </button>
      </div>

      <!-- Step 2: Clinical Information -->
      <div v-if="currentStep === 2">
        <h4 class="text-sm font-bold text-primary mb-4">Clinical Information</h4>
        <div v-for="field in step2Fields" :key="field.id" class="mb-4">
          <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block">
            {{ field.label }}
          </label>
          <input 
            v-if="field.type !== 'checkbox'"
            v-model="form[field.id]"
            :type="field.type"
            class="glass-input input-field"
            :placeholder="field.placeholder"
          />
          <div v-else class="flex items-center gap-3">
            <input type="checkbox" v-model="form[field.id]" class="w-4 h-4 accent-primary">
            <span class="text-[10px] text-text-muted">{{ field.label }}</span>
          </div>
          <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold">{{ errors[field.id] }}</p>
        </div>
      </div>

      <!-- Step 3: Emergency Contact -->
      <div v-if="currentStep === 3">
        <h4 class="text-sm font-bold text-primary mb-4">Emergency Contact</h4>
        <div v-for="field in step3Fields" :key="field.id" class="mb-4">
          <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block">
            {{ field.label }}
          </label>
          <input 
            v-model="form[field.id]"
            :type="field.type"
            class="glass-input input-field"
            :placeholder="field.placeholder"
          />
          <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold">{{ errors[field.id] }}</p>
        </div>
      </div>

      <!-- Step 4: Security & Consent -->
      <div v-if="currentStep === 4">
        <h4 class="text-sm font-bold text-primary mb-4">Security & Consent</h4>
        
        <!-- Password Fields -->
        <div v-for="field in step4Fields" :key="field.id" class="mb-4">
          <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block">
            {{ field.label }}
          </label>
          <input 
            v-model="form[field.id]"
            :type="field.type"
            class="glass-input input-field"
            :placeholder="field.placeholder"
          />
          <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold">{{ errors[field.id] }}</p>
        </div>

        <!-- Consent Checkboxes with Modal Links -->
        <div class="space-y-3 pt-4">
          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.consentToTreatment" class="mt-1 w-4 h-4 accent-primary">
            <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              I consent to receive online counselling services.
              <button type="button" @click="openModal('treatment')" class="text-secondary underline ml-1">View Terms</button>
            </span>
          </label>
          <p v-if="errors.consentToTreatment" class="text-danger text-[9px] mt-1 font-bold">{{ errors.consentToTreatment }}</p>

          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.confidentialityAgreement" class="mt-1 w-4 h-4 accent-primary">
            <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              I understand confidentiality limits.
              <button type="button" @click="openModal('confidentiality')" class="text-secondary underline ml-1">Read More</button>
            </span>
          </label>
          <p v-if="errors.confidentialityAgreement" class="text-danger text-[9px] mt-1 font-bold">{{ errors.confidentialityAgreement }}</p>

          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.riskAcknowledgement" class="mt-1 w-4 h-4 accent-primary">
            <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              I understand this platform is not for emergencies.
              <button type="button" @click="openModal('emergency')" class="text-secondary underline ml-1">Learn More</button>
            </span>
          </label>
          <p v-if="errors.riskAcknowledgement" class="text-danger text-[9px] mt-1 font-bold">{{ errors.riskAcknowledgement }}</p>

          <label class="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" v-model="form.terms" class="mt-1 w-4 h-4 accent-primary">
            <span class="text-[10px] uppercase tracking-[0.2em] text-text-muted">
              I accept the terms and conditions.
              <button type="button" @click="openModal('terms')" class="text-secondary underline ml-1">View Terms</button>
            </span>
          </label>
          <p v-if="errors.terms" class="text-danger text-[9px] mt-1 font-bold">{{ errors.terms }}</p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex gap-3 pt-4">
        <button 
          v-if="currentStep > 1" 
          type="button" 
          @click="previousStep"
          class="flex-1 py-3 border border-border text-text-muted rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-white/5 transition-all"
        >
          Back
        </button>
        <button 
          type="submit" 
          :disabled="isLoading"
          class="flex-1 py-3 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-secondary transition-all disabled:opacity-50"
        >
          <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> Processing...</span>
          <span v-else>{{ currentStep === totalSteps ? 'Complete Registration' : 'Continue' }}</span>
        </button>
      </div>
    </form>

    <!-- Terms and Conditions Modals -->
    <div v-if="showModal" 
     class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end items-center justify-center z-[100]" 
     @click.self="closeModal">
  
  <div class="bg-[#0f1115] w-full h-full md:h-auto md:max-h-[85vh] md:rounded-3xl flex flex-col border-t md:border border-border animate-slide-up md:animate-reveal">
    
    <div class="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-[#0f1115] z-10">
      <div>
        <h3 class="font-bold text-primary uppercase tracking-tighter">{{ modalTitle }}</h3>
        <p class="text-[8px] text-text-muted uppercase tracking-[0.2em] mt-1">Nangura Registry Agreement</p>
      </div>
      <button @click="closeModal" class="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-text-muted hover:text-white transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div class="p-6 overflow-y-auto flex-1 text-sm text-text-muted space-y-6 leading-relaxed">
      
      <div v-if="modalType === 'treatment'">
        <h4 class="font-bold text-primary mb-3">Consent to Treatment</h4>
        <p>By checking this box, you acknowledge and agree to the following:</p>
        <ul class="list-disc pl-5 mt-4 space-y-3">
          <li>You are voluntarily seeking online counselling services through our platform.</li>
          <li>You understand that online counselling has both benefits and limitations compared to in-person therapy.</li>
          <li>You agree to participate actively in the therapeutic process.</li>
          <li>You understand that results cannot be guaranteed.</li>
          <li>You consent to the practitioner keeping records of sessions as required by professional standards.</li>
        </ul>
      </div>

      <div v-if="modalType === 'confidentiality'">
        <h4 class="font-bold text-primary mb-3">Confidentiality Agreement</h4>
        <p>Confidentiality is a cornerstone of therapeutic services. However, there are legal limits:</p>
        <div class="bg-white/5 p-4 rounded-2xl mt-4 border border-white/5">
            <span class="font-bold text-secondary text-xs uppercase block mb-2">Legal Exceptions:</span>
            <ul class="space-y-2 text-xs">
              <li class="flex gap-2"><span>•</span> Imminent risk of harm to yourself or others</li>
              <li class="flex gap-2"><span>•</span> Suspected abuse of a child or vulnerable adult</li>
              <li class="flex gap-2"><span>•</span> Court orders requiring disclosure</li>
            </ul>
        </div>
        <p class="mt-4">Our platform uses 256-bit encryption to protect your data during transit and at rest.</p>
      </div>

      <div v-if="modalType === 'emergency'">
        <div class="bg-danger/10 border border-danger/20 p-4 rounded-2xl mb-4 text-center">
            <h4 class="font-bold text-danger text-lg uppercase tracking-tighter">Emergency Protocol</h4>
            <p class="text-xs font-bold text-danger/80">NOT FOR CRISIS INTERVENTION</p>
        </div>
        <p>If you are experiencing a mental health emergency, please use these immediate contacts:</p>
        <div class="grid grid-cols-1 gap-3 mt-4">
            <div class="p-3 bg-white/5 rounded-xl border border-border">
                <p class="text-[9px] uppercase font-bold text-text-muted">Namibia Emergency</p>
                <p class="text-secondary font-bold text-lg">112 or 10111</p>
            </div>
            <div class="p-3 bg-white/5 rounded-xl border border-border">
                <p class="text-[9px] uppercase font-bold text-text-muted">Lifeline Crisis Line</p>
                <p class="text-secondary font-bold text-lg">061 232 221</p>
            </div>
        </div>
      </div>

      <div v-if="modalType === 'terms'" class="space-y-6">
        <section>
          <h5 class="font-bold text-secondary text-xs uppercase tracking-widest mb-2">1. Services</h5>
          <p>We provide online counselling via secure video conferencing by licensed practitioners.</p>
        </section>
        <section>
          <h5 class="font-bold text-secondary text-xs uppercase tracking-widest mb-2">2. Fees</h5>
          <p>Sessions are billed at the displayed rate. Payment is required upfront via card or mobile money.</p>
        </section>
        <section>
          <h5 class="font-bold text-secondary text-xs uppercase tracking-widest mb-2">3. Cancellation</h5>
          <p>24-hour notice is required. Late cancellations incur the full session fee.</p>
        </section>
      </div>
    </div>

    <div class="p-6 border-t border-border bg-[#0f1115] sticky bottom-0">
      <button @click="closeModal" class="w-full py-4 bg-primary text-white rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
        Accept and Close
      </button>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useAppStore } from '@/stores/appStore';
  import { useRouter, useRoute } from 'vue-router';
  import { toast } from 'vue-sonner';
  import { z } from 'zod';

  const store = useAppStore();
  const router = useRouter(); 
  const route = useRoute();
  
  // State Management
  const currentStep = ref(1);
  const totalSteps = 4;
  const isLoading = ref(false);
  const detectingLocation = ref(false);
  const errors = ref({});
  
  // Modal State
  const showModal = ref(false);
  const modalType = ref('');
  const modalTitle = computed(() => {
    const titles = {
      treatment: 'Consent to Treatment',
      confidentiality: 'Confidentiality Agreement',
      emergency: 'Emergency Protocol',
      terms: 'Terms and Conditions'
    };
    return titles[modalType.value] || 'Terms and Conditions';
  });

  // Form Fields by Step
  const step1Fields = [
    { id: 'fullName', label: 'Full Legal Name', type: 'text', placeholder: 'John Doe' },
    { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', placeholder: '' },
    { id: 'gender', label: 'Gender', type: 'text', placeholder: 'Male / Female / Other' },
    { id: 'email', label: 'Electronic Mail', type: 'email', placeholder: 'john@example.com' },
    { id: 'phone', label: 'Cell phone', type: 'tel', placeholder: '081 123 4568' },
    { id: 'location', label: 'Location', type: 'text', placeholder: 'City, Country' },
  ];

  const step2Fields = [
    { id: 'primaryConcern', label: 'Primary Concern', type: 'text', placeholder: 'Anxiety, stress, trauma etc.' },
    { id: 'previousTherapy', label: 'Have you had therapy before?', type: 'checkbox' },
    { id: 'currentMedication', label: 'Are you currently on any medication?', type: 'checkbox' },
  ];

  const step3Fields = [
    { id: 'emergencyContactName', label: 'Emergency Contact Name', type: 'text', placeholder: 'Jane Doe' },
    { id: 'emergencyContactPhone', label: 'Emergency Contact Phone', type: 'tel', placeholder: '081 000 0000' },
  ];

  const step4Fields = [
    { id: 'password', label: 'Create Password', type: 'password', placeholder: '••••••••' },
    { id: 'Confirmpassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ];

  // Form Data
  const form = reactive({ 
    // Step 1
    fullName: '', 
    dateOfBirth: '',
    gender: '',
    email: '', 
    phone: '',
    location: '',
    
    // Step 2
    primaryConcern: '',
    previousTherapy: false,
    currentMedication: false,
    
    // Step 3
    emergencyContactName: '',
    emergencyContactPhone: '',
    
    // Step 4
    password: '', 
    Confirmpassword: '',
    
    // Consent Checkboxes
    consentToTreatment: false,
    confidentialityAgreement: false,
    riskAcknowledgement: false,
    terms: false 
  });

  // Validation Schemas by Step
  const step1Schema = z.object({
    fullName: z.string().min(3, "Full name required"),
    dateOfBirth: z.string().min(1, "Date of birth required"),
    gender: z.string().min(1, "Gender required"),
    email: z.string().email("Valid email required"),
    phone: z.string().min(8, "Valid phone number required"),
    location: z.string().min(3, "Location is required"),
  });

  const step2Schema = z.object({
    primaryConcern: z.string().min(3, "Please state your primary concern"),
  });

  const step3Schema = z.object({
    emergencyContactName: z.string().min(3, "Emergency contact required"),
    emergencyContactPhone: z.string().min(8, "Valid emergency contact required"),
  });

  const step4Schema = z.object({
    password: z.string().min(8, "Password must be 8+ characters"),
    Confirmpassword: z.string(),
    consentToTreatment: z.literal(true, { errorMap: () => ({ message: "Treatment consent required" }) }),
    confidentialityAgreement: z.literal(true, { errorMap: () => ({ message: "Confidentiality agreement required" }) }),
    riskAcknowledgement: z.literal(true, { errorMap: () => ({ message: "Emergency clause must be acknowledged" }) }),
    terms: z.literal(true, { errorMap: () => ({ message: "Terms must be accepted" }) })
  }).refine((data) => data.password === data.Confirmpassword, {
    message: "Passwords do not match",
    path: ["Confirmpassword"], 
  });

  // Helper Functions
  const getStepLabel = (step) => {
    const labels = ['Personal', 'Clinical', 'Emergency', 'Security'];
    return labels[step - 1];
  };

  const openModal = (type) => {
    modalType.value = type;
    showModal.value = true;
  };

  const closeModal = () => {
    showModal.value = false;
    modalType.value = '';
  };

  // Auto-Location Detection
  const detectLocation = async () => {
    detectingLocation.value = true;
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.city && data.country_name) {
        form.location = `${data.city}, ${data.country_name}`;
      }
    } catch (err) {
      form.location = "Windhoek, Namibia";
    } finally {
      detectingLocation.value = false;
    }
  };

  // Navigation
  const handleNext = async () => {
    errors.value = {};
    
    // Validate current step
    let validation;
    switch(currentStep.value) {
      case 1:
        validation = step1Schema.safeParse(form);
        break;
      case 2:
        validation = step2Schema.safeParse(form);
        break;
      case 3:
        validation = step3Schema.safeParse(form);
        break;
      case 4:
        validation = step4Schema.safeParse(form);
        break;
    }

    if (!validation.success) {
      validation.error.issues.forEach(i => errors.value[i.path[0]] = i.message);
      return;
    }

    if (currentStep.value < totalSteps) {
      currentStep.value++;
    } else {
      await handleRegister();
    }
  };

  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
      errors.value = {};
    }
  };

  // Social Signup
  const handleSocialSignup = async (provider) => {
    try {
      isLoading.value = true;
      await store.loginWithSocial(provider);
      toast.success("Identity Verified", { description: "Authenticated successfully via social provider." });
      router.push('/my');
    } catch (err) {
      toast.error("Authentication Failed", { description: err.message });
    } finally {
      isLoading.value = false;
    }
  };

  // Registration
  const finalizeRedirect = () => {
    const destination = route.query.redirect || '/my';
    router.push(destination);
  };

  const handleRegister = async () => {
    try {
      isLoading.value = true;
      
      await store.signUp(form.email, form.password, { 
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        phone: form.phone,
        location: form.location,

        emergencyContact: {
          name: form.emergencyContactName,
          phone: form.emergencyContactPhone
        },

        clinical: {
          primaryConcern: form.primaryConcern,
          previousTherapy: form.previousTherapy,
          currentMedication: form.currentMedication
        },

        legal: {
          consentToTreatment: true,
          confidentialityAgreement: true,
          riskAcknowledgement: true,
          termsAccepted: true
        },

        role: 'user',
        accountStatus: 'active',
        createdAt: new Date()
      });
      
      toast.success("Registry Entry Created", { description: "Verify your email to begin." });
      finalizeRedirect();
    } catch (err) {
      toast.error("Registration Failed", { description: err.message });
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(() => {
    detectLocation();
  });
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>