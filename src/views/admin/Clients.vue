<template>
  <div class="min-h-screen bg-[#F8F8F7] pt-6 pb-12 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="grid lg:grid-cols-12 gap-8">
        <main class="lg:col-span-8 md:col-span-10">
          <DataTable 
            title="User Management"
            collectionName="users"
            baseRoute="pra/users/view"
            :columns="[
              { key: 'fullName', label: 'Names', 
                type: 'identity', imgKey: 'coverImage', subKey: 'type' 
              },
              { key: 'email', label: 'email', type: 'badge' },
              
              { key: 'phone', label: 'cell phone', type: 'number' },

              { key: 'status', label: 'Status', type: 'badge' },

              { key: 'createdAt', label: 'Joined', type: 'date' }
            ]"
            :filters="['all', 'active', 'suspended']"

            :statusActions="status_actions"
          />
        </main>
      </div>

  </div>
</div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { useAppStore } from '@/stores/appStore';
import DataTable from '@/components/DataTable.vue'

const status_actions = [
  { 
    action: 'Activate', 
    key: 'active', 
    icon: 'fa-user-check', 
    intent: 'success', 
    scopes: ['all'] 
  },
  { 
    action: 'Deactivate', 
    key: 'in-active', 
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