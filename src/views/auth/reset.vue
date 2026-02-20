<template>
  <div class="glass-panel p-8 lg:p-12 animate-reveal">
    <header class="mb-10 text-center lg:text-left">
      <h3 class="text-3xl font-display font-bold uppercase tracking-tighter italic">New Security Key</h3>
      <p class="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-2">Establish your new registry access credentials</p>
    </header>

    <div v-if="success" class="text-center space-y-6">
      <div class="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
        <i class="fa-solid fa-check text-2xl"></i>
      </div>
      <p class="text-[10px] uppercase tracking-widest font-bold">Registry Access Restored</p>
      <router-link to="/a/login" class="btn-primary w-full">Sign In Now</router-link>
    </div>

    <form v-else @submit.prevent="handleReset" class="space-y-6">
      <div v-for="field in resetFields" :key="field.id" class="group">
        <label class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block group-focus-within:text-primary">
          {{ field.label }}
        </label>
        <input 
          v-model="form[field.id]"
          :type="field.type"
          class="glass-input"
          :placeholder="field.placeholder"
        />
        <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold">{{ errors[field.id] }}</p>
      </div>

      <button :disabled="isLoading" type="submit" class="btn-primary w-full group">
        <span v-if="isLoading"><i class="fa-solid fa-spinner fa-spin"></i> Updating...</span>
        <span v-else>Update Credentials <i class="fa-solid fa-key ml-2"></i></span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { z } from 'zod';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/firebase';

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const success = ref(false);
const errors = ref({});

const resetFields = [
  { id: 'password', label: 'New Security Key', type: 'password', placeholder: '••••••••' },
  { id: 'confirm', label: 'Confirm Key', type: 'password', placeholder: '••••••••' }
];

const form = reactive({ password: '', confirm: '' });

const schema = z.object({
  password: z.string().min(8, "Minimum 8 characters required"),
  confirm: z.string()
}).refine((data) => data.password === data.confirm, {
  message: "Keys do not match",
  path: ["confirm"],
});

onMounted(async () => {
  const code = route.query.oobCode;
  if (!code) {
    toast.error("Invalid Request", { description: "Security code missing from link." });
    router.push('/a/login');
    return;
  }
  try {
    await verifyPasswordResetCode(auth, code);
  } catch (e) {
    toast.error("Expired Link", { description: "This recovery link is no longer valid." });
    router.push('/a/forgot-password');
  }
});

const handleReset = async () => {
  errors.value = {};
  const validation = schema.safeParse(form);
  if (!validation.success) {
    validation.error.issues.forEach(i => errors.value[i.path[0]] = i.message);
    return;
  }

  try {
    isLoading.value = true;
    await confirmPasswordReset(auth, route.query.oobCode, form.password);
    success.value = true;
    toast.success("Registry Key Updated");
  } catch (err) {
    toast.error("Update Failed", { description: err.message });
  } finally {
    isLoading.value = false;
  }
};
</script>