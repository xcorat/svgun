<script>
  import FunButton from '$lib/components/FunButton.svelte';
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex flex-col">
  <!-- Hero Section -->
  <main class="flex-1 container mx-auto px-4 py-12 md:py-24">
    <div class="max-w-3xl mx-auto text-center space-y-8">
      <h1 class="text-4xl md:text-6xl font-bold leading-tight">
        Welcome to SvGun
      </h1>
      <p class="text-xl md:text-2xl text-base-content/70">
        A modern, decentralized application built with SvelteKit and GunDB
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <FunButton 
          variant="primary" 
          size="lg"
          on:click={() => goto('/auth')}
        >
          Get Started
        </FunButton>
        <FunButton variant="ghost" size="lg">
          Learn More
        </FunButton>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
      <!-- Feature 1 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Decentralized</h2>
          <p>Your data stays with you. No central server, no single point of failure.</p>
        </div>
      </div>

      <!-- Feature 2 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Real-time</h2>
          <p>Instant updates and synchronization across all connected peers.</p>
        </div>
      </div>

      <!-- Feature 3 -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Secure</h2>
          <p>End-to-end encryption ensures your data remains private and secure.</p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="footer footer-center p-10 bg-base-200 text-base-content">
    <div>
      <p class="font-bold">
        SvGun {new Date().getFullYear()}
      </p>
      <p>Built with SvelteKit and GunDB</p>
    </div>
  </footer>
</div>

<style>
  /* Add any custom styles here */
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
