<template>
  <div class="min-h-screen bg-[var(--color-background)] p-8 font-[var(--fontfamily-sans)] text-[var(--color-text)]">
    <div class="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
      <div>
        <h1 class="text-4xl font-bold tracking-tighter text-white uppercase italic">
          Slots 
          <span class="text-[var(--color-primary)]">Registry</span>
        </h1>
        <p class="text-[var(--color-neutral)] text-[10px] uppercase tracking-[0.2em] mt-1 opacity-50">
          Management Interface / Sharded Database Access
        </p>
      </div>
      
      <router-link
        to="/nam/slots/create"
        class="bg-[var(--color-primary)] text-secondary px-8 py-3 rounded-none hover:bg-white transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2"
      >
        <i class="fa fa-plus"></i> Add New Entry
      </router-link>
    </div>

    <Skeleton v-if="isLoading && !hasData" class="h-96 w-full opacity-10" />
    
    <DataTable 
      v-else
      :title="'Slots'"
      collectionName="slots"
      baseRoute="/nam/slots"
      :columns="tableColumns"
      :filters="['all', 'active', 'pending', 'archived']"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import Skeleton from '@/components/Skeleton.vue';
import DataTable from '@/components/DataTable.vue';

const router = useRouter();
const store = useAppStore();

// 1. Reactive State references using the dynamic keys from state.js
const collectionKey = 'slots';
const actionKey = 'slotsActions';

const isLoading = computed(() => store.loading);
const hasData = computed(() => store[collectionKey].items.length > 0);

// 2. Dynamic Column Mapping from EJS Fields
const tableColumns = [
  
  { 
    key: 'practitionerId', 
    label: 'PRACTITIONERID', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { 
    key: 'startTime', 
    label: 'STARTTIME', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { 
    key: 'endTIme', 
    label: 'ENDTIME', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { 
    key: 'isBooked', 
    label: 'ISBOOKED', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { 
    key: 'sessionId', 
    label: 'SESSIONID', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { 
    key: 'slotId', 
    label: 'SLOTID', 
    type: 'text',
    
    classes: 'font-mono'
  },
  
  { key: 'createdAt', label: 'CREATED', type: 'date' }
];

// 3. Lifecycle & Initialization
onMounted(async () => {
  // Check if we already have data to avoid double-fetching on tab back
  if (!hasData.value) {
    try {
      /** * Assuming your actions are mapped as: 
       * store.auctionsActions.fetchInitialPage() 
       */
     // await store.`${actionKey}`.fetchInitialPage();
    } catch (error) {
      console.error(`Failed to initialize ${collectionKey}:`, error);
    }
  }
});

/**
 * Handle Global Exports or Admin-only Batch actions
 */
const triggerExport = async () => {
 // await store.`${actionKey}`.exportAllToCSV();
};
</script>