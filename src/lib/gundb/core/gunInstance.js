import Gun from 'gun';
import 'gun/sea';  // For authentication
import 'gun/axe';  // For mesh network

// Configuration options for Gun
const config = {
  peers: [
    // 'http://localhost:8765/gun', // HTTP endpoint
    // 'ws://localhost:8765/gun',   // WebSocket endpoint
    'https://gun-manhattan.herokuapp.com/gun', // test peer for global gun
    // Add production peers here
  ],
  localStorage: true, // Enable localStorage for client-side persistence
  // radisk: true,      // Enable RadiskDB for better data persistence
};

// Create a single Gun instance
const gun = Gun(config);

// Export the gun instance as default
export default gun;

// Export a function to get a scoped gun instance
export function getScopedGun(scope) {
  return gun.get(scope);
}

// Get data from Gun
// @param {string} path - Path to the data
// @returns {Promise<any>}
export function gunGet(path) {
  return new Promise((resolve, reject) => {
    gun.get(path).once((data, key) => {
      if (data === undefined) {
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });
}

// Put data into Gun
// @param {string} path - Path to store the data
// @param {any} data - Data to store
// @returns {Promise<any>}
export function gunPut(path, data) {
  return new Promise((resolve, reject) => {
    gun.get(path).put(data, (ack) => {
      if (ack.err) {
        reject(ack.err);
      } else {
        resolve(ack);
      }
    });
  });
}
