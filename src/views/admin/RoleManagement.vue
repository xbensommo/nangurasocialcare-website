<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/appStore';
import SmartTable from '@/components/abstract/SmartTable.vue';
// import { useNotification } from '@/composables/useNotification';


/**
 * @title Role & Permissions Matrix
 * @description Advanced management of authorization tiers using a 2D grid.
 */

const store = useAppStore();
const notification = useNotification();

const roles = ref([
  { id: 1, name: 'Super Admin', slug: 'admin', userCount: 2, color: '#1C72AB' },
  { id: 2, name: 'Content Editor', slug: 'editor', userCount: 5, color: '#C4C7D1' },
  { id: 3, name: 'Support Agent', slug: 'support', userCount: 12, color: '#6E7585' }
]);

const selectedRole = ref(roles.value[0]);

// Define the modules/collections to manage permissions for
const modules = [
  
  { name: 'users', slug: 'users' },
  
  { name: 'sessions', slug: 'sessions' },
  
  { name: 'notes', slug: 'notes' },
  
  { name: 'activityLogs', slug: 'activitylogs' },
  
  { name: 'slots', slug: 'slots' },
  
  { name: 'notifications', slug: 'notifications' },
  
  { name: 'Users', slug: 'users' },
  { name: 'Settings', slug: 'settings' }
];

// Matrix State: [moduleSlug][action] = boolean
const matrix = ref({});

const initMatrix = () => {
  modules.forEach(m => {
    matrix.value[m.slug] = { create: true, read: true, update: false, delete: false };
  });
};

onMounted(() => {
  initMatrix();
});

const selectRole = (role) => {
  selectedRole.value = role;
  // In production, you would fetch permissions for this role from the store here
  notification.showNotification(`Loaded permissions for ${role.name}`);
};

const togglePermission = (module, action) => {
  matrix.value[module][action] = !matrix.value[module][action];
};

const savePermissions = async () => {
  store.showLoading();
  try {
    // await store.saveRolePermissions(selectedRole.value.id, matrix.value);
    notification.showNotification('Permissions Matrix synchronized successfully! ✨');
  } finally {
    store.hideLoading();
  }
};
</script>

<template>
  <div class="p-8 space-y-10 bg-[var(--color-background)] min-h-screen text-[var(--color-text)]">
    
    <header class="flex justify-between items-center" data-aos="fade-down">
      <div>
        <h1 class="text-3xl font-bold text-white tracking-tighter uppercase font-space">
          Security <span class="text-[var(--color-primary)]">Matrix</span>
        </h1>
        <p class="text-[var(--color-neutral)] text-sm mt-1">Define granular authorization tiers for the entire ecosystem.</p>
      </div>
      <button @click="savePermissions" class="btn-primary px-10 py-4 rounded-2xl shadow-[0_0_25px_rgba(28,114,171,0.2)]">
        <i class="fas fa-shield-check mr-2"></i> DEPLOY PERMISSIONS
      </button>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      <aside class="lg:col-span-1 space-y-4" data-aos="fade-right">
        <h3 class="text-xs font-bold text-[var(--color-neutral)] uppercase tracking-[0.2em] mb-4">Select Role</h3>
        <div v-for="role in roles" :key="role.id" 
             @click="selectRole(role)"
             :class="selectedRole.id === role.id ? 'border-[var(--color-primary)] bg-white/5 shadow-lg' : 'border-white/5 bg-transparent'"
             class="p-5 rounded-2xl border cursor-pointer transition-all hover:bg-white/[0.03] group">
          <div class="flex items-center gap-4">
            <div class="w-2 h-8 rounded-full" :style="{ backgroundColor: role.color }"></div>
            <div>
              <p class="text-sm font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">{{ role.name }}</p>
              <p class="text-[10px] text-[var(--color-neutral)] uppercase tracking-widest">{{ role.userCount }} Members</p>
            </div>
          </div>
        </div>
        
        <button class="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[var(--color-neutral)] text-xs font-bold uppercase hover:border-[var(--color-primary)] hover:text-white transition-all">
          <i class="fas fa-plus mr-2"></i> Create New Role
        </button>
      </aside>

      <main class="lg:col-span-3 glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl" data-aos="fade-up">
        <div class="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">Access Matrix: {{ selectedRole.name }}</h2>
            <p class="text-xs text-[var(--color-neutral)] mt-1 uppercase tracking-widest">Toggle permissions per module</p>
          </div>
          <div class="flex gap-4 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-tighter">
             <span class="flex items-center gap-2"><i class="fas fa-circle text-[var(--color-primary)] text-[6px]"></i> Allowed</span>
             <span class="flex items-center gap-2"><i class="fas fa-circle text-white/10 text-[6px]"></i> Denied</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-widest border-b border-white/5">
                <th class="px-8 py-6">Module Name</th>
                <th class="px-4 py-6 text-center">Create</th>
                <th class="px-4 py-6 text-center">Read</th>
                <th class="px-4 py-6 text-center">Update</th>
                <th class="px-4 py-6 text-center">Delete</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="m in modules" :key="m.slug" class="hover:bg-white/[0.01] transition-colors group">
                <td class="px-8 py-5">
                  <p class="text-sm font-bold text-white uppercase font-space tracking-tight">{{ m.name }}</p>
                  <p class="text-[9px] text-[var(--color-neutral)] italic">api/v1/{{ m.slug }}</p>
                </td>
                
                <td v-for="action in ['create', 'read', 'update', 'delete']" :key="action" class="px-4 py-5 text-center">
                  <button @click="togglePermission(m.slug, action)" 
                          :class="matrix[m.slug]?.[action] ? 'bg-[var(--color-primary)] border-[var(--color-primary)] shadow-[0_0_15px_rgba(28,114,171,0.4)]' : 'bg-white/5 border-white/10'"
                          class="w-6 h-6 rounded-md border transition-all duration-300 transform active:scale-75 inline-flex items-center justify-center">
                    <i v-if="matrix[m.slug]?.[action]" class="fas fa-check text-[10px] text-white"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="p-6 bg-white/[0.02] border-t border-white/5 text-center">
           <p class="text-[10px] text-[var(--color-neutral)] uppercase tracking-[0.4em]">Secure Access Management Protocol Active</p>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Scoped luxury scrollbar for the table */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
</style>