<template>
  <div class="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 font-[var(--fontfamily-sans)]">
    <div class="w-full max-w-2xl bg-[var(--color-neutral-dark)]/40 backdrop-blur-3xl border border-white/5 p-12 rounded-none shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 right-0 w-24 h-24 bg-[var(--color-primary)]/10 blur-[60px] rounded-full -mr-12 -mt-12"></div>
      
      <header class="mb-12 relative">
        <button @click="router.back()" class="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-neutral)] hover:text-white transition-colors mb-6 flex items-center gap-2">
          <i class="fa fa-arrow-left text-[8px]"></i> Cancel Operation
        </button>
        <h2 class="text-4xl font-display font-bold text-white tracking-tighter italic uppercase">
          Initialize <span class="text-[var(--color-primary)]">Sessions</span>
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
const collectionKey = 'sessions';
const actionKey = 'sessionsActions';

// 2. Build-time Field Initialization
const formData = ref({
  
    clientId: '',
  
    practitionerId: '',
  
    sessionId: '',
  
    clientNames: '',
  
    practitionerNames: '',
  
    sessionType: '',
  
    status: '',
  
    startTime: '',
  
    endTime: '',
  
    meetingLink: '',
  
    location: '',
  
    updatedAt: '',
  
});

// 3. Zod Schema Generation
const schema = z.object({
  
    clientId: z.string()
      .min(1, { message: "clientId is required" })
      ,
  
    practitionerId: z.string()
      .min(1, { message: "practitionerId is required" })
      ,
  
    sessionId: z.string()
      .min(1, { message: "sessionId is required" })
      ,
  
    clientNames: z.string()
      .min(1, { message: "clientNames is required" })
      ,
  
    practitionerNames: z.string()
      .min(1, { message: "practitionerNames is required" })
      ,
  
    sessionType: z.string()
      .min(1, { message: "sessionType is required" })
      ,
  
    status: z.string()
      .min(1, { message: "status is required" })
      ,
  
    startTime: z.string()
      .min(1, { message: "startTime is required" })
      ,
  
    endTime: z.string()
      .min(1, { message: "endTime is required" })
      ,
  
    meetingLink: z.string()
      .min(1, { message: "meetingLink is required" })
      ,
  
    location: z.string()
      .min(1, { message: "location is required" })
      ,
  
    updatedAt: z.string()
      .min(1, { message: "updatedAt is required" })
      ,
  
});

const formConfig = [
  
  { 
    key: 'clientId', 
    label: 'clientId', 
    type: 'string',
    placeholder: 'Input clientid data...'
  },
  
  { 
    key: 'practitionerId', 
    label: 'practitionerId', 
    type: 'string',
    placeholder: 'Input practitionerid data...'
  },
  
  { 
    key: 'sessionId', 
    label: 'sessionId', 
    type: 'string',
    placeholder: 'Input sessionid data...'
  },
  
  { 
    key: 'clientNames', 
    label: 'clientNames', 
    type: 'string',
    placeholder: 'Input clientnames data...'
  },
  
  { 
    key: 'practitionerNames', 
    label: 'practitionerNames', 
    type: 'string',
    placeholder: 'Input practitionernames data...'
  },
  
  { 
    key: 'sessionType', 
    label: 'sessionType', 
    type: 'string',
    placeholder: 'Input sessiontype data...'
  },
  
  { 
    key: 'status', 
    label: 'status', 
    type: 'string',
    placeholder: 'Input status data...'
  },
  
  { 
    key: 'startTime', 
    label: 'startTime', 
    type: 'string',
    placeholder: 'Input starttime data...'
  },
  
  { 
    key: 'endTime', 
    label: 'endTime', 
    type: 'string',
    placeholder: 'Input endtime data...'
  },
  
  { 
    key: 'meetingLink', 
    label: 'meetingLink', 
    type: 'string',
    placeholder: 'Input meetinglink data...'
  },
  
  { 
    key: 'location', 
    label: 'location', 
    type: 'string',
    placeholder: 'Input location data...'
  },
  
  { 
    key: 'updatedAt', 
    label: 'updatedAt', 
    type: 'timestamp',
    placeholder: 'Input updatedat data...'
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
      description: `New Sessions successfully committed to registry.` 
    });
    //router.push(`/${collectionKey}`);
  } catch (error) {
    toast.error("System Fault", { 
      description: "Database rejected the request. Check permissions." 
    });
    console.error(`[CREATE_Sessions_ERROR]:`, error);
  }
};
</script>