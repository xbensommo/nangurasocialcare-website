WellnessPulse<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-serif text-3xl text-[var(--color-primary)] italic">Your Journey</h2>
        <p class="text-xs text-gray-400 mt-1">Reflecting on your progress over the last 6 sessions.</p>
      </div>
      <div class="text-right">
        <span class="text-2xl font-serif text-[var(--color-secondary)]">Phase 02</span>
        <p class="text-[9px] font-bold uppercase tracking-widest text-gray-300">Active Growth</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col items-center">
        <h3 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-8">Wellness Balance</h3>
        
        <div class="relative w-64 h-64 bg-[#FAFAF9] rounded-full flex items-center justify-center border border-dashed border-gray-200">
           <i class="fas fa-project-diagram text-[var(--color-secondary)] opacity-20 text-6xl"></i>
           <div class="absolute inset-0 flex items-center justify-center">
             <p class="text-[10px] text-gray-300 italic">Visualizing Growth Data...</p>
           </div>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-6 w-full">
          <div v-for="(val, label) in currentPulse" :key="label" class="text-center">
            <p class="text-[9px] uppercase font-bold text-gray-400">{{ label }}</p>
            <p class="text-lg font-serif text-[var(--color-primary)]">{{ val }}/10</p>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-[var(--color-primary)] rounded-[40px] p-8 text-white relative overflow-hidden">
          <h3 class="text-[10px] uppercase tracking-[0.4em] text-[var(--color-secondary)] font-bold mb-4">Current Focus</h3>
          <p class="font-light leading-relaxed italic opacity-90">
            "{{ lastHomework || 'Continue practicing the breathing exercises we discussed in our last session.' }}"
          </p>
          <i class="fas fa-feather-pointed absolute -right-2 -bottom-2 text-white/5 text-7xl"></i>
        </div>

        <div class="bg-white rounded-[40px] border border-gray-100 p-8">
          <h3 class="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-6">Recent Milestones</h3>
          <div class="space-y-6">
            <div v-for="milestone in milestones" :key="milestone.date" class="flex gap-4">
              <div class="w-10 h-10 rounded-full bg-gray-50 flex-shrink-0 flex items-center justify-center text-[var(--color-secondary)]">
                <i :class="milestone.icon"></i>
              </div>
              <div>
                <p class="text-xs font-bold text-[var(--color-primary)]">{{ milestone.title }}</p>
                <p class="text-[10px] text-gray-400">{{ milestone.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const currentPulse = {
  'Regulation': 7,
  'Awareness': 8,
  'Coping': 5,
  'Social': 6
};

const lastHomework = "Keep a 'boundary log' this week. Note down every time you felt a need to say no, regardless of whether you did or not.";

const milestones = [
  { title: 'Improved Awareness', date: 'Feb 10, 2026', icon: 'fas fa-eye' },
  { title: 'Intake Completed', date: 'Jan 15, 2026', icon: 'fas fa-flag-checkered' }
];
</script>