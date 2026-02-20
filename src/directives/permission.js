import { useAppStore } from '@/stores/appStore'

export const permissionDirective = {
  mounted(el, binding) {
    const store = useAppStore();
    const userRole = store.currentUser?.role || 'guest';
    
    // The value can be a single string 'admin' or an array ['admin', 'seller']
    const requiredRoles = Array.isArray(binding.value) 
      ? binding.value 
      : [binding.value];

    // If the user's role is not in the allowed list, remove the element
    if (!requiredRoles.includes(userRole)) {
      el.parentNode?.removeChild(el);
    }
  }
}