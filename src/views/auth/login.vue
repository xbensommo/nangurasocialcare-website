<template>
  <div class="glass-panel p-8 lg:p-12 animate-reveal">
    <header class="mb-10 text-center lg:text-left">
      <h3 class="text-3xl font-display font-bold uppercase tracking-tighter italic">Welcome Back</h3>
      <p class="text-text-muted text-[10px] uppercase tracking-[0.2em] mt-2">Enter credentials to login</p>
    </header>

    <div class="mb-8">
      <button 
        @click="handleSocialLogin('google')" 
        :disabled="isLoading"
        class="btn-ghost w-full flex items-center justify-center gap-3 border border-border/40 hover:bg-white/5 transition-all py-3"
      >
        <i class="fa-brands fa-google text-secondary"></i>
        <span class="text-[10px] font-bold uppercase tracking-widest">Continue with Google</span>
      </button>

      </div>

    <div class="relative flex py-5 items-center">
      <div class="flex-grow border-t border-border/30"></div>
      <span class="flex-shrink mx-4 text-[9px] text-text-muted uppercase tracking-[0.3em]">Or use email</span>
      <div class="flex-grow border-t border-border/30"></div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div v-for="field in loginFields" :key="field.id" class="group">
        <label :for="field.id" class="text-[9px] font-bold uppercase tracking-widest text-text-muted mb-2 block group-focus-within:text-primary transition-colors">
          {{ field.label }}
        </label>
        <input 
          v-model="form[field.id]"
          :type="field.type" 
          :id="field.id"
          :placeholder="field.placeholder"
          class="glass-input input-field"
          :class="{ 'border-danger/50': errors[field.id] }"
        />
        <p v-if="errors[field.id]" class="text-danger text-[9px] mt-1 font-bold uppercase">{{ errors[field.id] }}</p>
      </div>

      <div class="flex items-center justify-between py-2">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input type="checkbox" v-model="rememberMe" class="w-4 h-4 border-border accent-secondary">
          <span class="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-secondary transition-colors">Remember Me</span>
        </label>
        <router-link to="/a/forgot" class="btn-ghost text-[10px] uppercase font-bold">Forgot Password?</router-link>
      </div>

      <button :disabled="isLoading" type="submit" class="btn-primary w-full group">
        <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> Authenticating</span>
        <span v-else>Login <i class="fa fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i></span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAppStore } from '@/stores/appStore';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { z } from 'zod';

const store = useAppStore();
const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const errors = ref({});
const rememberMe = ref(true);

const loginFields = [
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'admin@nambid.com' },
  { id: 'password', label: 'Security Key', type: 'password', placeholder: '••••••••' }
];

const form = reactive({ email: '', password: '' });

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(7, "Security key must be at least 7 characters")
});

/**
 * Shared redirection logic
 */
const finalizeLogin = (user) => {
  toast.success("Identity Verified", { description: `Welcome back, ${user.data.displayName || user?.data.email}` });
  const destination = route.query.redirect || (user.data.role === 'admin' ? '/pra' : '/my');
  router.push(destination);
};

/**
 * Handle Social Login
 * Uses fontawesome-free <i class="fa fa-google"></i>
 */
const handleSocialLogin = async (provider) => {
  try {
    isLoading.value = true;
    const user = await store.loginWithSocial(provider);
    finalizeLogin(user);
  } catch (err) {
    // Only toast if it's not the user closing the popup
    if (err.code !== 'auth/popup-closed-by-user') {
      toast.error("Social Auth Failed", { description: err.message });
    }
  } finally {
    isLoading.value = false;
  }
};

const handleLogin = async () => {
  errors.value = {};
  const validation = loginSchema.safeParse(form);
  
  if (!validation.success) {
    validation.error.issues.forEach(i => errors.value[i.path[0]] = i.message);
    return;
  }

  try {
    isLoading.value = true;
    const user = await store.login(form.email, form.password);
    finalizeLogin(user);
  } catch (err) {
    toast.error("Access Denied", { description: err.message });
  } finally {
    isLoading.value = false;
  }
};
</script>