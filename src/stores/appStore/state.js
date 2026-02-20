import { ref } from 'vue';

/**
 * These values are injected at build-time via your template engine.
 * We ensure they are rendered as a clean array of strings.
 */
const collections = [
  
    'users',
  
    'sessions', 'services', 'faq', 'clients',
  
    'notes',
  
    'activitylogs',
  
    'slots',
  
    'notifications',
  
    'users'
  
];

export default function useAppStoreState() {
  // 1. Define Global UI and Auth State
  const state = {
    loading: ref(false),           // Global action loading state
    error: ref(null),             // Global error notification object
    currentUser: ref(null),       // Authenticated User Profile
    authInitialized: ref(false),  // Firebase Auth boot check
    isLoading: ref(true),          // Initial App mount loading
    _authUnsubscribe: ref(null),
    _sessionStart: ref(null),

     _profileCache: ref({
      uid: null,
      timestamp: 0,
      data: null,
    }),
    
    // Multi-user cache for tenant environments
    _userCache: ref(new Map()), // uid -> { data, timestamp }
    
    // Role check memoization
    _permissionCache: ref(new Map()), // 'uid:route' -> { allowed, timestamp }
    

    _tokenRefreshTimer: ref(null),
    _cacheCleanupTimer: ref(null),
  };

  /**
   * 2. Automatic Collection State Generation
   * We iterate through our sharded and non-sharded collection names 
   * to build a standardized reactive state for each.
   */
  collections.forEach(col => {
    state[col] = ref({
      items: [],                  // Array of documents (merged across shards)
      itemById: null,             // Buffer for single document fetches
      lastVisible: null,          // Firestore Pagination Cursor
      hasMore: true,              // Is there a next page/shard to walk?
      filters: {},                // Persistent filter values
      activeFilters: {},          // Applied filters for the current query
      aggregatedCount: null,      // Total count from getCountFromServer()
      orderBy: { 
        field: 'createdAt', 
        direction: 'desc' 
      },
      // Logic: Auctions are high-volume, so we use a larger page size
      pageSize: col === 'auctions' ? 35 : 15, 
      shardDate: new Date(),      // Reference date for sharding logic
      search: { 
        results: [], 
        isActive: false 
      }
    });
  });

  return state;
}