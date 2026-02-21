<template>
  <div class="min-h-screen bg-[#F8F8F7] pt-6 pb-12 px-4 md:px-10">
    <div class="max-w-[1600px] mx-auto">
      
      <main class="w-full">
        <DataTable 
          title="Sessions Booking Management"
          collectionName="sessions"
          baseRoute="pra/sessions/view"
          :columns="[
            { 
              key: 'fullName', 
              label: 'Client Name', 
              type: 'identity', 
              imgKey: 'coverImage', 
              subKey: 'type' 
            },
            { key: 'message', label: 'Client Note', type: 'text' },

            { key: 'phone', label: 'Cell Phone', type: 'number' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'status', label: 'Status', type: 'badge' },
            { key: 'startDate', label: 'Booked Date', type: 'date' },
            { key: 'timee', label: 'Booked Time', type: 'date' }
          ]"
          :filters="['all', 'pending', 'confirmed', 'completed']"
          :statusActions="status_actions"
        />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useAppStore } from '@/stores/appStore';
import DataTable from '@/components/DataTable.vue'

const status_actions = [
  { 
    action: 'Confirm', 
    key: 'confirmed', 
    icon: 'fa-user-check', 
    intent: 'success', 
    scopes: ['all'] 
  },
  { 
    action: 'Cancel', 
    key: 'cancelled', 
    icon: 'fa-user-minus', 
    intent: 'warning', 
    scopes: ['active'] 
  }
];
</script>

<style scoped>
.font-serif { font-family: 'Playfair Display', serif; }
.fade-enter-active, .fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>