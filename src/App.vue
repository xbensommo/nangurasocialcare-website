<script setup>
import { onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter, RouterView } from "vue-router";

import { useAppStore } from '@/stores/appStore';
import { Toaster, toast } from 'vue-sonner';

import AppOverlay from '@/components/AppOverlay.vue';
import 'vue-sonner/style.css'

const store = useAppStore();
const route = useRoute();

const router = useRouter();

onMounted(async () => {
  // 1. Initialize Auth on Boot
  await store.initAuthListener();
  // 2. Automated Redirect Logic
  // If we just logged in and have a 'redirect' query, jump there now
  if (store.currentUser && route.query.redirect) {
    router.push(route.query.redirect);
  }
});
// Cleanup when app unmounts
onUnmounted(() => {
  store.cleanupAuth()
})

// 3. Error Monitoring: Auto-toast errors from the global state
watch(() => store.error, (newError) => {
  if (newError) {
    toast.error("Security Alert", {
      description: typeof newError === 'string' ? newError : newError.message,
    });
  }
});
</script>

<template>
  <div>
    <AppOverlay v-if="store.isLoading" />
    <Toaster position="top-center" richColors />
    <RouterView />
  </div>
</template>