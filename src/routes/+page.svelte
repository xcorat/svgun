<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { isAuthenticated } from '$lib/gundb';

  /** @type {boolean} */
  let loading = true;

  onMount(async () => {
    // If user is authenticated, go to questions page
    if ($isAuthenticated) {
      goto('/questions');
    } else {
      // Not authenticated, show welcome screen
      goto('/welcome');
    }
    loading = false;
  });
</script>

{#if loading}
  <div class="min-h-screen flex items-center justify-center">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
{/if}
