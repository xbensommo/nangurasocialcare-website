<template>
  <div class="glass-panel rounded-xl flex flex-col h-full relative overflow-hidden transition-all duration-300">
    
    <div v-if="loading" class="absolute inset-0 z-50 bg-[#0B0C14]/60 backdrop-blur-sm flex items-center justify-center">
      <div class="w-12 h-12 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div class="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4 w-full sm:w-auto">
        <h2 class="text-xl font-bold tracking-wide shrink-0">{{ title }}</h2>
        <div class="relative w-full sm:w-64 group">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral)] group-focus-within:text-[var(--color-primary)] transition-colors"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--color-primary)] focus:bg-[#0B0C14] transition-all"
            @input="$emit('search', $event.target.value)"
          >
        </div>
      </div>
      <div class="flex gap-3">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="overflow-auto flex-1">
      <table class="w-full text-left border-collapse">
        <thead class="bg-white/5 text-xs uppercase tracking-wider text-[var(--color-neutral)] sticky top-0 backdrop-blur-md z-10">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key" 
              class="py-4 px-6 font-medium cursor-pointer hover:text-white transition-colors select-none"
              @click="$emit('sort', { key: col.key, dir: 'asc' })" 
            >
              <div class="flex items-center gap-2">
                {{ col.label }}
                <i class="fas fa-sort text-[10px] opacity-30"></i>
              </div>
            </th>
            <th class="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5 text-sm">
          <tr v-for="row in data" :key="row.id" class="hover:bg-white/[0.02] transition-colors group">
            <td v-for="col in columns" :key="col.key" class="py-4 px-6">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                <span :class="col.classes">{{ row[col.key] }}</span>
              </slot>
            </td>
            <td class="py-4 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="$emit('edit', row)" class="text-[var(--color-accent)] hover:text-white mr-3">
                <i class="fas fa-pen"></i>
              </button>
              <button @click="$emit('delete', row)" class="text-[var(--color-neutral)] hover:text-[var(--color-danger)]">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="meta && meta.total > 0" class="p-4 border-t border-white/5 flex justify-between items-center text-xs text-[var(--color-neutral)]">
      <span>
        Showing <strong>{{ ((meta.current_page - 1) * meta.per_page) + 1 }}</strong> 
        to <strong>{{ Math.min(meta.current_page * meta.per_page, meta.total) }}</strong> 
        of <strong>{{ meta.total }}</strong>
      </span>
      
      <div class="flex gap-2">
        <button 
          :disabled="meta.current_page === 1"
          @click="$emit('page-change', meta.current_page - 1)"
          class="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button 
          :disabled="meta.current_page === meta.last_page"
          @click="$emit('page-change', meta.current_page + 1)"
          class="px-3 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>

  /**
   * ### `SmartTable.vue`
   * The primary data display engine.
  * **Props:** `columns` (Array), `data` (Array), `loading` (Boolean), `meta` (Pagination Object).
  * **Features:** Automatic sorting, search emission, custom cell slots, and a glass-blur sticky header.
  * **Slots:** Use `#cell-[key]` to override any column with custom HTML (e.g., status badges or user avatars).
  */
defineProps({
  title: String,
  columns: Array,
  data: Array,
  loading: Boolean,
  meta: Object // { current_page, last_page, total, per_page }
});
defineEmits(['edit', 'delete', 'search', 'sort', 'page-change']);
</script>