# AppStore System Documentation
> **Enterprise Sharded Pinia + Firestore v20.0**
> *Generated on February 12, 2026 at 10:42 AM*

## <i class="fa fa-sitemap"></i> Architecture Overview
This store utilizes a **Dynamic Action Factory**. Instead of manual methods, each collection is wrapped in a standardized CRUD wrapper.

### Directory Structure
```text
stores/appStore/
├── fire-shard/
│   ├── core/index.js      # The Action Engine
│   └── provider/shardprovider.js     # Year-based collection logic
├── state.js            # EJS-generated reactive states
├── index.js            # Store entry point
└── DEVELOPER_GUIDE.md      # You are here
```

## <i class="fa fa-shield-halved"></i> Global State
- `loading`: Boolean (Global UI overlay trigger)
- `currentUser`: Reactive Auth Profile
- `error`: Global error object (Syncs with Vue Sonner)

## <i class="fa fa-book-open"></i> Registry Documentation
### <i class="fa fa-database"></i> Users Registry 

**Architecture:**
- **Store Key:** `store.users`
- **Actions Key:** `store.usersActions`
- **Validation:** `UsersSchema` (Zod)


**Reactive State Structure:**
```javascript
users: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.usersActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.
- `syncAuthProfile(user)`: Links Firebase Auth to Registry doc.

**Implementation Example:**
```javascript
const { usersActions } = useAppStore();

// Create with validation
await usersActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```


---

### <i class="fa fa-database"></i> Sessions Registry *(Sharded)*

**Architecture:**
- **Store Key:** `store.sessions`
- **Actions Key:** `store.sessionsActions`
- **Validation:** `SessionsSchema` (Zod)
- **Shard Logic:** Dynamic pathing via `shardDate` (e.g., `sessions_2026`)

**Reactive State Structure:**
```javascript
sessions: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.sessionsActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.


**Implementation Example:**
```javascript
const { sessionsActions } = useAppStore();

// Create with validation
await sessionsActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```


---

### <i class="fa fa-database"></i> Notes Registry *(Sharded)*

**Architecture:**
- **Store Key:** `store.notes`
- **Actions Key:** `store.notesActions`
- **Validation:** `NotesSchema` (Zod)
- **Shard Logic:** Dynamic pathing via `shardDate` (e.g., `notes_2026`)

**Reactive State Structure:**
```javascript
notes: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.notesActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.


**Implementation Example:**
```javascript
const { notesActions } = useAppStore();

// Create with validation
await notesActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```


---

### <i class="fa fa-database"></i> Activitylogs Registry *(Sharded)*

**Architecture:**
- **Store Key:** `store.activitylogs`
- **Actions Key:** `store.activitylogsActions`
- **Validation:** `ActivitylogsSchema` (Zod)
- **Shard Logic:** Dynamic pathing via `shardDate` (e.g., `activitylogs_2026`)

**Reactive State Structure:**
```javascript
activitylogs: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.activitylogsActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.


**Implementation Example:**
```javascript
const { activitylogsActions } = useAppStore();

// Create with validation
await activitylogsActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```


---

### <i class="fa fa-database"></i> Slots Registry *(Sharded)*

**Architecture:**
- **Store Key:** `store.slots`
- **Actions Key:** `store.slotsActions`
- **Validation:** `SlotsSchema` (Zod)
- **Shard Logic:** Dynamic pathing via `shardDate` (e.g., `slots_2026`)

**Reactive State Structure:**
```javascript
slots: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.slotsActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.


**Implementation Example:**
```javascript
const { slotsActions } = useAppStore();

// Create with validation
await slotsActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```


---

### <i class="fa fa-database"></i> Notifications Registry *(Sharded)*

**Architecture:**
- **Store Key:** `store.notifications`
- **Actions Key:** `store.notificationsActions`
- **Validation:** `NotificationsSchema` (Zod)
- **Shard Logic:** Dynamic pathing via `shardDate` (e.g., `notifications_2026`)

**Reactive State Structure:**
```javascript
notifications: {
  items: [],             // Merged reactive document stream
  itemById: null,        // Focused record buffer
  lastVisible: null,     // Pagination cursor
  hasMore: true,         // Boolean stream end-state
  filters: {},           // Active where() constraints
  pageSize: 15,
  shardDate: new Date(), // Year-based shard pivot
  search: { results: [], isActive: false }
}
```

**Dynamic Factory Actions (`store.notificationsActions`):**
- `fetchInitialPage()`: Bootstraps the collection stream.
- `fetchNextPage()`: Standardized pagination.
- `getById(id)`: Fetches a single document into `itemById`.
- `add(data)`: Validates via Zod and commits to Firestore.
- `update(id, data)`: Atomic document update.
- `delete(id)`: Removal with local state synchronization.
- `exportAllToCSV()`: Enterprise audit trail export.


**Implementation Example:**
```javascript
const { notificationsActions } = useAppStore();

// Create with validation
await notificationsActions.add({ 
  ...formData, 
  createdAt: serverTimestamp() 
});
```




## <i class="fa fa-trophy"></i> Enterprise Standards
1. **Never** mutate `items` directly; always use the `Actions` factory.
2. **Always** use `serverTimestamp()` for date fields.
3. Large assets (Videos/PDFs) must be processed via `AssetManager.vue` to ensure `storage` sync.
4. UI components should bind to `store.loading` to disable buttons during async tasks.


To add a field to any of these forms (e.g., adding "Phone Number" to Registration), you simply update the registerFields array:

JavaScript
// Inside Register.vue
const registerFields = [
  { id: 'displayName', label: 'Full Legal Name', type: 'text', placeholder: 'John Doe' },
  { id: 'phone', label: 'Contact Number', type: 'tel', placeholder: '+264...' }, // NEW FIELD
  { id: 'email', label: 'Electronic Mail', type: 'email', placeholder: 'john@example.com' },
  { id: 'password', label: 'Create Security Key', type: 'password', placeholder: '••••••••' }
];

// Update the Zod Schema accordingly
const schema = z.object({
  displayName: z.string().min(3),
  phone: z.string().regex(/^+?[1-9]d{1,14}$/, "Invalid phone format"), // NEW VALIDATION
  email: z.string().email(),
  password: z.string().min(8),
  terms: z.literal(true)
});

Suggestions for statusActions
Here is how you should structure the statusActions prop in the parent component to make full use of the improvements.

Concept: Instead of just passing key and icon, pass intent (color) and scopes (visibility context).

JavaScript
const userTableActions = [
  { 
    action: 'Verify User', 
    key: 'verified', 
    icon: 'fa-user-check', 
    intent: 'success', // Makes it Green
    scopes: ['pending', 'all'] // Only shows on Pending or All tabs
  },
  { 
    action: 'Ban User', 
    key: 'suspended', 
    icon: 'fa-gavel', 
    intent: 'danger', // Makes it Red
    scopes: ['active', 'verified'] // Can't ban someone who is already pending/banned
  },
  { 
    action: 'Restore', 
    key: 'active', 
    icon: 'fa-arrow-rotate-left', 
    intent: 'primary', // Makes it Blue
    scopes: ['suspended', 'denied'] 
  }
];

Scoped Slots (Included in code): I added <slot :name="'cell-' + col.key" ... />. This is powerful. If you have a column called revenue and you want to format it as currency, you don't need to change the Table component. You just do this in the parent:

HTML
<StatusTable ... >
  <template #cell-revenue="{ item }">
    <span class="text-green-600">{{ item.revenue.toFixed(2) }}</span>
  </template>
</StatusTable>
---
*Documentation automated via Enterprise Registry Generator*
