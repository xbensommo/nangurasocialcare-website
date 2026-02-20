<template>
  <div class="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden max-w-2xl mx-auto">
    <div class="p-8 bg-[var(--color-primary)] text-white">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-[10px] uppercase tracking-widest opacity-60 mb-1">Post-Session Analysis</p>
          <h2 class="font-serif text-2xl italic">Johannes Haitembu</h2>
        </div>
        <div class="text-right">
          <p class="text-xs font-bold">{{ currentDateTime }}</p>
        </div>
      </div>
    </div>

    <div class="p-8 space-y-8">
      <section class="space-y-6">
        <h3 class="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Growth Metrics</h3>
        <div v-for="(val, metric) in metrics" :key="metric" class="space-y-2">
          <div class="flex justify-between text-xs font-bold text-[var(--color-primary)] capitalize">
            <span>{{ metric }}</span>
            <span class="text-[var(--color-secondary)]">{{ val }}/10</span>
          </div>
          <input type="range" v-model="metrics[metric]" min="1" max="10" 
          class="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-secondary)]">
        </div>
      </section>

      <section class="space-y-4 bg-[#FAFAF9] p-6 rounded-[24px] border border-gray-100">
        <h3 class="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Clinical Focus</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(val, key) in metrics" :key="key">
            <label class="text-[9px] font-bold text-[var(--color-primary)] uppercase mb-1 block">{{ key }}</label>
            <select v-model="metrics[key]" class="w-full bg-white border-none rounded-xl text-xs p-3 shadow-sm">
              <option v-for="n in 10" :key="n" :value="n">{{ n }} - {{ n }}</option>
            </select>
          </div>
        </div>
      </section>

      <section class="space-y-4">
        <h3 class="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Primary Themes</h3>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in commonThemes" :key="tag"
          @click="toggleTag(tag)"
          class="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all"
          :class="selectedTags.includes(tag) ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:border-gray-200'">
          {{ tag }}
        </button>
      </div>
    </section>

    <section class="space-y-2">
      <label class="text-[10px] uppercase font-bold text-gray-400 ml-2 italic">Client Homework / Focus</label>
      <textarea v-model="homework" rows="2" 
      class="w-full p-4 bg-[#FAFAF9] border-none rounded-2xl text-sm focus:ring-1 ring-[var(--color-secondary)] outline-none"
      placeholder="e.g. Practice 4-7-8 breathing when anxiety spikes..."></textarea>
    </section>

    <section class="space-y-2">
      <label class="text-[10px] uppercase font-bold text-gray-400 ml-2">Private Clinical Observations (Encrypted)</label>
      <textarea v-model="privateNotes" rows="3" 
      class="w-full p-4 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-xs italic opacity-70 focus:opacity-100 outline-none transition-opacity"
      placeholder="Sensitive clinical observations for internal use only..."></textarea>
    </section>

    <button @click="saveSessionLog" 
    class="w-full py-5 bg-[var(--color-primary)] text-white rounded-full font-bold text-xs uppercase tracking-[0.3em] shadow-xl shadow-[var(--color-primary)]/20 hover:-translate-y-1 transition-all">
    Finalize & Sync Journey
  </button>
</div>
</div>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';

  const metrics = reactive({
    regulation: 5,
    awareness: 6,
    coping: 4
  });

  const commonThemes = ['Anxiety', 'Grief', 'Family', 'Trauma', 'Boundaries', 'Career', 'Identity'];
  const selectedTags = ref([]);
  const homework = ref('');
  const privateNotes = ref('');

  const toggleTag = (tag) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter(t => t !== tag);
    } else {
      selectedTags.value.push(tag);
    }
  };

  const currentDateTime = computed(() => {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  });

  const saveSessionLog = () => {
// Logic: Send data to 'session_notes' collection
// Logic: Calculate average to update client's 'Wellness Pulse'
    console.log("Saving metrics...", { ...metrics, tags: selectedTags.value, homework: homework.value });
    alert("Journey synced successfully.");
  };
</script>