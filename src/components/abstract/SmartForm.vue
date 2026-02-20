<template>
  <form @submit.prevent="handleInternalSubmit" class="space-y-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div v-for="field in fields" :key="field.key" class="group flex flex-col">
        <label class="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-3 group-focus-within:text-[var(--color-primary)] transition-all">
          {{ field.label }}
        </label>
        
        <div class="relative">
          <input 
            v-if="['text', 'email', 'password', 'number'].includes(field.type)"
            v-model="internalData[field.key]"
            :type="field.type"
            :placeholder="field.placeholder"
            class="w-full bg-white/[0.03] border border-primary/20 rounded-none px-5 py-4 text-sm text-gray-600 focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-gray-300"
          />

          <AssetManager 
            v-if="['image', 'video', 'file'].includes(field.type)"
            v-model="internalData[field.key]"
            :collection="collectionName"
          />

          <div v-if="field.type === 'select'" class="relative">
            <select 
              v-model="internalData[field.key]"
              class="w-full bg-white/[0.03] border border-primary/10 rounded-none px-5 py-4 text-sm text-gray-600 focus:outline-none focus:border-[var(--color-primary)] appearance-none transition-all"
            >
              <option value="" disabled selected>{{ field.placeholder }}</option>
              <option v-for="opt in field.options" :key="opt.value" :value="opt.value" class="bg-secondary text-white">
                {{ opt.label }}
              </option>
            </select>
            <i class="fa fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] text-[8px] pointer-events-none"></i>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end pt-10 border-t border-white/5">
      <button 
        type="submit" 
        :disabled="isLoading"
        class="group bg-[var(--color-primary)] text-secondary px-12 py-5 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-4"
      >
        <template v-if="isLoading">
          <i class="fa fa-spinner fa-spin"></i> Processing Request
        </template>
        <template v-else>
          Commit Registry Entry <i class="fa fa-arrow-right text-[8px] group-hover:translate-x-2 transition-transform"></i>
        </template>
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue';
import AssetManager from './AssetManager.vue';
const props = defineProps({
  fields: { type: Array, required: true },
  initialData: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['submit']);

// Use reactive to maintain reference while allowing deep updates
const internalData = reactive({ ...props.initialData });

// Sync internal state if the parent updates initialData (useful for resetting)
watch(() => props.initialData, (newVal) => {
  Object.assign(internalData, newVal);
}, { deep: true });

const handleInternalSubmit = () => {
  // Emit the data back to the parent for Zod validation and store processing
  emit('submit', { ...internalData });
};
</script>
