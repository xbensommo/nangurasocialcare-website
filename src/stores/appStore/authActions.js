// authAction.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  updatePassword,
  setPersistence,
  browserLocalPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
//OAuth methods
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
OAuthProvider // For general OAuth like Apple or Microsoft
} from 'firebase/auth';

import { auth } from '@/firebase';
import { CACHE_CONFIG, ROLE_CONFIG } from '../configs.js'

import { createShardedActions } from '@xbensommo/shard-provider';
import shardProvider from '@/stores/appStore/provider.js';

/**
* Enterprise-grade Auth Error Mapping
*/
const handleAuthError = (error) => {
  const errorMap = {
    'auth/user-not-found': 'No user found with this email.',
    'auth/wrong-password': 'Invalid email or password.',
    'auth/invalid-credential': 'Invalid login credentials.',
    'auth/too-many-requests': 'Account temporarily locked due to many failed attempts.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/email-already-in-use': 'This email address is already registered.',
    'auth/weak-password': 'The password is too weak.',
    'auth/requires-recent-login': 'Security: Please re-authenticate to perform this action.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials. Please log in using your original method.',
    'auth/popup-closed-by-user': 'Login cancelled. The popup was closed before finishing.',
    'auth/cancelled-popup-request': 'Only one login popup can be open at a time.',
    'auth/popup-blocked': 'Login popup was blocked by your browser. Please enable popups for this site.',
    'auth/operation-not-allowed': 'This social login method is not enabled in the Firebase Console.',
  };

  return { 
    code: error.code, 
    message: errorMap[error.code] || error.message || 'Authentication failed.' 
  };
};

export const useAuthActions = (state, authCollections) => {
  const primaryAuthCollection = 'users';
  const profileActions = createShardedActions(primaryAuthCollection, state, shardProvider);
/**
* Check if cache is still valid (1 hour TTL)
* @returns {boolean}
*/
  const isCacheValid = () =>{
    if (!state._profileCache.timestamp) return false;
    const age = Date.now() - state._profileCache.timestamp;
    return age < CACHE_CONFIG.PROFILE_TTL;
  };
/**
* Unified Async Wrapper
*/
  const withAsyncAction = async (action) => {
    state.loading.value = true;
    state.error.value = null;
    try {
      const result = await action();
      return { success: true, data: result };
    } catch (error) {
      const formattedError = handleAuthError(error);
      state.error.value = formattedError.message;
      throw formattedError;
    } finally {
      state.loading.value = false;
    }
  };
// ------------------------------------------------------------------------
// AUTH INITIALIZATION - CALL ONCE AT APP BOOTSTRAP
// ------------------------------------------------------------------------



// ------------------------------------------------------------------------
// CORE SYNC LOGIC WITH 1-HOUR CACHING
// ------------------------------------------------------------------------

/**
* Synchronize user session with 1-hour cache
* @param {Object} firebaseUser - Firebase auth user
* @param {boolean} forceRefresh - Bypass cache and force fresh data
* @returns {Object} Synced user data
*/
  const syncUserSession = async(firebaseUser, forceRefresh = false) => {
    if (!firebaseUser) {
      state.currentUser.value = null;
      return null;
    }

    const now = Date.now();

// ======================================================================
// CACHE CHECK - 1 HOUR TTL
// ======================================================================
    if (!forceRefresh && isCacheValid() && state._profileCache.value.uid === firebaseUser.uid) {
      console.debug(`[Cache] Using cached profile (${cacheAgeMinutes} minutes old)`);
      state.currentUser.value = state._profileCache.value.data;
      return state.currentUser.value;
    }

    console.debug('[Sync] Cache miss or expired - fetching fresh data');

    try {
// --------------------------------------------------------------------
// PARALLEL DATA FETCHING
// --------------------------------------------------------------------

// Only force token refresh if explicitly requested OR token is old
      let tokenResult;
      if (forceRefresh) {
        tokenResult = await firebaseUser.getIdTokenResult(true);
      } else {
// Check if we need token refresh based on last refresh time
        tokenResult = await firebaseUser.getIdTokenResult();

// Check token age from decoded claims
const tokenIssuedAt = tokenResult.claims.iat * 1000; // Convert to ms
if (now - tokenIssuedAt > CACHE_CONFIG.TOKEN_REFRESH_INTERVAL) {
  console.debug('[Token] Token older than 45 minutes, refreshing...');
  tokenResult = await firebaseUser.getIdTokenResult(true);
}
}

// Fetch profile in parallel with token
const profile = await profileActions.getById(firebaseUser.uid);

// ====================================================================
// USER DATA ASSEMBLY
// ====================================================================
const userData = {
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  emailVerified: firebaseUser.emailVerified,
  displayName: firebaseUser.displayName || profile?.displayName,
  photoURL: firebaseUser.photoURL,

// Profile data from Firestore
  ...profile,

// Role with fallback
  role: profile?.role || ROLE_CONFIG.roles.USER,

// Custom claims with all supported roles
  claims: {
    [ROLE_CONFIG.roles.ADMIN]: !!tokenResult.claims[ROLE_CONFIG.roles.ADMIN],
    [ROLE_CONFIG.roles.BIDDER]: !!tokenResult.claims[ROLE_CONFIG.roles.BIDDER],
    [ROLE_CONFIG.roles.SUPPORT]: !!tokenResult.claims[ROLE_CONFIG.roles.SUPPORT],
    [ROLE_CONFIG.roles.AUDITOR]: !!tokenResult.claims[ROLE_CONFIG.roles.AUDITOR],
  },

// Metadata
  lastSync: now,
  lastTokenRefresh: now,
  sessionStart: state._sessionStart.value,
};

// ====================================================================
// UPDATE CACHE (1 HOUR TTL)
// ====================================================================
state._profileCache.value = {
  uid: firebaseUser.uid,
  timestamp: now,
  data: userData,
};

// Update multi-user cache
state._userCache.value.set(firebaseUser.uid, {
  data: userData,
  timestamp: now,
});

// Enforce cache size limit
if (state._userCache.value.size > CACHE_CONFIG.MAX_CACHE_SIZE) {
  const oldestKey = state._userCache.value.keys().next().value;
  state._userCache.value.delete(oldestKey);
}

state.currentUser.value = userData;
return userData;

} catch (error) {
  console.error('[Sync] Failed to sync user session:', error);

// Fallback to cache if available, even if expired
  if (state._profileCache.value.data) {
    console.warn('[Sync] Using stale cache as fallback');
    state.currentUser.value = state._profileCache.value.data;
    return state.currentUser.value;
  }

  throw error;
}
};

/**
* Setup background tasks for cache management and token refresh
* 
*/
const _setupBackgroundTasks = () => {
// Clear existing timers
  _cleanupTimers();

// ----------------------------------------------------------------------
// Periodic token refresh (every 45 minutes)
// ----------------------------------------------------------------------
  state._tokenRefreshTimer.value = setInterval(async () => {
    if (!state.currentUser.value) return;

    console.debug('[Background] Refreshing token...');
    try {
      await state.currentUser.value.getIdTokenResult(true);
      console.debug('[Background] Token refreshed successfully');
    } catch (error) {
      console.error('[Background] Token refresh failed:', error);
    }
  }, CACHE_CONFIG.TOKEN_REFRESH_INTERVAL);

// ----------------------------------------------------------------------
// Periodic cache cleanup (every hour)
// ----------------------------------------------------------------------
  state._cacheCleanupTimer.value = setInterval(() => {
    _cleanupExpiredCache();
  }, CACHE_CONFIG.PROFILE_TTL);
};

/**
* Clean up expired cache entries
* @private
*/
const _cleanupExpiredCache = () => {
  const now = Date.now();
  const expiryThreshold = now - CACHE_CONFIG.PROFILE_TTL;

// Clean multi-user cache
  for (const [uid, entry] of state._userCache.value.entries()) {
    if (entry.timestamp < expiryThreshold) {
      state._userCache.value.delete(uid);
    }
  }

// Clean permission cache
  for (const [key, entry] of state._permissionCache.value.entries()) {
    if (entry.timestamp < expiryThreshold) {
      state._permissionCache.value.delete(key);
    }
  }

  console.debug(`[Cache] Cleanup complete. Users: ${state._userCache.value.size}, Permissions: ${state._permissionCache.value.size}`);
}

/**
* Clear all caches
* @private
*/
const _clearCache = () => {
  state._profileCache.value = { uid: null, timestamp: 0, data: null };
  state._userCache.value.clear();
  state._permissionCache.value.clear();
  console.debug('[Cache] All caches cleared');
}

/**
* Clean up all background timers
* @private
*/
const _cleanupTimers = () => {
  if (state._tokenRefreshTimer.value) {
    clearInterval(state._tokenRefreshTimer.value);
    state._tokenRefreshTimer.value = null;
  }
  if (state._cacheCleanupTimer.value) {
    clearInterval(state._cacheCleanupTimer.value);
    state._cacheCleanupTimer.value = null;
  }
}

// ------------------------------------------------------------------------
// ROLE & PERMISSION MANAGEMENT
// ------------------------------------------------------------------------

/**
* Check if user has required role with caching
* @param {string|string[]} requiredRoles - Role(s) to check
* @param {string} routeName - Route name for permission caching
* @returns {boolean} Whether user has permission
*/
const checkPermission = (requiredRoles, routeName = '') => {
  if (!state.currentUser.value) return false;

// Admin override
  if (state.currentUser.value.role === ROLE_CONFIG.roles.ADMIN) return true;

// Create cache key
  const cacheKey = `${state.currentUser.value.uid}:${routeName}`;

// Check permission cache
  const cached = state._permissionCache.value.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.PROFILE_TTL) {
    return cached.allowed;
  }

// Evaluate permission
  let allowed = false;
  if (Array.isArray(requiredRoles)) {
    allowed = requiredRoles.includes(state.currentUser.value.role);
  } else {
    allowed = state.currentUser.value.role === requiredRoles;
  }

// Cache the result
  state._permissionCache.value.set(cacheKey, {
    allowed,
    timestamp: Date.now(),
  });

  return allowed;
};

/**
* Get default destination for current user role
* @returns {string} Route path
*/
const getDefaultDestination = () =>{
  if (!state.currentUser.value?.role) return '/';
  return ROLE_CONFIG.defaultDestinations[state.currentUser.value.role] || '/my';
}

/**
* Force refresh user claims
* @returns {Promise<boolean>} Success status
*/
const refreshUserClaims =  async() => {
  if (!state.currentUser.value) return false;

  try {
    console.debug('[Claims] Force refreshing claims...');
    await state.currentUser.value.getIdTokenResult(true);
    await syncUserSession(state.currentUser.value, true);
    console.debug('[Claims] Refresh complete');
    return true;
  } catch (error) {
    console.error('[Claims] Refresh failed:', error);
    return false;
  }
}

// ------------------------------------------------------------------------
// CLEANUP & DESTRUCTOR
// ------------------------------------------------------------------------

/**
* Clean up all resources
* @description Call this when app unmounts or user logs out
*/
const cleanup= () =>{
  console.debug('[Cleanup] Releasing resources...');

// Unsubscribe from auth listener
  if (state._authUnsubscribe.value) {
    state._authUnsubscribe.value();
    state._authUnsubscribe.value = null;
  }

// Clear all timers
  _cleanupTimers();

// Clear caches
  _clearCache();

// Reset state
  state.currentUser.value = null;
  state.authInitialized.value = false;
  state.error.value = null;

  console.debug('[Cleanup] Complete');
};

/**
* Social Auth Provider Factory
* @param {string} providerId - 'google', 'facebook', or 'apple'
*/
const getProvider = (providerId) => {
  switch (providerId.toLowerCase()) {
  case 'google':
    const google = new GoogleAuthProvider();
    google.addScope('profile');
    google.addScope('email');
    return google;
  case 'facebook':
    return new FacebookAuthProvider();
  default:
    return new OAuthProvider(providerId);
  }
};

return {
/**
* Initialize Firebase auth listener
* @description Sets up SINGLE auth listener for entire app lifecycle
* @returns {Promise} Resolves with user when auth state is determined
*/
  initAuthListener() {
// Guard: Prevent duplicate initialization
    if (state.authInitialized.value) {
      console.debug('[Auth] Already initialized, skipping');
      return Promise.resolve(state.currentUser.value);
    }

// Clean up existing listener if any
    if (state._authUnsubscribe.value) {
      state._authUnsubscribe.value();
      state._authUnsubscribe.value = null;
    }

    console.debug('[Auth] Initializing auth listener...');
    state._sessionStart.value = Date.now();

    return new Promise((resolve) => {
      state._authUnsubscribe.value = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
// Force refresh on first login only
            const forceRefresh = !state.authInitialized.value;
            await syncUserSession(firebaseUser, forceRefresh);

// Setup background maintenance tasks
            _setupBackgroundTasks();
          } else {
            state.currentUser.value = null;
            _clearCache();
          }
        } catch (error) {
          console.error('[Auth] Sync error:', error);
          state.error.value = error.message;
        } finally {
// Mark as initialized (ONLY ONCE)
          if (!state.authInitialized.value) {
            state.authInitialized.value = true;
            state.loading.value = false;
          }
          resolve(firebaseUser);
        }
      });
    });
  },
  syncUserSession, checkPermission, refreshUserClaims,

  async login(email, password) {
    return withAsyncAction(async () => {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return await syncUserSession(cred.user, true);
    });
  },

  async signUp(email, password, profileData = {}) {
    return withAsyncAction(async () => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await profileActions.setById(cred.user.uid, {
        ...profileData,
        role: 'user',
        email: cred.user.email,
        createdAt: new Date()
      });

      return await syncUserSession(cred.user, true);
    });
  },

  async signUpAdmin(email, password, profileData, secret) {
    if (secret !== 'nam-admin-2026-hq') {
      throw { code: 'security/invalid-secret', message: 'Unauthorized provisioning attempt.' };
    }

    return withAsyncAction(async () => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await profileActions.setById(cred.user.uid, {
        ...profileData,
        role: 'admin',
        email: cred.user.email,
        createdAt: new Date()
      });

      return await syncUserSession(cred.user, true);
    });
  },

  async logout() {
    return withAsyncAction(async () => {
      await signOut(auth);
      state.currentUser.value = null;
//window.location.href = '/'
      cleanup()
      console.clear()
    });
  },

  async updateProfile(profileData) {
    return withAsyncAction(async () => {
      if (!auth.currentUser) throw new Error('No active session.');

// Update Firebase Auth display info if provided
      if (profileData.displayName) {
        await updateAuthProfile(auth.currentUser, { displayName: profileData.displayName });
      }

// Update Firestore Sharded Profile
      await profileActions.update(auth.currentUser.uid, { 
        ...profileData, 
        updatedAt: new Date() 
      });

      return await syncUserSession(auth.currentUser);
    });
  },

  async changePassword(currentPassword, newPassword) {
    return withAsyncAction(async () => {
      const user = auth.currentUser;
      if (!user?.email) throw new Error('Re-authentication required.');

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
    });
  },

  async sendPasswordReset(email) {
    return withAsyncAction(async () => {
      await sendPasswordResetEmail(auth, email);
    });
  },

  async resendVerificationEmail() {
    return withAsyncAction(async () => {
      if (!auth.currentUser) throw new Error('No active user.');
      await sendEmailVerification(auth.currentUser);
    });
  },

/**
* Hardened KYC Upload Process
* @param {File} file - The document file from the input
* @param {Function} onProgress - Optional callback for UI progress bars
*/
  async uploadKYC(file, onProgress) {
    return withAsyncAction(async () => {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required for KYC upload.");

// 1. Generate a secure path: kyc/{uid}/{timestamp}_{filename}
      const extension = file.name.split('.').pop();
      const storagePath = `kyc/${user.uid}/id_verification.${extension}`;
      const storageRef = ref(storage, storagePath);

// 2. Upload with metadata for security rules
      const uploadTask = uploadBytesResumable(storageRef, file, {
        customMetadata: { 'uid': user.uid, 'type': 'identity_doc' }
      });

// 3. Monitor Progress
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      });

      await uploadTask;
      const downloadURL = await getDownloadURL(storageRef);

// 4. Update the Sharded Profile with the reference
      await profileActions.update(user.uid, {
        kycStatus: 'pending',
        kycDocumentUrl: downloadURL,
        kycSubmittedAt: new Date()
      });

// 5. Re-sync the local state
      return await syncUserSession(user);
    });
  },

/**
* Get current user with type-safe role
* @returns {Object|null} User object with guaranteed role field
*/
  getUser() {
    if (!state.currentUser.value) return null;
    return {
      ...state.currentUser.value,
      role: state.currentUser.value.role || ROLE_CONFIG.roles.USER,
    };
  },

/**
* Check if user has specific role
* @returns {Function} (role) => boolean
*/
  hasRole (role) {
    if (!state.currentUser.value) return false;
    if (Array.isArray(role)) {
      return role.includes(state.currentUser.value.role);
    }
    return state.currentUser.value.role === role;
  },

/**
* Check if user has permission for route
* @returns {Function} (routeName) => boolean
*/
  canAccessRoute(routeName){
    if (!state.currentUser.value) return false;

// Admin has universal access
    if (state.currentUser.role === ROLE_CONFIG.roles.ADMIN) return true;

    const allowedRoles = ROLE_CONFIG.routePermissions[routeName];
if (!allowedRoles) return true; // Public route

return allowedRoles.includes(state.currentUser.value.role);
},

/**
* Get user's role display name
* @returns {string} Human-readable role name
*/
userRoleDisplay () {
  if (!state.currentUser.value?.role) return 'Guest';
  return ROLE_CONFIG.displayNames[state.currentUser.value.role] || state.currentUser.value.role;
},



/**
* Get cache age in minutes for debugging
* @returns {number}
*/
cacheAgeMinutes(){
  if (!state._profileCache.timestamp) return 0;
  return Math.round((Date.now() - state._profileCache.timestamp) / 60000);
},

// ============================================
// TOKEN REFRESH - ONLY WHEN NEEDED
// ============================================
async refreshClaimsIfNeeded() {
  if (!state.currentUser?.uid) return false;

// Check token age (refresh if older than 10 minutes)
  const tokenAge = Date.now() - (state.currentUser._cachedAt || 0);
  if (tokenAge < 10 * 60 * 1000) {
return true; // Token still fresh
}

try {
  const tokenResult = await auth.currentUser.getIdTokenResult(true);
  const updated = {
    ...state.currentUser.value,
    claims: {
      admin: !!tokenResult.claims.admin,
      bidder: !!tokenResult.claims.bidder,
      support: !!tokenResult.claims.support,
      auditor: !!tokenResult.claims.auditor
    },
    _cachedAt: Date.now()
  };

  state.currentUser.value = updated;
  state._profileCache.data = updated;
  state._profileCache.timestamp = Date.now();

  return true;
} catch (error) {
  console.error('Token refresh failed:', error);
  return false;
}
},

// ============================================
// CLEANUP ON APP UNMOUNT
// ============================================
cleanupAuth() {
/*if (state._authUnsubscribe) {
state._authUnsubscribe();
state._authUnsubscribe = null;
}*/
},

/**
* Independent Social Login Method
* Supports Google, Facebook, and generic OAuth
* <i class="fa fa-shield-halved"></i>
*/
async loginWithSocial(providerName) {
  return withAsyncAction(async () => {
    const authProvdr = getProvider(providerName);

// 1. Set persistence to local first
    await setPersistence(auth, browserLocalPersistence);

// 2. Trigger Popup (Recommended for web)
    const result = await signInWithPopup(auth, authProvdr);
    const user = result.user;

// 3. Check if this is a new user to initialize their Firestore profile
    const profile = await profileActions.getById(user.uid);

    if (!profile) {
      console.debug(`[Social] Provisioning new profile for ${user.email}`);
      await profileActions.setById(user.uid, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: ROLE_CONFIG.roles.USER,
        authProvdr: providerName,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

// 4. Finalize session sync
    return await syncUserSession(user, true);
  });
}

};

};