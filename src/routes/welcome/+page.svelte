<script>
  import FunButton from '$lib/components/FunButton.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  
  $: currentStep = Number($page.url.searchParams.get('step') || '1');

  function goToNextStep() {
    goto('/welcome?step=2');
  }

  function goToAuth() {
    goto('/auth');
  }
</script>

<div class="h-screen w-screen relative overflow-hidden">
  <!-- Background Image -->
  <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
       style="background-image: url('/images/welcome-bg.png');">
  </div>
  
  {#if currentStep === 1}
    <!-- Content Overlay -->
    <div class="relative h-full w-full flex flex-col justify-between py-16">
      <div class="w-full bg-base-100/30 backdrop-blur-sm">
        <h1 class="font-irish-grover text-secondary hero-content tracking-wider text-center flex items-center justify-center text-emboss">
          Let's Eat
        </h1>
      </div>
      
      <FunButton 
        size="lg" 
        className="text-4xl transform hover:scale-105 transition-transform mx-auto mb-16"
        on:click={goToNextStep}
      >
        Shit !
      </FunButton>
    </div>
  {:else if currentStep === 2}
    <div class="relative h-full w-full flex flex-col justify-between bg-base-100">
      <div class="container mx-auto px-6 pt-16">
        <h2 class="font-irish-grover text-primary text-3xl">
          Create an online profile by answering questions ...
        </h2>
      </div>
      
      <div class="container mx-auto px-6 pb-16 flex flex-col items-center gap-4">
        <FunButton 
          size="lg" 
          className="text-2xl transform hover:scale-105 transition-transform"
          on:click={() => goto('/auth/signup')}
        >
          Create Account
        </FunButton>
        
        <button
          class="btn btn-link btn-sm font-irish-grover"
          on:click={() => goto('/auth/login')}
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.font-irish-grover) {
    font-family: 'Irish Grover', cursive;
  }
  
  .text-emboss {
    text-shadow: 
      -1px -1px 1px rgba(255,255,255,0.2),
      1px 1px 1px rgba(0,0,0,0.4),
      3px 3px 5px rgba(0,0,0,0.2);
  }

  h1 {
    font-size: clamp(6rem, 15vw, 12rem);
  }
</style>
