<!-- Button.svelte -->
<script>
  /**
   * @typedef {'sm' | 'md' | 'lg'} ButtonSize
   * @typedef {'primary' | 'secondary' | 'ghost'} ButtonVariant
   */

  /** @type {string} [type='button'] - HTML button type */
  export let type = 'button';
  /** @type {ButtonSize} [size='md'] - Button size variant */
  export let size = 'md';
  /** @type {ButtonVariant} [variant='primary'] - Button style variant */
  export let variant = 'primary';
  /** @type {boolean} [disabled=false] - Disabled state */
  export let disabled = false;
  /** @type {string} [class=''] - Additional CSS classes */
  export let className = '';
  /** @type {boolean} [loading=false] - Loading state */
  export let loading = false;
  /** @type {boolean} [block=false] - Full width button */
  export let block = false;

  // Compute button classes based on props
  $: buttonClasses = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    loading ? 'loading' : '',
    block ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');
</script>

<button
  {type}
  class={buttonClasses}
  {disabled}
  on:click
  {...$$restProps}
>
  {#if loading}
    <span class="loading loading-spinner" />
  {/if}
  <slot />
</button>

<style>
  /* Custom styles that extend DaisyUI's button */
  .btn {
    text-transform: none;
    font-weight: 500;
    border-radius: 0.5rem;
  }

  /* Override DaisyUI's primary button colors if needed */
  .btn-primary {
    @apply bg-primary hover:bg-primary/90;
  }

  /* Add transition for smooth hover effects */
  .btn {
    @apply transition-all duration-200;
  }
</style>
