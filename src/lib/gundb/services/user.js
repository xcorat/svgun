import gun from '../core/gunInstance';

/**
 * Service for managing user profiles
 * @class UserService
 */
class UserService {
  constructor() {
    /** @type {import('gun').User} */
    this.user = gun.user();
  }

  /**
   * Create or update user profile
   * @param {string} username - Username to create profile for
   * @returns {Promise<void>}
   */
  async createProfile(username) {
    return new Promise((resolve, reject) => {
      const profile = {
        username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.user.get('profile').put(profile, (ack) => {
        if (ack.err) {
          reject(new Error(ack.err));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Get user profile by username
   * @param {string} username - Username to get profile for
   * @returns {Promise<import('../core/types').UserProfile|null>}
   */
  async getProfile(username) {
    return new Promise((resolve) => {
      gun.get(`~@${username}`).once((user) => {
        if (!user) {
          resolve(null);
          return;
        }
        
        gun.get(user.pub).get('profile').once((profile) => {
          resolve(profile);
        });
      });
    });
  }
}

// Export a singleton instance
export default new UserService();
