import { ref, reactive, computed } from 'vue';
import { useAppStore}  from '@/stores/appStore'

export function useApi(endpoint) {
  const store = useAppStore();
  
  const items = ref([]);
  const item = ref({}); // For single edit fetching
  const loading = ref(false);
  const error = ref(null);
  
  // Pagination & Sorting State
  const meta = reactive({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });

  const query = reactive({
    search: '',
    sort_by: 'id',
    sort_dir: 'desc',
    page: 1
  });

  // --- ACTIONS ---

  // 1. Fetch List (with Search, Sort, Pagination)
  const fetchItems = async () => {
    loading.value = true;
    error.value = null;

    try {
      console.log(`[API] GET ${endpoint}`, query);
      
      // MOCK NETWORK REQUEST (Replace with Axios)
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      // Mock Data Generation based on endpoint
      items.value = Array.from({ length: meta.per_page }, (_, i) => ({
        id: i + 1 + ((query.page - 1) * meta.per_page),
        name: `Record ${i + 1} from ${endpoint}`,
        email: `user${i}@peyaorganic.com`,
        status: i % 2 === 0 ? 'Active' : 'Inactive',
        role: i % 3 === 0 ? 'Admin' : 'User',
        date: new Date().toLocaleDateString()
      }));

      // Mock Meta
      meta.total = 50; 
      meta.last_page = Math.ceil(50 / meta.per_page);
      
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // 2. CRUD Operations
  const createItem = async (payload) => {
    loading.value = true;
    await new Promise(r => setTimeout(r, 600)); // Mock
    console.log(`[API] POST ${endpoint}`, payload);
    await fetchItems(); // Refresh table
    loading.value = false;
  };

  const updateItem = async (id, payload) => {
    loading.value = true;
    await new Promise(r => setTimeout(r, 600)); // Mock
    console.log(`[API] PUT ${endpoint}/${id}`, payload);
    await fetchItems();
    loading.value = false;
  };

  const deleteItem = async (id) => {
    loading.value = true;
    await new Promise(r => setTimeout(r, 600)); // Mock
    console.log(`[API] DELETE ${endpoint}/${id}`);
    await fetchItems();
    loading.value = false;
  };

  // 3. Event Handlers (Directly linked to SmartTable)
  const handleSort = ({ key, dir }) => {
    query.sort_by = key;
    query.sort_dir = dir;
    fetchItems();
  };

  const handlePageChange = (page) => {
    query.page = page;
    fetchItems();
  };

  const handleSearch = (term) => {
    query.search = term;
    query.page = 1; // Reset to page 1 on search
    fetchItems();
  };

  return {
    items,
    loading,
    error,
    meta,
    query,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    handleSort,
    handlePageChange,
    handleSearch
  };
}