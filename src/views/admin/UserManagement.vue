<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';
import SmartTable from '@/components/abstract/SmartTable.vue';
import SmartForm from '@/components/abstract/SmartForm.vue';
//import { useNotification } from '@/composables/useNotification';

/**
 * @title User & Access Management
 * @description Advanced admin interface using Smart Components.
 */

const store = useAppStore();
const notification = useNotification();
const showDrawer = ref(false);
const isEditing = ref(false);
const selectedUser = ref({});

// 1. Table Column Configuration
const columns = [
  { key: 'name', label: 'Identity', classes: 'font-bold text-white' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Access Level', classes: 'font-space text-[var(--color-primary)] uppercase text-[10px] tracking-widest' },
  { key: 'status', label: 'Status' },
  { key: 'lastLogin', label: 'Last Activity', classes: 'text-[var(--color-neutral)] italic' }
];

// 2. Form Schema for Create/Edit
const formSchema = [
  { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Alexander Pierce' },
  { key: 'email', label: 'Email Address', type: 'email', placeholder: 'alex@bilyzna.com' },
  { key: 'role', label: 'System Role', type: 'select', options: [
    { label: 'Administrator', value: 'admin' },
    { label: 'Editor', value: 'editor' },
    { label: 'Viewer', value: 'viewer' }
  ]},
  { key: 'status', label: 'Account Status', type: 'select', options: [
    { label: 'Active', value: 'Active' },
    { label: 'Suspended', value: 'Suspended' }
  ]}
];

onMounted(async () => {
  store.showLoading();
  // Assume a generic fetchUsers action exists in your appStore
  await store.fetchUsers(); 
  store.hideLoading();
});

const openCreate = () => {
  selectedUser.value = { role: 'viewer', status: 'Active' };
  isEditing.value = false;
  showDrawer.value = true;
};

const openEdit = (user) => {
  selectedUser.value = { ...user };
  isEditing.value = true;
  showDrawer.value = true;
};

const handleSave = async (payload) => {
  try {
    if (isEditing.value) {
      await store.updateUser(payload.id, payload);
      notification.showNotification('User profile updated.');
    } else {
      await store.createUser(payload);
      notification.showNotification('New user provisioned.');
    }
    showDrawer.value = false;
  } catch (err) {
    notification.showNotification('Operation failed. Check permissions.');
  }
};
</script>

<template>
  <div class="p-8 space-y-8 bg-[var(--color-background)] min-h-screen">
    
    <header class="flex justify-between items-end" data-aos="fade-down">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tighter uppercase font-space">
          Access <span class="text-[var(--color-primary)]">Control</span>
        </h1>
        <p class="text-[var(--color-neutral)] text-sm mt-1">Manage administrative identities and permissions.</p>
      </div>
      <button @click="openCreate" class="btn-primary px-8 py-3 rounded-xl">
        <i class="fas fa-user-plus mr-2"></i> PROVISION USER
      </button>
    </header>

    <div data-aos="fade-up">
      <SmartTable 
        title="Active Directory"
        :columns="columns"
        :data="store.users || []"
        :loading="store.loading"
        @edit="openEdit"
        @delete="(u) => confirm(`Delete ${u.name}?`) && store.deleteUser(u.id)"
      >
        <template #cell-role="{ value }">
          <div class="px-3 py-1 rounded-full bg-white/5 border border-white/10 inline-flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" :class="value === 'admin' ? 'bg-red-400 shadow-[0_0_8px_red]' : 'bg-blue-400'"></span>
            {{ value }}
          </div>
        </template>

        <template #cell-status="{ value }">
           <span :class="value === 'Active' ? 'text-green-400' : 'text-[var(--color-danger)]'" class="text-xs font-bold uppercase tracking-tighter">
             {{ value }}
           </span>
        </template>
      </SmartTable>
    </div>

    <transition name="drawer">
      <div v-if="showDrawer" class="fixed inset-y-0 right-0 w-[450px] z-[100] bg-[#0B0C14] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] p-10 flex flex-col">
        <div class="flex justify-between items-center mb-10">
          <h3 class="text-2xl font-bold text-white tracking-tight">
            {{ isEditing ? 'MODIFY IDENTITY' : 'PROVISION USER' }}
          </h3>
          <button @click="showDrawer = false" class="text-[var(--color-neutral)] hover:text-white transition-transform hover:rotate-90">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <SmartForm 
            :fields="formSchema" 
            :initialData="selectedUser"
            @submit="handleSave"
          />
        </div>
        
        <div class="mt-8 pt-6 border-t border-white/5 text-[10px] text-[var(--color-neutral)] uppercase tracking-[0.3em] text-center">
          Bilyzna Security Protocol v4.0
        </div>
      </div>
    </transition>
    
    <div v-if="showDrawer" @click="showDrawer = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"></div>
  </div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>