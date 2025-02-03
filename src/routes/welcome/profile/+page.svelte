<script>
  import FunButton from '$lib/components/FunButton.svelte';
</script>

<div class="relative h-full w-full flex flex-col justify-between py-16">
  <div class="w-full bg-base-100/30 backdrop-blur-sm">
    <div class="hero-content text-center flex flex-col items-center justify-center">
      <h1 class="font-irish-grover text-secondary tracking-wider text-emboss mb-8">
        Create an online profile by answering questions ...
      </h1>
      
      <FunButton 
        size="lg" 
        className="text-2xl transform hover:scale-105 transition-transform mt-16"
        href="/welcome/questions"
      >
        Next...
      </FunButton>
    </div>
  </div>
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
    font-size: clamp(3rem, 7vw, 6rem);
  }
</style>
