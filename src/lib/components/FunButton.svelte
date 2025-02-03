<!-- FunButton.svelte -->
<script>
  /**
   * @typedef {'sm' | 'md' | 'lg'} ButtonSize
   * @typedef {'primary' | 'secondary' | 'ghost'} ButtonVariant
   */

  /** @type {'button' | 'submit' | 'reset'} [type='button'] - HTML button type */
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
    'gap-2',  // Add consistent gap between icon and text
    'font-irish-grover',
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
    <span class="loading loading-spinner"></span>
  {/if}
  <slot />
</button>

<style>
  .btn {
    text-transform: none;
    letter-spacing: 0;
    font-family: 'Irish Grover', system-ui, sans-serif;
  }
</style>
