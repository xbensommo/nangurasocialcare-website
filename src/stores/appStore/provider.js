import { FireShardProvider } from '@xbensommo/shard-provider';
import { db } from '@/firebase';

import { toast, Toaster } from 'vue-sonner';

import { getFriendlyMessage } from '@xbensommo/shard-provider';
const nonSharded = [
  "users", "settings", "metrics", "admin_notificatoins",
  "activityLog", "sessions", "slots", "clients", "services", "faq"
];
// Initialize the provider once
const shardProvider = new FireShardProvider({
  db: db,
  nonShardedCollections: nonSharded,

  onError: (err) => {
    // 1. Log the real error to your telemetry (e.g., Sentry)
    console.error(`[Internal Log] ${err.collection}:`, err.message);
    // 2. Show the friendly version to the user
    toast.error('Action Failed', {
      description: getFriendlyMessage(err),
      duration: 8000,
    });
  }
});

export default shardProvider;