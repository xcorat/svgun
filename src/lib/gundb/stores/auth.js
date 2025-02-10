import { writable, derived } from 'svelte/store';
import gun from '../core/gunInstance';

/**
 * Creates a store for managing authentication state
 * @returns {import('svelte/store').Writable<import('../core/types').AuthState>}
 */
const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    user: null,
    isAuthenticated: false,
    error: null,
    loading: false
  });

  return {
    subscribe,
    /**
     * Set the current user
     * @param {import('../core/types').GunUser|null} user 
     */
    setUser: (user) => update(state => ({ ...state, user, isAuthenticated: !!user })),
    /**
     * Set error message
     * @param {string|null} error 
     */
    setError: (error) => update(state => ({ ...state, error })),
    /**
     * Set loading state
     * @param {boolean} loading 
     */
    setLoading: (loading) => update(state => ({ ...state, loading })),
    /**
     * Reset auth state
     */
    reset: () => set({ user: null, isAuthenticated: false, error: null, loading: false })
  };
};

/** @type {ReturnType<typeof createAuthStore>} */
export const authStore = createAuthStore();

/** @type {import('svelte/store').Readable<import('../core/types').GunUser|null>} */
export const currentUser = derived(
  authStore,
  $authStore => $authStore.user
);

/** @type {import('svelte/store').Readable<boolean>} */
export const isAuthenticated = derived(
  authStore,
  $authStore => $authStore.isAuthenticated
);

// Initialize auth state listener
gun.on('auth', /** @param {import('../core/types').GunAck} ack */(ack) => {
  if (ack.err) {
    authStore.setError(ack.err);
  } else {
    const user = gun.user().is;
    if (user) {
      authStore.setUser(user);
    }
  }
});
