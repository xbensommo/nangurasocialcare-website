<template>
  <div class="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 font-[var(--fontfamily-sans)]">
    <div class="w-full max-w-2xl bg-[var(--color-neutral-dark)]/40 backdrop-blur-3xl border border-white/5 p-12 rounded-none shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/10 blur-[60px] rounded-full -mr-12 -mt-12"></div>
      
      <header class="mb-12 relative">
        <button @click="router.back()" class="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-neutral)] hover:text-white transition-colors mb-6 flex items-center gap-2">
          <i class="fa fa-arrow-left text-[8px]"></i> Cancel Operation
        </button>
        <h2 class="text-4xl font-display font-bold text-white tracking-tighter italic uppercase">
          Initialize <span class="text-[var(--color-primary)]">Notifications</span>
        </h2>
        <p class="text-[var(--color-neutral)] text-[10px] uppercase tracking-[0.2em] mt-2 opacity-50">Drafting new entry for sharded registry</p>
      </header>

      <SmartForm 
        :fields="formConfig" 
        :initialData="formData" 
        :isLoading="isLoading"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import SmartForm from '@/components/abstract/SmartForm.vue';

const router = useRouter();
const store = useAppStore();
const isLoading = computed(() => store.loading);

// 1. Contextual Action Keys
const collectionKey = 'notifications';
const actionKey = 'notificationsActions';

// 2. Build-time Field Initialization
const formData = ref({
  
    userId: '',
  
    isRead: '',
  
    type: '',
  
    referenceId: '',
  
    createdAt: '',
  
});

// 3. Zod Schema Generation
const schema = z.object({
  
    userId: z.string()
      .min(1, { message: "userId is required" })
      ,
  
    isRead: z.string()
      .min(1, { message: "isRead is required" })
      ,
  
    type: z.string()
      .min(1, { message: "type is required" })
      ,
  
    referenceId: z.string()
      .min(1, { message: "referenceId is required" })
      ,
  
    createdAt: z.string()
      .min(1, { message: "createdAt is required" })
      ,
  
});

const formConfig = [
  
  { 
    key: 'userId', 
    label: 'userId', 
    type: 'string',
    placeholder: 'Input userid data...'
  },
  
  { 
    key: 'isRead', 
    label: 'isRead', 
    type: 'string',
    placeholder: 'Input isread data...'
  },
  
  { 
    key: 'type', 
    label: 'type', 
    type: 'string',
    placeholder: 'Input type data...'
  },
  
  { 
    key: 'referenceId', 
    label: 'referenceId', 
    type: 'string',
    placeholder: 'Input referenceid data...'
  },
  
  { 
    key: 'createdAt', 
    label: 'createdAt', 
    type: 'string',
    placeholder: 'Input createdat data...'
  },
  
];

const handleSubmit = async (data) => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    // Extract first error message for toast
    const firstError = result.error.issues[0].message;
    toast.error("Validation Failed", { description: firstError });
    return;
  }

  try {
    // Use the dynamic action factory: store.auctionsActions.add(...)
   // await store.`${actionKey}`.add(result.data);
    
    toast.success("Record Created", { 
      description: `New Notifications successfully committed to registry.` 
    });
    //router.push(`/${collectionKey}`);
  } catch (error) {
    toast.error("System Fault", { 
      description: "Database rejected the request. Check permissions." 
    });
    console.error(`[CREATE_Notifications_ERROR]:`, error);
  }
};
</script>