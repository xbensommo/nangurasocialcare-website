<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-28 pb-20 px-4 md:px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <aside class="lg:col-span-3 space-y-6 hidden lg:block">
        <div class="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
          <div class="flex flex-col items-center text-center mb-8">
            <div class="w-20 h-20 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center text-2xl font-serif italic mb-4 shadow-inner">
              JH
            </div>
            <h3 class="font-serif text-xl text-[var(--color-primary)]">Johannes Haitembu</h3>
            <p class="text-[10px] text-[var(--color-secondary)] font-bold uppercase tracking-[0.2em] mt-1">Active Client</p>
          </div>
          
          <div class="space-y-4 pt-6 border-t border-gray-50">
            <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span class="text-gray-400">Total Sessions</span>
              <span class="text-[var(--color-primary)]">12</span>
            </div>
            <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
              <span class="text-gray-400">Next Session</span>
              <span class="text-[var(--color-secondary)]">In 3 Days</span>
            </div>
          </div>
        </div>

        <nav class="space-y-2">
          <button v-for="link in menuLinks" :key="link.label" 
            class="w-full flex items-center gap-4 p-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 transition-all border border-transparent hover:border-gray-100 hover:bg-white hover:text-[var(--color-primary)] group">
            <i :class="[link.icon, 'text-sm group-hover:scale-110 transition-transform']"></i>
            {{ link.label }}
          </button>
        </nav>
      </aside>

      <main class="lg:col-span-6 space-y-8">
        <div class="bg-white rounded-[32px] border border-gray-100 p-6 overflow-hidden relative group">
          <div class="flex items-center gap-3 mb-4">
            <i class="fas fa-sparkles text-[var(--color-secondary)] text-xs"></i>
            <h2 class="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold italic">Mindful Moment</h2>
          </div>
          <div class="p-6 bg-[var(--color-primary)] rounded-2xl text-white flex items-center justify-between relative overflow-hidden">
            <p class="text-sm md:text-base font-light leading-relaxed relative z-10">
              "Healing is not linear. Be patient with your progress today."
            </p>
            <i class="fas fa-leaf absolute -right-4 -bottom-4 text-white/10 text-6xl rotate-12"></i>
          </div>
        </div>

        <div v-for="service in availableServices" :key="service.id" 
             class="bg-white rounded-[40px] border border-gray-100 overflow-hidden group transition-all hover:shadow-xl hover:shadow-gray-200/50">
          
          <div class="p-6 flex justify-between items-center border-b border-gray-50">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-[var(--color-secondary)]"></span>
              <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{{ service.category }}</p>
            </div>
            <button class="text-gray-300 hover:text-[var(--color-primary)] transition-colors">
              <i class="fas fa-ellipsis-h"></i>
            </button>
          </div>

          <div class="relative aspect-[16/7] overflow-hidden">
             <img :src="service.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
             <div class="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/80 to-transparent"></div>
             <div class="absolute bottom-0 left-0 p-8">
               <h3 class="text-3xl font-serif text-white italic mb-2">{{ service.title }}</h3>
               <p class="text-white/70 text-sm font-light max-w-md">{{ service.shortDesc }}</p>
             </div>
          </div>

          <div class="p-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div class="text-center sm:text-left">
              <p class="text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Next Available Slot</p>
              <p class="text-lg font-serif text-[var(--color-primary)]">{{ service.availability }}</p>
            </div>
            <div class="flex gap-3 w-full sm:w-auto">
              <button class="flex-1 sm:flex-none px-8 py-4 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all">
                Learn More
              </button>
              <button class="flex-1 sm:flex-none px-8 py-4 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all">
                Book Session
              </button>
            </div>
          </div>
        </div>
      </main>

      <aside class="lg:col-span-3 space-y-8">
        <div class="bg-[var(--color-primary)] rounded-[32px] p-8 text-white relative overflow-hidden">
          <h3 class="text-[9px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-8 relative z-10">Recent Progress</h3>
          
          <div class="space-y-8 relative z-10">
            <div v-for="res in pastSessions" :key="res.date" class="relative pl-6 border-l border-white/10">
              <div class="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-[var(--color-secondary)]"></div>
              <p class="text-[8px] uppercase tracking-widest text-white/40 font-bold mb-1">{{ res.date }} • COMPLETED</p>
              <p class="text-sm font-serif italic leading-none mb-2">{{ res.type }}</p>
              <p class="text-[10px] text-white/60 leading-relaxed">{{ res.note }}</p>
            </div>
          </div>

          <button class="w-full mt-10 pt-6 border-t border-white/10 text-[9px] uppercase tracking-[0.3em] font-bold text-white/40 hover:text-white transition-colors">
            Download History (PDF)
          </button>
          
          <i class="fas fa-quote-right absolute -right-4 -bottom-4 text-white/5 text-8xl"></i>
        </div>

        <div class="p-8 rounded-[32px] border border-gray-100 bg-white">
          <h4 class="text-[9px] uppercase tracking-[0.3em] text-[var(--color-primary)] font-bold mb-4">Patient Privacy</h4>
          <div class="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <p class="text-[9px] text-green-700 uppercase font-bold tracking-tighter">End-to-End Encrypted</p>
          </div>
          <p class="text-[10px] text-gray-400 mt-4 leading-relaxed">Your data is stored under HIPAA-compliant protocols.</p>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
const menuLinks = [
  { label: 'Saved Resources', icon: 'fas fa-bookmark' },
  { label: 'Session History', icon: 'fas fa-calendar-check' },
  { label: 'Billing & Invoices', icon: 'fas fa-file-invoice-dollar' },
  { label: 'Account Security', icon: 'fas fa-user-shield' },
];

const availableServices = [
  { 
    id: 'SRV-01', 
    category: 'Mental Wellbeing', 
    title: 'Individual Therapy', 
    shortDesc: 'One-on-one sessions focusing on personal growth and healing.',
    availability: 'Tomorrow, 14:00', 
    image: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=1200' 
  },
  { 
    id: 'SRV-02', 
    category: 'Relationships', 
    title: 'Couples Counselling', 
    shortDesc: 'Rebuilding communication and trust in a safe environment.',
    availability: 'Wed, 21 Feb', 
    image: 'https://images.unsplash.com/photo-1516584566583-997b5a519fb2?auto=format&fit=crop&q=80&w=1200' 
  },
];

const pastSessions = [
  { date: 'Feb 10, 2026', type: 'Individual Intake', note: 'Initial assessment completed. Goal setting established.' },
  { date: 'Feb 03, 2026', type: 'Online Consultation', note: 'Exploration of anxiety triggers and coping mechanisms.' },
];
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
</style>