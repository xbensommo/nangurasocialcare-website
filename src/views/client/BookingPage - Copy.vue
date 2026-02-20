<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6">
    <div class="max-w-4xl mx-auto">
      
      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          <i class="fas fa-lock text-[8px]"></i> 256-bit Encrypted & Confidential
        </span>
        <h1 class="font-serif text-4xl md:text-5xl text-[var(--color-primary)] mb-4">Book a Session</h1>
        <p class="text-gray-500 font-light max-w-xl mx-auto">
          Secure your space for professional support. Sessions are available in-person in Tsumeb or online across Namibia.
        </p>
      </div>

      <!-- Authentication Prompt -->
      <div v-if="!store.currentUser && currentStep > 1" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <i class="fas fa-exclamation-triangle text-amber-600"></i>
          <p class="text-sm text-amber-800">Please sign in to continue with your booking</p>
        </div>
        <button @click="handleAuth" class="px-6 py-2 bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors">
          Sign In
        </button>
      </div>

      <div class="flex justify-between items-center mb-16 relative">
        <div class="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
        <div v-for="step in 4" :key="step" 
             class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 relative z-10 cursor-pointer"
             :class="getStepClass(step)"
             @click="navigateToStep(step)">
          {{ step }}
        </div>
      </div>

      <div class="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        
        <transition name="fade-slide" mode="out-in">
          <!-- Step 1: Service Selection -->
          <div v-if="currentStep === 1" class="p-8 md:p-12">
            <h2 class="font-serif text-2xl mb-8 text-[var(--color-primary)]">Select a Service</h2>
            <div class="grid gap-4">
              <button v-for="s in services" :key="s.id" 
                      @click="selectService(s)"
                      class="flex items-center justify-between p-6 rounded-3xl border transition-all text-left group"
                      :class="form.service?.id === s.id ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5' : 'border-gray-100 hover:border-gray-200'">
                <div class="flex items-center gap-5">
                  <div class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[var(--color-primary)] group-hover:bg-white transition-colors">
                    <i :class="s.icon"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-[var(--color-primary)] text-sm uppercase tracking-wider">{{ s.title }}</h3>
                    <p class="text-xs text-gray-400 mt-1">{{ s.duration }} • {{ s.price }}</p>
                  </div>
                </div>
                <i class="fas fa-chevron-right text-xs text-gray-300 group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
            
            <div class="mt-12 flex justify-between items-center pt-8 border-t border-gray-50">
              <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Questions? 
                <a href="#" class="text-[var(--color-secondary)] ml-2">WhatsApp Us</a>
              </p>
              <button @click="goToStep(2)" :disabled="!form.service" 
                      class="px-10 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-30 transition-all">
                Next Step
              </button>
            </div>
          </div>

          <!-- Step 2: Date & Time Selection -->
          <div v-else-if="currentStep === 2" class="p-8 md:p-12">
            <div class="flex items-center gap-4 mb-8">
              <button @click="currentStep = 1" class="text-gray-400 hover:text-[var(--color-primary)]"><i class="fas fa-arrow-left"></i></button>
              <h2 class="font-serif text-2xl text-[var(--color-primary)]">Choose Date & Time</h2>
            </div>

            <div v-if="validationErrors.step2" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {{ validationErrors.step2 }}
            </div>

            <div class="grid lg:grid-cols-2 gap-12">
              <div class="bg-[#FAFAF9] p-6 rounded-[32px]">
                <div class="flex justify-between items-center mb-6">
                  <span class="font-bold text-sm uppercase tracking-widest text-[var(--color-primary)]">{{ currentMonth }} {{ currentYear }}</span>
                  <div class="flex gap-2">
                    <button @click="previousMonth" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs"><i class="fas fa-chevron-left"></i></button>
                    <button @click="nextMonth" class="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs"><i class="fas fa-chevron-right"></i></button>
                  </div>
                </div>
                <div class="grid grid-cols-7 gap-2 text-center mb-4">
                  <span v-for="d in ['M', 'T', 'W', 'T', 'F', 'S', 'S']" :key="d" class="text-[9px] font-bold text-gray-300">{{ d }}</span>
                </div>
                <div class="grid grid-cols-7 gap-2">
                  <button v-for="day in calendarDays" :key="day.date" 
                          @click="selectDate(day)"
                          :disabled="!day.isAvailable"
                          class="aspect-square rounded-xl flex items-center justify-center text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          :class="[
                            day.isPast ? 'text-gray-300 bg-gray-50' : 'hover:bg-white text-gray-500',
                            form.date === day.date && !day.isPast ? 'bg-[var(--color-secondary)] text-white' : '',
                            day.isToday && !day.isPast && form.date !== day.date ? 'border border-[var(--color-primary)]' : ''
                          ]">
                    {{ day.day }}
                  </button>
                </div>
              </div>

              <div class="space-y-6">
                <h3 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Available Slots</h3>
                <div v-if="form.date" class="grid grid-cols-2 gap-3">
                  <button v-for="slot in getAvailableSlotsForDate(form.date)" :key="slot" 
                          @click="form.time = slot"
                          class="py-4 rounded-2xl border text-sm font-bold transition-all"
                          :class="form.time === slot ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-gray-100 hover:border-gray-200 text-gray-600'">
                    {{ slot }}
                  </button>
                </div>
                <div v-else class="text-center py-8 text-gray-400 text-sm">
                  Select a date to view available slots
                </div>
                <p class="text-[10px] text-gray-400 italic mt-4">
                  *All times are in Central Africa Time (CAT)
                </p>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t border-gray-50 flex justify-end">
              <button @click="goToStep(3)" :disabled="!canProceedToStep3" 
                      class="px-10 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-30">
                Patient Details
              </button>
            </div>
          </div>

          <!-- Step 3: Patient Details -->
          <div v-else-if="currentStep === 3" class="p-8 md:p-12">
            <div class="flex items-center gap-4 mb-8">
              <button @click="currentStep = 2" class="text-gray-400 hover:text-[var(--color-primary)]"><i class="fas fa-arrow-left"></i></button>
              <h2 class="font-serif text-2xl text-[var(--color-primary)]">Confirm Your Identity</h2>
            </div>

            <div v-if="validationErrors.step3" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {{ validationErrors.step3 }}
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Full Name</label>
                <input readonly v-model="form.fullName" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] focus:ring-0 transition-all outline-none text-sm" placeholder="e.g. sommo wakatoti">
                <p v-if="fieldErrors.fullName" class="text-[10px] text-red-500 ml-2">{{ fieldErrors.fullName }}</p>
              </div>
              <div class="space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Phone Number</label>
                <input v-model="form.phone" type="tel" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] focus:ring-0 transition-all outline-none text-sm" placeholder="+264...">
                <p v-if="fieldErrors.phone" class="text-[10px] text-red-500 ml-2">{{ fieldErrors.phone }}</p>
              </div>
              <div class="md:col-span-2 space-y-2">
                <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Email Address</label>
                <input readonly v-model="form.email" type="email" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] focus:ring-0 transition-all outline-none text-sm" placeholder="name@domain.com">
                <p v-if="fieldErrors.email" class="text-[10px] text-red-500 ml-2">{{ fieldErrors.email }}</p>
              </div>
            </div>

            <div class="mt-12 pt-8 border-t border-gray-50 flex justify-end">
              <button @click="goToStep(4)" :disabled="!canProceedToStep4" 
                      class="px-10 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold text-xs uppercase tracking-widest">
                Final Review
              </button>
            </div>
          </div>

          <!-- Step 4: Booking Summary -->
          <div v-else-if="currentStep === 4" class="p-8 md:p-12">
            <h2 class="font-serif text-2xl mb-8 text-[var(--color-primary)]">Booking Summary</h2>
            
            <div class="bg-[#FAFAF9] rounded-3xl p-8 mb-8 space-y-6">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Selected Service</p>
                  <p class="text-lg font-serif italic text-[var(--color-primary)]">{{ form.service.title }}</p>

                  <span v-if="form.service.type === 'online'" class="inline-block mt-2 text-[9px] font-bold text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">
                    <i class="fas fa-video mr-1"></i> Virtual Session
                  </span>
                </div>
                <div class="text-right">
                  <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Session Fee</p>
                  <p class="text-lg font-serif text-[var(--color-secondary)]">{{ form.service.price }}</p>
                </div>
              </div>

              <div class="flex items-center gap-8 py-6 border-y border-gray-200/50">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <i class="fas fa-calendar-alt text-xs"></i>
                  </div>
                  <span class="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{{ formatDate(form.date) }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <i class="fas fa-clock text-xs"></i>
                  </div>
                  <span class="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{{ form.time }}</span>
                </div>
              </div>

              <div class="space-y-2">
                <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Patient Information</p>
                <p class="text-sm text-[var(--color-primary)]">{{ form.fullName }}</p>
                <p class="text-sm text-[var(--color-primary)]">{{ form.phone }}</p>
                <p class="text-sm text-[var(--color-primary)]">{{ form.email }}</p>
              </div>

              <div class="flex items-start gap-3 bg-white/50 p-4 rounded-2xl">
                <i class="fas fa-info-circle text-[var(--color-secondary)] mt-1"></i>
                <p class="text-[11px] text-gray-500 leading-relaxed italic">
                  By clicking confirm, you agree to our 24-hour cancellation policy. A reminder will be sent to your email and WhatsApp.
                </p>
              </div>
            </div>

            <button @click="confirmBooking" 
                    :disabled="isSubmitting"
                    class="w-full py-5 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isSubmitting">Confirm & Book Session</span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="fas fa-spinner fa-spin"></i> Processing...
              </span>
            </button>
          </div>
        </transition>

      </div>
    </div>

    <!-- Google Sign-In Modal -->
    <div v-if="showAuthModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fa fa-shield-halved text-2xl text-[var(--color-primary)]"></i>
      </div>
      <h3 class="font-serif text-xl text-[var(--color-primary)] mb-2">Secure Sign In</h3>
      <p class="text-sm text-gray-500">Please sign in to finalize your booking.</p>
    </div>

    <button @click="signInWithGoogle" 
            :disabled="store.loading"
            class="w-full py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50">
      <template v-if="!store.loading">
        <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5">
        <span class="text-sm font-bold text-gray-700">Continue with Google</span>
      </template>
      <i v-else class="fa fa-spinner fa-spin text-[var(--color-primary)]"></i>
    </button>

    <p v-if="store.error" class="mt-4 text-[10px] text-red-500 text-center uppercase font-bold">
      {{ store.error }}
    </p>

    <button @click="showAuthModal = false" class="w-full mt-6 text-xs text-gray-400 hover:text-gray-600 uppercase tracking-widest font-bold">
      <i class="fa fa-xmark mr-1"></i> Cancel
    </button>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { z } from 'zod';

import { useAppStore } from '@/stores/appStore'

const store = useAppStore();

// Validation schemas
const bookingSchema = z.object({
  service: z.object({
    id: z.number(),
    title: z.string(),
    duration: z.string(),
    price: z.string(),
    icon: z.string()
  }),
  date: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
  }, 'Selected date cannot be in the past'),
  time: z.string(),
  fullName: z.string().min(2, 'fullName must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address')
});

const patientInfoSchema = z.object({
  fullName: z.string().min(2, 'fullName must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address')
});

const router = useRouter();
const route = useRoute();

// Mock store - replace with your actual auth store
// State
const currentStep = ref(1);
const showAuthModal = ref(false);
const isSubmitting = ref(false);
const validationErrors = ref({});
const fieldErrors = ref({});

// Calendar state
const currentDate = new Date();
const currentMonth = ref(currentDate.toLocaleString('default', { month: 'long' }));
const currentYear = ref(currentDate.getFullYear());
const selectedMonth = ref(currentDate.getMonth());
const selectedYear = ref(currentDate.getFullYear());

const services = [
  { id: 1, title: 'Individual Counselling', duration: '60 mins', price: 'NAD 650', icon: 'fas fa-user-heart', type: 'online' },
  { id: 2, title: 'Online Therapy', duration: '60 mins', price: 'NAD 650', icon: 'fas fa-laptop-medical', type: 'online' }, // New Type
  { id: 3, title: 'Couples Counselling', duration: '90 mins', price: 'NAD 950', icon: 'fas fa-user-friends', type: 'online' },
];

const slots = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];

const form = reactive({
  service: null,
  date: null,
  time: null,
  fullName: '',
  phone: '',
  email: ''
});

// Computed properties
const canProceedToStep3 = computed(() => {
  return form.date && form.time && !validationErrors.value.step2;
});

const canProceedToStep4 = computed(() => {
  try {
    patientInfoSchema.parse({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email
    });
    return true;
  } catch {
    return false;
  }
});

const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(selectedYear.value, selectedMonth.value, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0);
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ day: '', date: null, isAvailable: false, isPast: false });
  }
  
  // Add days of the month
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(selectedYear.value, selectedMonth.value, d);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    
    days.push({
      day: d,
      date: date.toISOString().split('T')[0],
      isAvailable: !isPast, // In real app, check against booked slots
      isPast,
      isToday
    });
  }
  
  return days;
});

// Methods
const getStepClass = (step) => {
  if (currentStep.value >= step) {
    return 'bg-[var(--color-primary)] text-white shadow-lg';
  }
  if (step === 2 && !form.service) {
    return 'bg-white border border-gray-200 text-gray-300 opacity-50';
  }
  if (step === 3 && (!form.service || !form.date || !form.time)) {
    return 'bg-white border border-gray-200 text-gray-300 opacity-50';
  }
  if (step === 4 && (!canProceedToStep4.value || !store.currentUser)) {
    return 'bg-white border border-gray-200 text-gray-300 opacity-50';
  }
  return 'bg-white border border-gray-200 text-gray-300';
};

const navigateToStep = (step) => {
  // Allow navigation to previous steps always
  if (step < currentStep.value) {
    currentStep.value = step;
    return;
  }
  
  // For forward navigation, check if step is accessible
  if (step === 2 && form.service) {
    currentStep.value = step;
  } else if (step === 3 && form.service && form.date && form.time) {
    currentStep.value = step;
  } else if (step === 4 && canProceedToStep4.value && store.currentUser) {
    currentStep.value = step;
  }
};

const selectService = (s) => {
  form.service = s;
};

const goToStep = (step) => {
  // Clear previous validation errors
  validationErrors.value = {};
  fieldErrors.value = {};

  if (step === 2) {
    if (!form.service) return;
    currentStep.value = 2;
  } else if (step === 3) {
    // Validate step 2
    try {
      z.object({
        date: z.string().refine((date) => {
          const selectedDate = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }, 'Selected date cannot be in the past'),
        time: z.string()
      }).parse({
        date: form.date,
        time: form.time
      });
      
      // Check if user is logged in
      if (!store.currentUser) {
        showAuthModal.value = true;
        return;
      }
      
      currentStep.value = 3;
    } catch (error) {
      if (error instanceof z.ZodError) {
        validationErrors.value.step2 = error.errors[0].message;
      }
    }
  } else if (step === 4) {
    // Validate patient info
    try {
      patientInfoSchema.parse({
        fullName: form.fullName,
        phone: form.phone,
        email: form.email
      });
      
      currentStep.value = 4;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = {};
        error.errors.forEach(err => {
          errors[err.path[0]] = err.message;
        });
        fieldErrors.value = errors;
        validationErrors.value.step3 = 'Please correct the errors below';
      }
    }
  }
};

const selectDate = (day) => {
  if (day.isAvailable) {
    form.date = day.date;
    form.time = null; // Reset time when date changes
  }
};

const previousMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }
  updateMonthDisplay();
};

const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }
  updateMonthDisplay();
};

const updateMonthDisplay = () => {
  const date = new Date(selectedYear.value, selectedMonth.value);
  currentMonth.value = date.toLocaleString('default', { month: 'long' });
  currentYear.value = date.getFullYear();
};

const getAvailableSlotsForDate = (date) => {
  // In a real app, you would fetch available slots from your backend
  // For now, return all slots if date is not in past
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return [];
  }
  
  // If it's today, filter out past times
  if (selectedDate.getTime() === today.getTime()) {
    const currentHour = new Date().getHours();
    return slots.filter(slot => {
      const slotHour = parseInt(slot.split(':')[0]);
      return slotHour > currentHour;
    });
  }
  
  return slots;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const handleAuth = () => {
  showAuthModal.value = true;
};

const signInWithGoogle = async () => {
  try {
    // 1. Call the social login action from your store
    const result = await store.loginWithSocial('google');
    
    if (result.success) {
      showAuthModal.value = false;
      
      // 2. Automatically map user profile data to the booking form
      const user = store.currentUser; // or result.data
      if (user) {
        form.fullName = user.displayName || form.fullName;
        form.email = user.email || form.email;
        // Phone is usually not provided by Google OAuth by default without extra scopes
      }

      // 3. If they were stuck on Step 2 because of auth, move them to Step 3
      if (currentStep.value === 2) {
        goToStep(3);
      }
    }
  } catch (error) {
    console.error('Sign-in error:', error);
    // The store's handleAuthError already sets store.error.value
  }
};

const confirmBooking = async () => {
  try {
    // Validate entire booking
    bookingSchema.parse(form);
    
    isSubmitting.value = true;

    // Construct final payload
    const payload = {
      ...form,
      status: 'pending',
      createdAt: new Date(),
      // This flag tells your Backend Function to generate a Meet link
      requiresMeet: form.service.type === 'online' 
    };
    
    // add the session to firestore session collection 
   const sessId = await store.sessionsActions.add(payload)
    
    
    
    // Redirect based on user role
    //const destination = route.query.redirect || (store.currentUser?.role === 'admin' ? '/pra' : '/my');
    
    // 2. Resolve the destination
  // If a redirect exists, use it; otherwise, go to the success page with the ID
  const destination = route.query.redirect || '/booking/success';

  if (route.query.redirect) {
      // If redirecting back to a specific page, append ID as a query
      router.push({ path: route.query.redirect, query: { id: sessId } });
  } else {
      // Navigate to the named route with the ID param
      let _RouteName = store.currentUser  ? 'PublicBookingSuccess' : 'PuBookingSuccess'
      router.push({ 
          name: _RouteName, 
          params: { id: sessId } 
      });
  }
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      validationErrors.value.general = error.errors[0].message;
    }
    console.error('Booking validation failed:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Check for redirect on mount
onMounted(() => {
  // Check if there's a saved booking state in sessionStorage
  const savedBooking = sessionStorage.getItem('bookingDraft');
  if (savedBooking) {
    try {
      const parsed = JSON.parse(savedBooking);
      Object.assign(form, parsed);
    } catch (e) {
      console.error('Failed to restore booking draft');
    }
  }
});

// Save form state to sessionStorage on changes
// You could add watchers here to auto-save
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateX(30px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-30px); }
</style>