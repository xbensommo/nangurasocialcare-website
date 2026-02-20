<template>
  <div class="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6 font-[var(--fontfamily-sans)]">
    
    <div class="w-full max-w-2xl mb-6">
      <button @click="router.back()" class="group text-[var(--color-neutral)] hover:text-white transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
        <i class="fa fa-chevron-left text-[8px] group-hover:-translate-x-1 transition-transform"></i> 
        Return to Sessions Registry
      </button>
    </div>

    <div class="w-full max-w-2xl bg-[var(--color-neutral-dark)]/40 backdrop-blur-3xl border border-white/5 p-10 rounded-none shadow-2xl relative">
      <div class="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)]"></div>

      <header class="mb-10">
        <h1 class="text-3xl font-display font-bold text-white tracking-tighter italic uppercase">
          Modify <span class="text-[var(--color-primary)]">Sessions</span>
        </h1>
        <div class="flex items-center gap-4 mt-2">
          <p class="text-[var(--color-neutral)] text-[9px] font-mono uppercase tracking-widest opacity-50">System ID: {{ id }}</p>
          <div v-if="isLoading" class="h-[1px] flex-1 bg-white/5 animate-pulse"></div>
        </div>
      </header>

      <Skeleton v-if="isLoading && !isDataLoaded" class="h-80 w-full opacity-5" />

      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              clientId
            </label>
            
            <div class="relative">
              <input 
                v-model="form.clientId" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter clientId..."
              />
              <i v-if="errors.clientId" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.clientId" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.clientId }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              practitionerId
            </label>
            
            <div class="relative">
              <input 
                v-model="form.practitionerId" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter practitionerId..."
              />
              <i v-if="errors.practitionerId" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.practitionerId" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.practitionerId }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              sessionId
            </label>
            
            <div class="relative">
              <input 
                v-model="form.sessionId" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter sessionId..."
              />
              <i v-if="errors.sessionId" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.sessionId" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.sessionId }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              clientNames
            </label>
            
            <div class="relative">
              <input 
                v-model="form.clientNames" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter clientNames..."
              />
              <i v-if="errors.clientNames" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.clientNames" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.clientNames }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              practitionerNames
            </label>
            
            <div class="relative">
              <input 
                v-model="form.practitionerNames" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter practitionerNames..."
              />
              <i v-if="errors.practitionerNames" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.practitionerNames" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.practitionerNames }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              sessionType
            </label>
            
            <div class="relative">
              <input 
                v-model="form.sessionType" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter sessionType..."
              />
              <i v-if="errors.sessionType" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.sessionType" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.sessionType }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              status
            </label>
            
            <div class="relative">
              <input 
                v-model="form.status" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter status..."
              />
              <i v-if="errors.status" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.status" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.status }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              startTime
            </label>
            
            <div class="relative">
              <input 
                v-model="form.startTime" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter startTime..."
              />
              <i v-if="errors.startTime" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.startTime" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.startTime }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              endTime
            </label>
            
            <div class="relative">
              <input 
                v-model="form.endTime" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter endTime..."
              />
              <i v-if="errors.endTime" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.endTime" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.endTime }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              meetingLink
            </label>
            
            <div class="relative">
              <input 
                v-model="form.meetingLink" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter meetingLink..."
              />
              <i v-if="errors.meetingLink" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.meetingLink" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.meetingLink }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              location
            </label>
            
            <div class="relative">
              <input 
                v-model="form.location" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter location..."
              />
              <i v-if="errors.location" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.location" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.location }}
            </p>
          </div>
          
          <div class="group flex flex-col">
            <label class="text-[9px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-3 group-focus-within:text-[var(--color-primary)] transition-colors">
              updatedAt
            </label>
            
            <div class="relative">
              <input 
                v-model="form.updatedAt" 
                type="text" 
                class="w-full bg-white/[0.03] border border-white/10 rounded-none px-5 py-4 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:bg-white/[0.07] transition-all placeholder:text-white/5"
                placeholder="Enter updatedAt..."
              />
              <i v-if="errors.updatedAt" class="fa fa-circle-exclamation absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-xs"></i>
            </div>

            <p v-if="errors.updatedAt" class="text-red-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">
              {{ errors.updatedAt }}
            </p>
          </div>
          
        </div>

        <div class="pt-10 border-t border-white/5 flex items-center justify-between">
          <button type="button" @click="router.back()" class="text-[var(--color-neutral)] hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
            Discard Changes
          </button>
          
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group bg-[var(--color-primary)] text-secondary px-10 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            <i v-if="isLoading" class="fa fa-spinner fa-spin"></i>
            <span v-else>Commit Update <i class="fa fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i></span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import Skeleton from '@/components/Skeleton.vue';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const id = route.params.id;
const errors = ref({});
const isDataLoaded = ref(false);

const collectionKey = 'sessions';
const actionKey = 'sessionsActions';
const isLoading = computed(() => store.loading);

// 1. Zod Validation Schema
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

// 2. Form State
const form = ref({
  
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

onMounted(async () => {
  if (!id) {
    toast.error("Invalid Request: No ID provided");
   // router.push(`/${collectionKey}`);
    return;
  }

  try {
    // Using the dynamic action factory: store.usersActions.getById(id)
   // const fetchedData = await store.`${actionKey}`.getById(id);
    
    if (!fetchedData) {
      toast.error("Record not found in registry");
     // router.push(`/${collectionKey}`);
      return;
    }

    Object.assign(form.value, fetchedData);
    isDataLoaded.value = true;
  } catch (err) {
    toast.error("Network Error: Failed to synchronize with database");
    console.error(`[${collectionKey}Edit] Sync Failure:`, err);
  }
});

const handleSubmit = async () => {
  errors.value = {};
  
  // Validate
  const validation = schema.safeParse(form.value);
  
  if (!validation.success) {
    validation.error.issues.forEach(issue => {
      errors.value[issue.path[0]] = issue.message;
    });
    toast.warning("Validation Error", {
      description: "Please check the highlighted fields before committing."
    });
    return;
  }

  try {
    // Dynamic update action
    //await store.`${actionKey}`.update(id, validation.data);
    
    toast.success("Registry Updated", {
      description: `${id.toUpperCase()} has been modified successfully.`
    });
    
    router.push(`/${collectionKey}`);
  } catch (err) {
    toast.error("Update Failed", {
      description: "A system error occurred. Please verify your permissions."
    });
  }
};
</script>


<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: all 0.4s ease-out; }
.slide-up-enter-from { transform: translateY(20px); opacity: 0; }
</style>