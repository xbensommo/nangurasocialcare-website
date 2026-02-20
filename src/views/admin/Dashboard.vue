<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';
import AOS from 'aos';

const store = useAppStore();

const stats = ref([
  { label: 'Total Revenue', value: '$124,500', icon: 'fa-wallet', color: 'text-blue-400' },
  { label: 'Active Sessions', value: '1,204', icon: 'fa-users', color: 'text-purple-400' },
  { label: 'System Health', value: '99.9%', icon: 'fa-microchip', color: 'text-green-400' },
]);

onMounted(() => {
  AOS.init({ duration: 800, once: true });
});
</script>

<template>
  <div class="p-8 space-y-10 bg-[var(--color-background)] min-h-screen text-[var(--color-text)]">
    <header data-aos="fade-down">
      <h1 class="text-4xl font-bold tracking-tight text-white uppercase font-space">Command <span class="text-[var(--color-primary)]">Center</span></h1>
      <p class="text-[var(--color-neutral)] mt-2">Real-time system oversight and analytics.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up">
      <div v-for="stat in stats" :key="stat.label" class="glass-panel p-6 rounded-2xl border border-white/5 bg-[#0B0C14]/50 backdrop-blur-xl transition-transform hover:scale-[1.02]">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-xs font-bold text-[var(--color-neutral)] uppercase tracking-widest">{{ stat.label }}</p>
            <h3 class="text-3xl font-bold mt-2 text-white font-space">{{ stat.value }}</h3>
          </div>
          <div :class="['p-3 rounded-xl bg-white/5', stat.color]">
            <i :class="['fas', stat.icon, 'text-xl']"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="glass-panel p-8 rounded-3xl border border-white/5" data-aos="fade-up" data-aos-delay="200">
      <h2 class="text-xl font-bold mb-6 flex items-center gap-3">
        <i class="fas fa-database text-[var(--color-primary)]"></i> 
        Active Data Modules
      </h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">users</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">sessions</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">notes</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">activityLogs</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">slots</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
        <div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--color-primary)]/10 transition-colors cursor-pointer group">
          <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)]">notifications</p>
          <p class="text-[10px] text-[var(--color-neutral)] uppercase mt-1">Status: Operational</p>
        </div>
        
      </div>
    </div>
  </div>
</template>