// Export core
export { default as gun, getScopedGun, gunGet, gunPut } from './core/gunInstance';

// Export services
export { default as authService } from './services/auth';
export { qaService } from './services/qa';
export { default as userService } from './services/user';

// Export stores
export { isAuthenticated, currentUser, authStore } from './stores/auth';
