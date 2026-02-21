<template>
  <div class="min-h-screen bg-[#FAFAF9] pt-12 pb-20 px-4 md:px-8 relative">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
        
        <div class="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 class="font-serif text-3xl text-[var(--color-primary)]">{{ title }}</h2>
            <p class="text-sm text-gray-500 font-light mt-1">
              Managing clinical records for {{ collectionName }}
            </p>
          </div>
          
          <div class="flex bg-gray-50/50 p-1.5 rounded-full border border-gray-100 overflow-x-auto scrollbar-hide gap-1">
            <button 
              v-for="filter in filters" 
              :key="filter"
              @click="setFilter(filter)"
              :class="activeFilter === filter 
                ? 'bg-white text-[var(--color-primary)] shadow-sm' 
                : 'text-gray-500 hover:text-[var(--color-primary)]'"
              class="px-5 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap capitalize"
            >
              {{ filter }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50/30 border-b border-gray-100">
              <tr>
                <th class="px-6 py-4 w-10">
                  <input 
                    type="checkbox" 
                    :checked="isAllSelected" 
                    :indeterminate.prop="isIndeterminate"
                    @change="toggleSelectAll"
                    class="border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded h-4 w-4 transition-all cursor-pointer"
                  />
                </th>
                <th v-for="col in columns" :key="col.key" 
                  class="px-6 py-4 text-sm font-semibold text-[var(--color-primary)]">
                  {{ col.label }}
                </th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-[var(--color-primary)]">Action</th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-gray-50">
              <tr v-if="loading" v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
                <td :colspan="columns.length + 2" class="px-6 py-6 bg-gray-50/20">
                  <div class="h-4 bg-gray-200/50 rounded-full w-full max-w-md"></div>
                </td>
              </tr>

              <tr v-else v-for="item in filteredItems" :key="item.id" 
                :class="selectedIds.has(item.id) ? 'bg-[var(--color-primary)]/5' : 'hover:bg-gray-50/50'"
                class="transition-colors group"
              >
                <td class="px-6 py-4">
                  <input 
                    type="checkbox" 
                    v-model="selectedArray" 
                    :value="item.id"
                    class="border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] rounded h-4 w-4 cursor-pointer"
                  />
                </td>

                <td v-for="col in columns" :key="col.key" class="px-6 py-4">
                  <slot :name="`cell-${col.key}`" :item="item" :col="col">
                    
                    <div v-if="col.type === 'identity'" class="flex items-center space-x-4">
                      <div class="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100 bg-gray-50">
                        <img v-if="item[col.imgKey]" :src="Array.isArray(item[col.imgKey]) ? item[col.imgKey][0] : item[col.imgKey]" class="h-full w-full object-cover" />
                        <div v-else class="h-full w-full flex items-center justify-center text-[var(--color-accent)]">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                      </div>
                      <div class="flex flex-col">
                        <span class="font-serif text-base text-[var(--color-primary)] truncate max-w-[200px]">{{ item[col.key] }}</span>
                        <span v-if="col.subKey" class="text-xs text-gray-500">{{ item[col.subKey] }}</span>
                      </div>
                    </div>

                    <span v-else-if="col.type === 'badge'" :class="statusStyles(item[col.key])" class="px-3 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap">
                      {{ item[col.key] }}
                    </span>

                    <div v-else-if="col.type === 'date'" class="flex flex-col">
                      <span class="text-sm text-gray-800">{{ formatDate(item[col.key]) }}</span>
                    </div>

                    <div v-else-if="col.type === 'longText'" class="max-w-xs">
                      <p class="text-sm text-gray-600 transition-all duration-300 leading-relaxed" :class="{ 'line-clamp-2': !expandedRows.has(item.id) }">
                        {{ item[col.key] }}
                      </p>
                      <button v-if="item[col.key] && item[col.key].length > 60" @click="toggleRow(item.id)" class="text-xs font-medium text-[var(--color-accent)] mt-1 hover:underline">
                        {{ expandedRows.has(item.id) ? 'Show Less' : 'Read More' }}
                      </button>
                    </div>

                    <span v-else class="text-sm text-gray-700">{{ item[col.key] || '—' }}</span>
                  </slot>
                </td>

                <td class="px-6 py-4 text-right">
                  <router-link 
                    :to="`${baseRoute}/${item.id}/${item._shard_source}`" 
                    class="group-hover:opacity-100 text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-all inline-flex items-center gap-1"
                  >
                    Review <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="hasMore" class="p-6 border-t border-gray-100 text-center">
            <button @click="loadNextPage" :disabled="loading" class="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors disabled:opacity-50">
              <span v-if="loading">Loading...</span>
              <span v-else>Load More Records</span>
            </button>
          </div>
        </div>

        <div v-if="!loading && filteredItems.length === 0" class="p-24 text-center">
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-50 mb-6 text-gray-300">
             <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <p class="font-serif text-xl text-[var(--color-primary)]">No Records Found</p>
          <p class="text-gray-500 text-sm mt-2 font-light">Adjust your filters to see more results.</p>
        </div>
      </div>
    </div>

    <transition name="slide-up">
      <div v-if="selectedIds.size > 0" 
        class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-8 py-4 shadow-2xl flex items-center gap-8 z-50 rounded-full border border-white/10 backdrop-blur-md"
      >
        <div class="flex flex-col border-r border-white/20 pr-8">
          <span class="text-xs uppercase tracking-wider opacity-70 font-medium">Selected</span>
          <span class="font-serif text-2xl leading-none mt-1">{{ selectedIds.size }} <span class="text-sm font-sans font-light opacity-80">Items</span></span>
        </div>

        <div class="flex items-center gap-4">
          <button 
             v-for="(act, dx) in visibleActions" 
             :key="dx"  
             @click="handleBulkUpdate(act)" 
             :disabled="isProcessing"
             :class="getActionColor(act.intent)"
             class="px-6 py-2.5 text-sm font-medium rounded-full hover:scale-105 active:scale-95 transition-all flex items-center disabled:opacity-50"
          >
             <span v-if="isProcessing && currentAction === act.key" class="mr-2 opacity-70">⟳</span>
             {{ act.action}}
          </button>

          <button @click="selectedArray = []" class="text-sm font-medium opacity-70 hover:opacity-100 px-2 transition-opacity ml-2">
            Cancel
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAppStore } from '@/stores/appStore';

// [NOTE: Props and core logic remain identical to your original code. I am only updating visual helper functions]
const props = defineProps({
  title: String,
  collectionName: String,
  baseRoute: String,
  filters: { type: Array, default: () => ['all', 'pending', 'accepted', 'denied', 'active', 'suspended'] },
  filterOptions: {
    required: true, type: Object, default: () => {}
  },
  columns: { type: Array, required: true }, 
  statusActions: {
    required: true,
    type: Array,
    default: () => [
       { action: 'Approve', key: 'accepted', intent: 'success', scopes: ['all', 'pending', 'suspended'] },
       { action: 'Reject', key: 'denied', intent: 'danger', scopes: ['all', 'pending'] },
       { action: 'Suspend', key: 'suspended', intent: 'warning', scopes: ['all', 'active', 'accepted'] },
       { action: 'Activate', key: 'active', intent: 'primary', scopes: ['all', 'suspended', 'denied'] },
    ]
  }
});

const store = useAppStore();
const activeFilter = ref('all');
const loading = ref(true);
const isProcessing = ref(false); 
const currentAction = ref(null);
const selectedArray = ref([]); 

const items = computed(() => store[props.collectionName]?.items || []);

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return items.value;
  return items.value.filter(item => item.status?.toLowerCase() === activeFilter.value.toLowerCase());
});

const setFilter = (filter) => {
  activeFilter.value = filter;
  selectedArray.value = []; 
};

const visibleActions = computed(() => {
  return props.statusActions.filter(act => {
    return !act.scopes || act.scopes.includes(activeFilter.value);
  });
});

// UPDATED: Softer button colors for the floating action bar
const getActionColor = (intent) => {
  const map = {
    success: 'bg-emerald-500 text-white',
    danger: 'bg-rose-500 text-white',
    warning: 'bg-amber-500 text-white',
    primary: 'bg-[var(--color-accent)] text-white',
    neutral: 'bg-gray-600 text-white'
  };
  return map[intent] || map.neutral;
};

const { collectionName } = props;
const actionName = `${collectionName}Actions`;

const selectedIds = computed(() => new Set(selectedArray.value));

const isAllSelected = computed(() => {
  return filteredItems.value.length > 0 && selectedArray.value.length === filteredItems.value.length;
});

const isIndeterminate = computed(() => {
  return selectedArray.value.length > 0 && selectedArray.value.length < filteredItems.value.length;
});

const toggleSelectAll = (e) => {
  selectedArray.value = e.target.checked ? filteredItems.value.map(item => item.id) : [];
};

onMounted(async () => {
  if (store[collectionName]?.items?.length == 0){
    await loadData();
  }
  loading.value = false;
});

const loadData = async () => {
  console.log(props.filterOptions)
  loading.value = true;
  if (store[actionName]) {
    await store[actionName].fetchByFilters(props.filterOptions);
  }
  loading.value = false;
};

const handleBulkUpdate = async (actionObj) => {
  const count = selectedArray.value.length;
  if (!window.confirm(`${actionObj.action} ${count} selected records?`)) return;

  try {
    isProcessing.value = true;
    currentAction.value = actionObj.key;
    
    const itemsToUpdate = filteredItems.value
      .filter(item => selectedIds.value.has(item.id))
      .map(item => ({ id: item.id, shard: item._shard_source }));

    if (store[actionName]?.bulkUpdateStatus) {
      await store[actionName].bulkUpdateStatus(itemsToUpdate, actionObj.key);
      selectedArray.value = []; 
    }
  } catch (err) {
    console.error("Bulk action failed:", err);
  } finally {
    isProcessing.value = false;
    currentAction.value = null;
  }
};

// UPDATED: Clinical pastel colors for status badges
const statusStyles = (status) => {
  const s = status?.toLowerCase();
  const styles = {
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    verified: 'bg-blue-50 text-blue-700 border border-blue-200',
    denied: 'bg-rose-50 text-rose-700 border border-rose-200',
    suspended: 'bg-gray-100 text-gray-600 border border-gray-200',
  };
  return styles[s] || 'bg-gray-50 text-gray-600 border border-gray-200';
};

const hasMore = computed(() => store[collectionName]?.hasMore);

const loadNextPage = async () => {
  loading.value = true;
  if(store[actionName]?.fetchNextPage) {
      await store[actionName].fetchNextPage(props.filterOptions);
  }
  loading.value = false;
};

const expandedRows = ref(new Set());
const toggleRow = (id) => {
  expandedRows.value.has(id) ? expandedRows.value.delete(id) : expandedRows.value.add(id);
};

const formatDate = (val) => {
  if (!val) return '—';
  const date = val && typeof val.toDate === 'function' ? val.toDate() : new Date(val);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};


</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translate(-50%, 150%); opacity: 0; }

/* Hide scrollbar for filter tabs */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>