<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-32 pb-20 px-6">
    <div class="max-w-4xl mx-auto">

      <div class="text-center mb-12">
        <span class="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
          <i class="fas fa-lock text-[8px]"></i> 256-bit Encrypted & Confidential
        </span>
        <h1 class="font-serif text-4xl md:text-5xl text-[var(--color-primary)] mb-4">Book a Session</h1>
        <p class="text-gray-500 font-light max-w-xl mx-auto">
          Secure your space for professional support. Sessions are available online across Namibia.
        </p>
      </div>

<!-- Authentication Prompt - Only show for non-organization bookings -->
<div v-if="!store.currentUser && currentStep > 1 && !isOrganizationBooking && currentStep !== 5" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
  <div class="flex items-center gap-3">
    <i class="fas fa-exclamation-triangle text-amber-600"></i>
    <p class="text-sm text-amber-800">Please sign in to continue with your booking</p>
  </div>
  <button @click="handleAuth" class="px-6 py-2 bg-amber-600 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors">
    Sign In
  </button>
</div>

<!-- Progress Steps - Hide on success page -->
<div v-if="currentStep !== 5" class="flex justify-between items-center mb-16 relative">
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
    <a href="https://wa.me/264812656253" rel="noopener" target="_blank" class="btn-ghost border border-gray-200">
      <i class="fab fa-whatsapp mr-2 text-green-600"></i>WhatsApp Us</a>
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

  <!-- Organization/Event Notice -->
  <div v-if="isOrganizationBooking" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
    <div class="flex items-start gap-3">
      <i class="fas fa-building text-blue-600 mt-1"></i>
      <div>
        <p class="text-sm font-bold text-blue-800 mb-1">Corporate/Event Booking</p>
        <p class="text-xs text-blue-600">You're booking for an organization or event. No sign-in required. We'll provide a quotation based on your requirements.</p>
      </div>
    </div>
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
        form.startDate === day.date && !day.isPast ? 'bg-[var(--color-secondary)] text-white' : '',
        day.isToday && !day.isPast && form.startDate !== day.date ? 'border border-[var(--color-primary)]' : ''
        ]">
        {{ day.day }}
      </button>
    </div>
  </div>

  <div class="space-y-6">
    <h3 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Available Slots</h3>

<div v-if="form.startDate" class="grid grid-cols-2 gap-3">
  <button v-for="slotObj in getAvailableSlotsForDate(form.startDate)" 
  :key="slotObj.time" 
  @click="slotObj.available ? form.time = slotObj.time : null"
  :disabled="!slotObj.available"
  class="py-4 rounded-2xl border text-sm font-bold transition-all relative"
  :class="[
  form.time === slotObj.time ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-gray-100 text-gray-600',
  !slotObj.available ? 'opacity-30 cursor-not-allowed bg-gray-50' : 'hover:border-gray-200'
  ]">
  {{ slotObj.time }}

  <span v-if="!slotObj.available" class="absolute top-1 right-2 text-[7px] uppercase font-black text-red-400">
    {{ slotObj.reason === 'booked' ? 'Taken' : 'Past' }}
  </span>
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
  {{ isOrganizationBooking ? 'Organization Details' : 'Patient Details' }}
</button>
</div>
</div>

<!-- Step 3: Patient/Organization Details -->
<div v-else-if="currentStep === 3" class="p-8 md:p-12">
  <div class="flex items-center gap-4 mb-8">
    <button @click="currentStep = 2" class="text-gray-400 hover:text-[var(--color-primary)]"><i class="fas fa-arrow-left"></i></button>
    <h2 class="font-serif text-2xl text-[var(--color-primary)]">{{ isOrganizationBooking ? 'Organization Details' : 'Confirm Your Identity' }}</h2>
  </div>

  <div v-if="validationErrors.step3" class="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
    {{ validationErrors.step3 }}
  </div>

  <!-- Organization/Event Fields -->
  <div v-if="isOrganizationBooking" class="grid md:grid-cols-2 gap-6">
    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Organization/Event Name *</label>
      <input v-model="form.organizationName" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm" placeholder="e.g., XYZ Corp, Annual Conference" required>
    </div>

    <div class="space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Contact Person Name *</label>
      <input v-model="form.contactPerson" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm" placeholder="Full name" required>
    </div>

    <div class="space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Phone Number *</label>
      <input v-model="form.phone" type="tel" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm" placeholder="+264..." required>
    </div>

    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Email Address *</label>
      <input v-model="form.email" type="email" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm" placeholder="contact@organization.com" required>
    </div>

    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Event Details / Requirements</label>
      <textarea v-model="form.eventDetails" rows="4" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm resize-none" placeholder="Please describe your event, expected number of participants, preferred format (online/in-person), and any specific requirements..."></textarea>
    </div>

    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Expected Duration</label>
      <select v-model="form.expectedDuration" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm">
        <option value="">Select expected duration</option>
        <option value="2">2 hours</option>
        <option value="4">Half day (4 hours)</option>
        <option value="8">Full day (8 hours)</option>
        <option value="custom">Custom (specify in details)</option>
      </select>
    </div>
  </div>

  <!-- Regular Patient Fields -->
  <div v-else class="grid md:grid-cols-2 gap-6">
    <div class="space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Full Name</label>
      <input :readonly="!!store.currentUser" v-model="form.fullName" type="text" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm disabled:opacity-70">
    </div>

    <div class="space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Phone Number</label>
      <input v-model="form.phone" type="tel" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm" placeholder="+264..." required>
    </div>

    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Email Address</label>
      <input :readonly="!!store.currentUser" v-model="form.email" type="email" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm">
    </div>

    <div class="md:col-span-2 space-y-2">
      <label class="text-[10px] uppercase font-bold tracking-widest text-gray-400 ml-2">Message for Practitioner (Optional)</label>
      <textarea v-model="form.message" rows="4" class="w-full px-6 py-4 rounded-2xl bg-[#FAFAF9] border-transparent focus:bg-white focus:border-[var(--color-secondary)] transition-all outline-none text-sm resize-none" placeholder="Briefly describe what you would like to discuss..."></textarea>
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
        <span v-else-if="form.service.type === 'in-person'" class="inline-block mt-2 text-[9px] font-bold text-green-500 uppercase tracking-widest bg-green-50 px-2 py-1 rounded">
          <i class="fas fa-building mr-1"></i> In-Person
        </span>
      </div>
      <div class="text-right">
        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Session Fee</p>
        <p class="text-lg font-serif text-[var(--color-secondary)]">{{ form.service.price }}</p>
        <p v-if="isOrganizationBooking" class="text-[8px] text-gray-400 mt-1">*Final price depends on requirements</p>
      </div>
    </div>

    <div class="flex items-center gap-8 py-6 border-y border-gray-200/50">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
          <i class="fas fa-calendar-alt text-xs"></i>
        </div>
        <span class="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{{ formatDate(form.startDate) }}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--color-primary)] shadow-sm">
          <i class="fas fa-clock text-xs"></i>
        </div>
        <span class="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">{{ form.time }}</span>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
        {{ isOrganizationBooking ? 'Organization Information' : 'Patient Information' }}
      </p>
      
      <!-- Organization Summary -->
      <template v-if="isOrganizationBooking">
        <p class="text-sm text-[var(--color-primary)] font-bold">{{ form.organizationName }}</p>
        <p class="text-sm text-[var(--color-primary)]">Contact: {{ form.contactPerson }}</p>
        <p class="text-sm text-[var(--color-primary)]">{{ form.phone }}</p>
        <p class="text-sm text-[var(--color-primary)]">{{ form.email }}</p>
        <p v-if="form.expectedDuration" class="text-sm text-[var(--color-primary)]">Duration: {{ form.expectedDuration }} hours</p>
        <p v-if="form.eventDetails" class="text-sm text-[var(--color-primary)] mt-2 italic">Details: {{ form.eventDetails }}</p>
      </template>
      
      <!-- Patient Summary -->
      <template v-else>
        <p class="text-sm text-[var(--color-primary)]">{{ form.fullName }}</p>
        <p class="text-sm text-[var(--color-primary)]">{{ form.phone }}</p>
        <p class="text-sm text-[var(--color-primary)]">{{ form.email }}</p>
        <p v-if="form.message" class="text-sm text-[var(--color-primary)] mt-2 italic">Message: {{ form.message }}</p>
      </template>
    </div>

    <div class="flex items-start gap-3 bg-white/50 p-4 rounded-2xl">
      <i class="fas fa-info-circle text-[var(--color-secondary)] mt-1"></i>
      <p class="text-[11px] text-gray-500 leading-relaxed italic">
        <span v-if="isOrganizationBooking">
          By clicking request quotation, you agree to receive a detailed quote via email within 24 hours. 
          Our team will contact you to discuss your requirements.
        </span>
        <span v-else>
          By clicking confirm, you agree to our 24-hour cancellation policy. A reminder will be sent to your email and WhatsApp.
        </span>
      </p>
    </div>
  </div>

  <button @click="confirmBooking" 
  :disabled="isSubmitting"
  class="w-full py-5 bg-[var(--color-primary)] text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
  <span v-if="!isSubmitting">
    {{ isOrganizationBooking ? 'Request Quotation' : 'Confirm & Book Session' }}
  </span>
  <span v-else class="flex items-center justify-center gap-2">
    <i class="fas fa-spinner fa-spin"></i> Processing...
  </span>
</button>
</div>

<!-- Step 5: Organization Success Page -->
<div v-else-if="currentStep === 5" class="p-8 md:p-12 text-center">
  <div class="max-w-2xl mx-auto">
    <!-- Success Animation -->
    <div class="mb-8 relative">
      <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
        <i class="fas fa-check text-4xl text-green-600"></i>
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-32 h-32 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>

    <h2 class="font-serif text-3xl text-[var(--color-primary)] mb-4">Quotation Request Sent!</h2>
    <p class="text-gray-500 mb-8">Thank you for your interest in our corporate/event services.</p>

    <!-- Next Steps Card -->
    <div class="bg-[#FAFAF9] rounded-3xl p-8 mb-8 text-left">
      <h3 class="font-bold text-[var(--color-primary)] mb-6 flex items-center gap-2">
        <i class="fas fa-clock text-[var(--color-secondary)]"></i>
        What happens next?
      </h3>
      
      <div class="space-y-6">
        <div class="flex gap-4">
          <div class="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-bold text-[var(--color-primary)]">1</span>
          </div>
          <div>
            <p class="font-bold text-sm text-[var(--color-primary)] mb-1">Check Your Email</p>
            <p class="text-xs text-gray-500">We've sent a confirmation to <span class="font-bold">{{ form.email }}</span> with your request details.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-bold text-[var(--color-primary)]">2</span>
          </div>
          <div>
            <p class="font-bold text-sm text-[var(--color-primary)] mb-1">Review & Quote</p>
            <p class="text-xs text-gray-500">Our team will review your requirements and prepare a detailed quotation within 24 hours.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="w-8 h-8 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-bold text-[var(--color-primary)]">3</span>
          </div>
          <div>
            <p class="font-bold text-sm text-[var(--color-primary)] mb-1">Discussion & Confirmation</p>
            <p class="text-xs text-gray-500">We'll contact you to discuss your specific needs and finalize the booking.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Request Summary -->
    <div class="bg-white border border-gray-100 rounded-3xl p-6 mb-8 text-left">
      <h3 class="font-bold text-sm text-[var(--color-primary)] mb-4 flex items-center gap-2">
        <i class="fas fa-receipt text-[var(--color-secondary)]"></i>
        Request Summary
      </h3>
      
      <div class="space-y-3 text-sm">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Organization/Event</span>
          <span class="font-bold text-[var(--color-primary)]">{{ form.organizationName }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Contact Person</span>
          <span class="font-bold text-[var(--color-primary)]">{{ form.contactPerson }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Date & Time</span>
          <span class="font-bold text-[var(--color-primary)]">{{ formatDate(form.startDate) }} at {{ form.time }}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-gray-400">Duration</span>
          <span class="font-bold text-[var(--color-primary)]">{{ form.expectedDuration || 'To be discussed' }} hours</span>
        </div>
        <div class="flex justify-between py-2">
          <span class="text-gray-400">Service</span>
          <span class="font-bold text-[var(--color-primary)]">{{ form.service?.title }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button @click="startNewBooking" 
      class="px-8 py-4 bg-[var(--color-primary)] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-primary)]/90 transition-all">
      <i class="fas fa-plus mr-2"></i>
      New Booking
    </button>
    
    <button @click="goToHomepage" 
    class="px-8 py-4 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[var(--color-primary)]/5 transition-all">
    <i class="fas fa-home mr-2"></i>
    Return Home
  </button>
</div>

<!-- WhatsApp Contact -->
<p class="mt-8 text-[10px] text-gray-400">
  Questions? <a href="https://wa.me/264812656253" rel="noopener" target="_blank" class="text-green-600 font-bold">Chat on WhatsApp</a>
</p>
</div>
</div>
</transition>

</div>
</div>

<!-- Auth Modal with Custom Login Fallback -->
<div v-if="showAuthModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
    <div class="text-center mb-6">
      <div class="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fa fa-shield-halved text-2xl text-[var(--color-primary)]"></i>
      </div>
      <h3 class="font-serif text-xl text-[var(--color-primary)] mb-2">Secure Sign In</h3>
      <p class="text-sm text-gray-500">Please sign in to finalize your booking.</p>
    </div>

    <!-- Google Sign-In Button (show if available) -->
    <button v-if="hasGoogleSignIn" @click="signInWithGoogle" 
    :disabled="store.loading"
    class="w-full py-4 border border-gray-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50">
    <template v-if="!store.loading">
      <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5">
      <span class="text-sm font-bold text-gray-700">Continue with Google</span>
    </template>
    <i v-else class="fa fa-spinner fa-spin text-[var(--color-primary)]"></i>
  </button>

  <!-- Divider -->
  <div v-if="hasGoogleSignIn" class="relative my-6">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-200"></div>
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-white px-4 text-gray-400">or</span>
    </div>
  </div>

  <!-- Custom Login Options -->
  <div class="space-y-3">
    <button @click="redirectToCustomLogin" 
    class="w-full py-4 bg-[var(--color-primary)] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--color-primary)]/80 transition-all active:scale-[0.98] text-sm font-bold">
    <i class="fas fa-envelope"></i>
    Continue with Email
  </button>

  <button @click="redirectToCustomRegister" 
  class="w-full py-4 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-2xl flex items-center justify-center gap-3 hover:bg-[var(--color-primary)]/5 transition-all active:scale-[0.98] text-sm font-bold">
  <i class="fas fa-user-plus"></i>
  Create Account
</button>
</div>

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
  /**
   * For events such as weddings, corporate functions, the user request quotation 
   * for price that depends on duration, and whether online or in-person
   * and this should not require a login instead, save the information under
   * company or event only ask for { company name, contact person name, email and cell-phone number}
   * 
   * */
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { z } from 'zod';
  import { useAppStore } from '@/stores/appStore';
  import { toast } from 'vue-sonner'; // Make sure to import toast if not already available

/**
* @typedef {Object} Service
* @property {number} id
* @property {string} title
* @property {string} duration
* @property {string} price
* @property {string} icon
* @property {string} type
*/

// --- Initialization ---
  const store = useAppStore();
  const router = useRouter();
  const route = useRoute();

// --- Validation Schemas ---
  const patientInfoSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address')
  });

  const organizationInfoSchema = z.object({
    organizationName: z.string().min(2, 'Organization/Event name must be at least 2 characters'),
    contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
    phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Please enter a valid phone number'),
    email: z.string().email('Please enter a valid email address')
  });

  const bookingSchema = z.object({
    service: z.object({
      id: z.number(),
      title: z.string(),
      type: z.string()
    }),
    startDate: z.string().min(1, 'Please select a date'),
    time: z.string().min(1, 'Please select a time')
  });

// --- State Management ---
  const currentStep = ref(1);
  const showAuthModal = ref(false);
  const isSubmitting = ref(false);
  const validationErrors = ref({});
  const fieldErrors = ref({});
  const allBookedSessions = ref([]);
  const hasGoogleSignIn = ref(true); // Set based on your actual Google Sign-In availability
  const lastBookingId = ref(null); // Store the last booking ID for reference

// Calendar Navigation State
  const currentDate = new Date();
  const selectedMonth = ref(currentDate.getMonth());
  const selectedYear = ref(currentDate.getFullYear());

  const currentMonth = computed(() => 
    new Date(selectedYear.value, selectedMonth.value).toLocaleString('default', { month: 'long' })
    );
  const currentYear = computed(() => selectedYear.value);

  const services = [
    { id: 1, title: 'Individual Counselling', duration: '60 mins', price: 'NAD 650', icon: 'fas fa-user-heart', type: 'online' },
    { id: 2, title: 'Online Therapy', duration: '60 mins', price: 'NAD 650', icon: 'fas fa-laptop-medical', type: 'online' },
    { id: 3, title: 'Couples Counselling', duration: '90 mins', price: 'NAD 950', icon: 'fas fa-user-friends', type: 'online' },
    { id: 4, title: 'Corporate / Events Counselling', duration: '60 mins+', price: 'Request Quotation', icon: 'fas fa-user-group', type: 'in-person' },
  ];

  const form = reactive({
    service: null,
    startDate: null,
    time: null,
    // Patient fields
    fullName: '',
    phone: '',
    email: '',
    message: '',
    // Organization fields
    organizationName: '',
    contactPerson: '',
    eventDetails: '',
    expectedDuration: ''
  });

// --- Computed Properties ---

  const isOrganizationBooking = computed(() => {
    return form.service?.id === 4; // Corporate/Events Counselling
  });

// --- Logic: Practitioner Availability ---

/**
* Defines the practitioner's working hours.
* Weekdays: 18:00 - 20:00 | Weekends: 09:00 - 12:00
* @param {string} dateString 
*/
  const getPractitionerHours = (dateString) => {
    if (!dateString) return [];
    const date = new Date(dateString);
const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...

const isWeekday = dayOfWeek >= 0 && dayOfWeek <= 4;
const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;

if (isWeekday) return ['18:00', '19:00', '20:00']; 
if (isWeekend) return ['09:00', '10:30', '12:00'];
return [];
};

// --- Computed Properties ---

/**
* Generates the grid for the calendar. 
* Includes padding for the first week and availability checks.
*/
const calendarDays = computed(() => {
  const days = [];
  const firstDay = new Date(selectedYear.value, selectedMonth.value, 1);
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

// Offset for the first day of the week (Monday = 0)
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; 
  for (let i = 0; i < startOffset; i++) {
    days.push({ day: '', date: null, isAvailable: false, isPast: false });
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(selectedYear.value, selectedMonth.value, d);
    const dateStr = dateObj.toISOString().split('T')[0];
    const isPast = dateObj < today;
    const isToday = dateObj.getTime() === today.getTime();
    const hoursDefined = getPractitionerHours(dateStr);

    days.push({
      day: d,
      date: dateStr,
      isAvailable: !isPast && hoursDefined.length > 0,
      isPast,
      isToday
    });
  }
  return days;
});

const canProceedToStep3 = computed(() => !!(form.startDate && form.time));

const canProceedToStep4 = computed(() => {
  if (isOrganizationBooking.value) {
    const result = organizationInfoSchema.safeParse({
      organizationName: form.organizationName,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email
    });
    return result.success;
  } else {
    const result = patientInfoSchema.safeParse({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email
    });
    return result.success;
  }
});

// --- API & Data Methods ---

/**
* Loads all confirmed/pending sessions once on mount to avoid repeated DB calls.
*/
const fetchAllFutureOccupiedSlots = async () => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    await store.sessionsActions.fetchByFilters({
      status: ['confirmed', 'pending'],
//startDate: 'todayStr' 
    });
    allBookedSessions.value = store.sessions.items || [];
  } catch (err) {
    console.error("Error pre-loading availability:", err);
  }
};

/**
* Logic to filter slots based on real-time current hour and existing bookings.
*/
const getAvailableSlotsForDate = (selectedDate) => {
  if (!selectedDate) return [];

  const today = new Date();
  const isToday = selectedDate === today.toISOString().split('T')[0];
  const currentHour = today.getHours();
  const currentMin = today.getMinutes();

  const baseSlots = getPractitionerHours(selectedDate);

// IMPORTANT: Ensure 's.startDate' matches the field name in your Firestore/Database
  const busyTimes = allBookedSessions.value
  .filter(s => s.startDate === selectedDate || s.date === selectedDate) 
  .map(s => s.time);

  return baseSlots.map(slot => {
    const [slotHour, slotMin] = slot.split(':').map(Number);
    const isTaken = busyTimes.includes(slot);

// Check if the time has already passed today
    const isPastTime = isToday && (slotHour < currentHour || (slotHour === currentHour && slotMin <= currentMin));

    return {
      time: slot,
      available: !isTaken && !isPastTime,
      reason: isTaken ? 'booked' : (isPastTime ? 'past' : 'available')
    };
  });
};
// --- Navigation & UI Methods ---

const selectService = (s) => { 
  form.service = s; 
  // Reset organization fields if not organization booking
  if (s.id !== 4) {
    form.organizationName = '';
    form.contactPerson = '';
    form.eventDetails = '';
    form.expectedDuration = '';
  }
};

const selectDate = (day) => {
  if (day.isAvailable) {
    form.startDate = day.date;
    form.time = null;
  }
};

const navigateToStep = (step) => {
  // Don't allow navigation from success page
  if (currentStep.value === 5) return;
  
  if (step < currentStep.value) { currentStep.value = step; return; }
  if (step === 2 && form.service) currentStep.value = 2;
  if (step === 3 && canProceedToStep3.value) currentStep.value = 3;
  if (step === 4 && canProceedToStep4.value) {
    // For organization bookings, no login required
    if (isOrganizationBooking.value) {
      currentStep.value = 4;
    } else if (store.currentUser) {
      currentStep.value = 4;
    } else {
      showAuthModal.value = true;
    }
  }
};

const goToStep = (step) => {
  // Don't allow navigation from success page
  if (currentStep.value === 5) return;
  
  validationErrors.value = {};
  fieldErrors.value = {};

  if (step === 3) {
    // For organization bookings, skip auth check
    if (isOrganizationBooking.value) {
      currentStep.value = 3;
    } else if (!store.currentUser) { 
      showAuthModal.value = true; 
      return; 
    } else {
      currentStep.value = 3;
    }
  } else if (step === 4) {
    if (isOrganizationBooking.value) {
      const result = organizationInfoSchema.safeParse(form);
      if (!result.success) {
        result.error.errors.forEach(err => { fieldErrors.value[err.path[0]] = err.message; });
        return;
      }
    } else {
      const result = patientInfoSchema.safeParse(form);
      if (!result.success) {
        result.error.errors.forEach(err => { fieldErrors.value[err.path[0]] = err.message; });
        return;
      }
    }
    currentStep.value = 4;
  } else {
    currentStep.value = step;
  }
};

const previousMonth = () => changeMonth(-1);
const nextMonth = () => changeMonth(1);

const changeMonth = (delta) => {
  selectedMonth.value += delta;
  if (selectedMonth.value > 11) {
    selectedMonth.value = 0;
    selectedYear.value++;
  } else if (selectedMonth.value < 0) {
    selectedMonth.value = 11;
    selectedYear.value--;
  }
};

const handleAuth = () => { showAuthModal.value = true; };

// Redirect to custom login with the current booking details
const redirectToCustomLogin = () => {
  // Save current form state to session storage
  sessionStorage.setItem('pendingBooking', JSON.stringify({
    ...form,
    currentStep: currentStep.value
  }));
  
  // Use the shared redirection logic format
  const destination = `/a?redirect=${encodeURIComponent(route.fullPath)}`;
  router.push(destination);
};

// Redirect to custom register
const redirectToCustomRegister = () => {
  // Save current form state to session storage
  sessionStorage.setItem('pendingBooking', JSON.stringify({
    ...form,
    currentStep: currentStep.value
  }));

  const destination = `/a/register?redirect=${encodeURIComponent(route.fullPath)}`;
  router.push(destination);
};

const signInWithGoogle = async () => {
  try {
    const result = await store.loginWithSocial('google');
    if (result.success) {
      showAuthModal.value = false;
      form.fullName = store.currentUser.displayName || form.fullName;
      form.email = store.currentUser.email || form.email;
      if (currentStep.value === 2) goToStep(3);
    }
  } catch (error) {
    console.error('Sign-in error:', error);
  }
};

const confirmBooking = async () => {
  try {
    // Validate based on booking type
    if (isOrganizationBooking.value) {
      organizationInfoSchema.parse(form);
    } else {
      patientInfoSchema.parse(form);
    }
    
    bookingSchema.parse(form);
    isSubmitting.value = true;

    const payload = {
      ...form,
      status: isOrganizationBooking.value ? 'quotation' : 'pending',
      bookingType: isOrganizationBooking.value ? 'organization' : 'individual',
      createdAt: new Date(),
      requiresMeet: form.service.type === 'online' 
    };

    // Remove unnecessary fields based on booking type
    if (isOrganizationBooking.value) {
      delete payload.fullName;
      delete payload.message;
    } else {
      delete payload.organizationName;
      delete payload.contactPerson;
      delete payload.eventDetails;
      delete payload.expectedDuration;
    }

    const sessId = await store.sessionsActions.add(payload);
    lastBookingId.value = sessId;
    
    if (isOrganizationBooking.value) {
      // Show success page for organization bookings
      currentStep.value = 5;
      
      // Optional: Show a brief toast in addition to the success page
      toast.success("Quotation Request Sent", { 
        description: "Check your email for confirmation details." 
      });
    } else {
      toast.success("Booking Confirmed", { 
        description: "Your session has been scheduled successfully." 
      });
      router.push('/my/bookings');
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      validationErrors.value.general = error.errors[0].message;
    }
    console.error('Booking error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// Success page navigation methods
const startNewBooking = () => {
  // Reset form
  form.service = null;
  form.startDate = null;
  form.time = null;
  form.fullName = '';
  form.phone = '';
  form.email = '';
  form.message = '';
  form.organizationName = '';
  form.contactPerson = '';
  form.eventDetails = '';
  form.expectedDuration = '';
  
  // Go back to step 1
  currentStep.value = 1;
};

const goToHomepage = () => {
  router.push('/');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });
};

const getStepClass = (step) => {
  // Don't show step classes on success page
  if (currentStep.value === 5) return 'bg-white border border-gray-200 text-gray-300';
  
  if (currentStep.value >= step) return 'bg-[var(--color-primary)] text-white shadow-lg';
  if (step === 2 && !form.service) return 'bg-white border border-gray-200 text-gray-300 opacity-50';
  if (step === 3 && !canProceedToStep3.value) return 'bg-white border border-gray-200 text-gray-300 opacity-50';
  return 'bg-white border border-gray-200 text-gray-300';
};

// --- Lifecycle ---
onMounted(async () => {
  await fetchAllFutureOccupiedSlots();

  // Check for pending booking from session storage
  const pendingBooking = sessionStorage.getItem('pendingBooking');
  if (pendingBooking) {
    try {
      const savedData = JSON.parse(pendingBooking);
      Object.assign(form, savedData);
      currentStep.value = savedData.currentStep || 1;
      sessionStorage.removeItem('pendingBooking');
    } catch (e) {
      console.error('Error restoring pending booking:', e);
    }
  }

  if (store.currentUser) {
    form.fullName = store.currentUser.displayName || '';
    form.email = store.currentUser.email || '';
    form.phone = store.currentUser.phone || ''; 
  }
  await store.sessionsActions.fetchInitialPage({startDate: '2025-02-25'})
});
</script>

<style scoped>
  .font-serif { font-family: 'Playfair Display', serif; }

  .fade-slide-enter-active, .fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-slide-enter-from { opacity: 0; transform: translateX(30px); }
  .fade-slide-leave-to { opacity: 0; transform: translateX(-30px); }

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  .animate-ping {
    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
</style>