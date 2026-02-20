<template>
  <div class="space-y-6">
    <div class="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 bg-[var(--color-secondary)]/10 rounded-2xl flex items-center justify-center text-[var(--color-secondary)]">
          <i class="fas fa-pen-fancy"></i>
        </div>
        <div>
          <h2 class="font-serif text-2xl text-[var(--color-primary)] italic">Reflections</h2>
          <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Safe Space for Your Thoughts</p>
        </div>
      </div>

      <div class="space-y-4">
        <textarea 
          v-model="newEntry.content"
          rows="4"
          class="w-full p-6 bg-[#FAFAF9] border-none rounded-3xl text-sm focus:ring-1 ring-[var(--color-secondary)] outline-none transition-all"
          placeholder="What's on your mind today? This can stay private or be shared with your practitioner."
        ></textarea>
        
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 px-2">
          <div class="flex items-center gap-3">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="newEntry.shared" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-secondary)]"></div>
              <span class="ml-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Share with Bertha
              </span>
            </label>
          </div>

          <button 
            @click="submitEntry"
            :disabled="!newEntry.content"
            class="px-8 py-3 bg-[var(--color-primary)] text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-30 transition-all"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="entry in entries" :key="entry.id" class="bg-white p-6 rounded-[32px] border border-gray-100 transition-all hover:border-gray-200">
        <div class="flex justify-between items-start mb-3">
          <span class="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{{ entry.date }}</span>
          <span v-if="entry.shared" class="text-[8px] font-bold text-[var(--color-secondary)] uppercase bg-[var(--color-secondary)]/5 px-2 py-1 rounded-full">
            <i class="fas fa-eye mr-1"></i> Shared with Practitioner
          </span>
        </div>
        <p class="text-sm text-[var(--color-primary)] font-light leading-relaxed">{{ entry.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

/**
 * @typedef {Object} JournalEntry
 * @property {string} id - Unique identifier for the entry
 * @property {string} content - The text content of the reflection
 * @property {string} date - Formatted date string
 * @property {boolean} shared - Whether the practitioner can view this entry
 */

/** @type {JournalEntry[]} */
const entries = ref([
  { id: '1', content: 'Felt much more grounded today after the breathing exercise.', date: '12 Feb 2026', shared: true },
  { id: '2', content: 'Processing some difficult news from family.', date: '10 Feb 2026', shared: false }
]);

const newEntry = reactive({
  content: '',
  shared: true
});

/**
 * Submits the new journal entry to the database.
 * @async
 * @function submitEntry
 * @returns {Promise<void>}
 */
const submitEntry = async () => {
  if (!newEntry.content) return;
  
  // Logic to save to Firestore would go here
  const entryToSave = {
    id: Date.now().toString(),
    ...newEntry,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  entries.value.unshift(entryToSave);
  newEntry.content = '';
  newEntry.shared = true;
};
</script>
