<script>
  import FunButton from '../FunButton.svelte';

  /** @type {import('../../gundb/core/types').Question} */
  export let question;
  /** @type {import('../../gundb/core/types').Answer|null} */
  export let answer = null;

  function formatAnswer(/** @type {string|string[]} */ value) {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }
</script>

<div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
  <div class="card-body">
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1">
        <h3 class="card-title text-lg font-irish-grover mb-2">
          {question.text}
        </h3>
        
        {#if answer}
          <p class="text-base-content/80">
            {formatAnswer(answer.answer)}
          </p>
        {:else}
          <p class="text-base-content/50 italic">
            Not answered yet
          </p>
        {/if}
      </div>

      <FunButton
        size="sm"
        variant={answer ? 'ghost' : 'outline'}
        on:click
      >
        {answer ? 'Edit' : 'Answer'}
      </FunButton>
    </div>

    {#if question.description}
      <div class="mt-2 text-sm text-base-content/60">
        {question.description}
      </div>
    {/if}
  </div>
</div>
