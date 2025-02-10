<script>
  import FunButton from '$lib/components/FunButton.svelte';
</script>

<div class="container mx-auto p-8 space-y-12">
  <!-- Typography -->
  <section class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-primary">Typography</h2>
    <div class="space-y-2">
      <h1 class="text-5xl font-irish-grover">Heading 1 - Irish Grover (5xl)</h1>
      <h2 class="text-4xl font-irish-grover">Heading 2 - Irish Grover (4xl)</h2>
      <h3 class="text-3xl font-irish-grover">Heading 3 - Irish Grover (3xl)</h3>
      <h4 class="text-2xl font-irish-grover">Heading 4 - Irish Grover (2xl)</h4>
      <h5 class="text-xl font-irish-grover">Heading 5 - Irish Grover (xl)</h5>
      <h6 class="text-lg font-irish-grover">Heading 6 - Irish Grover (lg)</h6>
      <p class="text-base">Regular paragraph text (base)</p>
      <p class="text-sm">Small text (sm)</p>
    </div>
  </section>

  <!-- Colors -->
  <section class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-primary">Colors</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="space-y-2">
        <div class="h-20 bg-primary rounded-lg"></div>
        <p class="text-sm font-medium">Primary</p>
      </div>
      <div class="space-y-2">
        <div class="h-20 bg-secondary rounded-lg"></div>
        <p class="text-sm font-medium">Secondary</p>
      </div>
      <div class="space-y-2">
        <div class="h-20 bg-accent rounded-lg"></div>
        <p class="text-sm font-medium">Accent</p>
      </div>
      <div class="space-y-2">
        <div class="h-20 bg-neutral rounded-lg"></div>
        <p class="text-sm font-medium">Neutral</p>
      </div>
    </div>
  </section>

  <!-- Buttons -->
  <section class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-primary">Buttons</h2>
    
    <div class="space-y-8">
      <!-- Size variants -->
      <div class="space-y-2">
        <h3 class="text-xl font-medium">Size Variants</h3>
        <div class="flex flex-wrap gap-4">
          <FunButton size="sm">Small</FunButton>
          <FunButton size="md">Medium</FunButton>
          <FunButton size="lg">Large</FunButton>
        </div>
      </div>

      <!-- Style variants -->
      <div class="space-y-2">
        <h3 class="text-xl font-medium">Style Variants</h3>
        <div class="flex flex-wrap gap-4">
          <FunButton variant="primary">Primary</FunButton>
          <FunButton variant="secondary">Secondary</FunButton>
          <FunButton variant="ghost">Ghost</FunButton>
        </div>
      </div>

      <!-- States -->
      <div class="space-y-2">
        <h3 class="text-xl font-medium">States</h3>
        <div class="flex flex-wrap gap-4">
          <FunButton>Normal</FunButton>
          <FunButton disabled>Disabled</FunButton>
          <FunButton loading>Loading</FunButton>
        </div>
      </div>
    </div>
  </section>

  <!-- Spacing -->
  <section class="space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-primary">Spacing Examples</h2>
    <div class="space-y-4">
      <div class="p-4 bg-base-200 rounded-lg">Padding 4 (1rem)</div>
      <div class="p-8 bg-base-200 rounded-lg">Padding 8 (2rem)</div>
      <div class="flex gap-4">
        <div class="w-16 h-16 bg-primary rounded-lg"></div>
        <div class="w-16 h-16 bg-primary rounded-lg"></div>
        <div class="w-16 h-16 bg-primary rounded-lg"></div>
      </div>
    </div>
  </section>
</div>

<style>
  section {
    border: 1px solid theme(colors.base-300);
    border-radius: theme(borderRadius.lg);
    padding: theme(spacing.6);
  }
</style>
