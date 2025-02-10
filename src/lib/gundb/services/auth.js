import gun from '../core/gunInstance';
import { authStore } from '../stores/auth';

/**
 * Service for handling Gun authentication operations
 * @class AuthService
 */
class AuthService {
  constructor() {
    /** @type {import('gun').User} */
    this.user = gun.user();
  }

  /**
   * Create a new user
   * @param {string} username - User's username/alias
   * @param {string} password - User's password
   * @returns {Promise<import('../core/types').GunAck>}
   */
  async createUser(username, password) {
    return new Promise((resolve, reject) => {
      this.user.create(username, password, (ack) => {
        if (ack.err) {
          reject(new Error(ack.err));
        } else {
          resolve(ack);
        }
      });
    });
  }

  /**
   * Check if there's an existing authenticated session
   * @returns {Promise<boolean>}
   */
  async checkAuth() {
    return new Promise((resolve) => {
      // Check if we have a user session
      this.user.recall({ sessionStorage: true }, (ack) => {
        if (!ack.err && this.user.is) {
          // Update auth store with current user
          authStore.setUser(this.user);
          resolve(true);
        } else {
          authStore.reset();
          resolve(false);
        }
      });
    });
  }

  /**
   * Log in a user
   * @param {string} username - User's username/alias
   * @param {string} password - User's password
   * @returns {Promise<import('../core/types').GunAck>}
   */
  async login(username, password) {
    authStore.setLoading(true);
    try {
      const ack = await new Promise((resolve, reject) => {
        this.user.auth(username, password, (ack) => {
          if (ack.err) {
            reject(new Error(ack.err));
          } else {
            resolve(ack);
          }
        });
      });

      // Update auth store with logged in user
      authStore.setUser(this.user);
      return ack;
    } finally {
      authStore.setLoading(false);
    }
  }

  /**
   * Log out the current user
   * @returns {Promise<void>}
   */
  async logout() {
    return new Promise((resolve) => {
      this.user.leave();
      authStore.reset();
      resolve();
    });
  }

  /**
   * Get the current authenticated user
   * @returns {import('../core/types').GunUser|null} The current user or null
   */
  getCurrentUser() {
    return this.user.is;
  }

  /**
   * Check if a user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
}

// Export a singleton instance
export default new AuthService();
