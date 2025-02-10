<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isAuthenticated } from '$lib/gundb';
  import { goto } from '$app/navigation';
  import authService from '$lib/gundb/services/auth';

  // Public routes that don't require authentication
  const publicRoutes = ['/welcome', '/auth/login', '/auth/signup'];

  // Protected routes that require authentication
  const protectedRoutes = ['/questions', '/answers'];

  onMount(async () => {
    // Check for existing session
    await authService.checkAuth();
    
    // Subscribe to route changes
    return page.subscribe(($page) => {
      const currentPath = $page.url.pathname;
      const isPublicRoute = publicRoutes.some(route => 
        currentPath.startsWith(route)
      );
      const isProtectedRoute = protectedRoutes.some(route =>
        currentPath.startsWith(route)
      );

      // Only redirect if we're not already going to the target route
      if ($isAuthenticated) {
        // If on root or public route, go to questions
        if (currentPath === '/' || isPublicRoute) {
          goto('/questions');
        }
      } else {
        // If not authenticated and on protected route, go to welcome
        if (isProtectedRoute) {
          goto('/welcome');
        }
      }
    });
  });
</script>

<slot />
