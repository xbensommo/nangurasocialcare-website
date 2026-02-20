<template>
  <div class="glass-panel p-8 lg:p-12 animate-reveal">
    <header class="mb-10">
      <h3 class="text-3xl font-display font-bold uppercase tracking-tighter italic">Recovery</h3>
      <p class="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-2">Request a security key reset</p>
    </header>

    <div v-if="emailSent" class="space-y-6 text-center">
      <div class="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="fa-solid fa-paper-plane text-2xl"></i>
      </div>
      <p class="text-[10px] uppercase tracking-widest text-text-muted">Instructions sent to <br/> <span class="text-secondary font-bold">{{ email }}</span></p>
      <router-link to="/a" class="btn-primary w-full">Back to Login</router-link>
    </div>

    <form v-else @submit.prevent="handleReset" class="space-y-6">
      <div class="group">
        <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block">Registered Email</label>
        <input v-model="email" type="email" class="glass-input input-field" placeholder="Enter your email...">
      </div>
      <button :disabled="isLoading" type="submit" class="btn-primary w-full">
        <span v-if="isLoading">Processing...</span>
        <span v-else>Send Recovery Link</span>
      </button>
      <router-link to="/a" class="btn-ghost w-full text-center block">Nevermind, I remembered</router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'vue-sonner';

const store = useAppStore();
const email = ref('');
const isLoading = ref(false);
const emailSent = ref(false);

const handleReset = async () => {
  if (!email.value) return toast.warning("Email required");
  
  try {
    isLoading.value = true;
    await store.sendPasswordReset(email.value);
    emailSent.value = true;
    toast.success("Recovery Initialized");
  } catch (err) {
    toast.error("Recovery Failed", { description: err.message });
  } finally {
    isLoading.value = false;
  }
};
</script>