<script>
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import FunButton from '$lib/components/FunButton.svelte';

  $: isLoginPage = $page.url.pathname === '/auth/login';

  function toggleAuthPage() {
    goto(isLoginPage ? '/auth/signup' : '/auth/login');
  }
</script>

<div class="min-h-screen bg-base-100 flex flex-col">
  <!-- Auth toggle button -->
  <div class="absolute top-4 right-4">
    <FunButton
      size="sm"
      variant="ghost"
      on:click={toggleAuthPage}
    >
      {isLoginPage ? 'Sign Up' : 'Sign In'}
    </FunButton>
  </div>

  <!-- Page content -->
  <slot />
</div>
