<script>
  import FunButton from '$lib/components/FunButton.svelte';
</script>

<div class="min-h-screen bg-base-200 p-8">
  <div class="container mx-auto max-w-4xl bg-base-100 rounded-xl shadow-lg p-8 space-y-12">
    <div class="space-y-4">
      <h1 class="text-3xl font-bold">FunButton Test Page</h1>
      <p class="text-lg text-base-content/70">Explore all the variants and sizes of our FunButton component</p>
    </div>

    <!-- Size Variants -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold border-b pb-2">Size Variants</h2>
      <div class="flex flex-wrap gap-6 items-center">
        <div class="flex flex-col items-center gap-2">
          <FunButton size="sm">Small Button</FunButton>
          <span class="text-sm text-base-content/70">Small</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <FunButton size="md">Medium Button</FunButton>
          <span class="text-sm text-base-content/70">Medium</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <FunButton size="lg">Large Button</FunButton>
          <span class="text-sm text-base-content/70">Large</span>
        </div>
      </div>
    </section>

    <!-- Style Variants -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold border-b pb-2">Style Variants</h2>
      <div class="flex flex-wrap gap-6 items-center">
        <div class="flex flex-col items-center gap-2">
          <FunButton variant="primary">Primary Button</FunButton>
          <span class="text-sm text-base-content/70">Primary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <FunButton variant="secondary">Secondary Button</FunButton>
          <span class="text-sm text-base-content/70">Secondary</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <FunButton variant="ghost">Ghost Button</FunButton>
          <span class="text-sm text-base-content/70">Ghost</span>
        </div>
      </div>
    </section>

    <!-- States -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold border-b pb-2">Button States</h2>
      <div class="flex flex-wrap gap-6 items-center">
        <div class="flex flex-col items-center gap-2">
          <FunButton disabled>Disabled Button</FunButton>
          <span class="text-sm text-base-content/70">Disabled</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <FunButton loading>Loading Button</FunButton>
          <span class="text-sm text-base-content/70">Loading</span>
        </div>
      </div>
      <div class="max-w-md w-full mx-auto mt-4">
        <FunButton block>Full Width Button</FunButton>
        <span class="text-sm text-base-content/70 text-center block mt-2">Full Width</span>
      </div>
    </section>

    <!-- Combined Examples -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold border-b pb-2">Combined Examples</h2>
      <div class="flex flex-wrap gap-6 items-center">
        <FunButton variant="secondary" size="sm" loading>
          Small Loading Secondary
        </FunButton>
        <FunButton variant="ghost" size="lg" disabled>
          Large Disabled Ghost
        </FunButton>
      </div>
      <div class="max-w-md mx-auto">
        <FunButton variant="primary" size="lg" block>
          Large Full Width Primary
        </FunButton>
      </div>
    </section>

    <!-- Interactive Demo -->
    <section class="space-y-6">
      <h2 class="text-2xl font-semibold border-b pb-2">Interactive Demo</h2>
      <div class="flex flex-wrap gap-6 items-center justify-center">
        <FunButton
          variant="primary"
          size="lg"
          on:click={() => alert('Button clicked!')}
        >
          Click Me!
        </FunButton>
      </div>
    </section>
  </div>
</div>
