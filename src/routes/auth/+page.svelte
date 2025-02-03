<script>
  import FunButton from '$lib/components/FunButton.svelte';
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4 bg-base-100">
  <div class="w-full max-w-sm space-y-12 text-center">
    <!-- Welcome Text -->
    <div class="space-y-8">
      <h1 class="text-6xl font-irish-grover text-primary">Welcome!</h1>
      <p class="text-2xl text-base-content">Do you have a LEST account?</p>
    </div>

    <!-- Buttons -->
    <div class="space-y-4">
      <FunButton 
        variant="primary" 
        size="lg" 
        block
      >
        Log In
      </FunButton>
      
      <FunButton 
        variant="secondary" 
        size="lg" 
        block
      >
        Sign Up
      </FunButton>
    </div>

    <!-- Footer Text -->
    <div class="pt-12">
      <p class="text-base text-base-content/70">
        Your account is created/relayed according to nostr protocol
      </p>
    </div>
  </div>
</div>

<style>
  /* Custom font styles if needed */
  h1 {
    font-family: 'Irish Grover', system-ui, sans-serif;
  }
</style>
