<script>
  import { createEventDispatcher } from 'svelte';
  import FunButton from '../FunButton.svelte';

  /** @type {import('../../gundb/core/types').Question} */
  export let question;
  /** @type {string|string[]|null} */
  export let currentAnswer = null;

  const dispatch = createEventDispatcher();

  function handleAnswer(/** @type {string|string[]} */ answer) {
    dispatch('answer', { questionId: question.id, answer });
  }

  /** @type {string} */
  let textInput = '';
  /** @type {string[]} */
  let selectedOptions = [];

  $: {
    if (currentAnswer) {
      if (Array.isArray(currentAnswer)) {
        selectedOptions = currentAnswer;
      } else {
        textInput = currentAnswer;
      }
    }
  }
</script>

<div 
  class="card w-full h-full bg-base-100 shadow-xl"
  style="touch-action: none;"
>
  <div class="card-body flex flex-col justify-between h-full">
    <div class="space-y-4">
      <h2 class="card-title font-irish-grover text-2xl text-primary">
        {question.text}
      </h2>
      
      {#if question.description}
        <p class="text-base-content/70">{question.description}</p>
      {/if}
    </div>

    <div class="flex-grow flex items-center justify-center py-8">
      {#if question.type === 'text'}
        <input
          type="text"
          class="input input-bordered w-full max-w-md"
          placeholder="Type your answer..."
          bind:value={textInput}
          on:change={() => handleAnswer(textInput)}
        />
      {:else if question.type === 'text-area'}
        <textarea
          class="textarea textarea-bordered w-full max-w-md h-32"
          placeholder="Type your answer..."
          bind:value={textInput}
          on:change={() => handleAnswer(textInput)}
        ></textarea>
      {:else if question.type === 'multiple-choice'}
        <div class="w-full max-w-md space-y-2">
          {#each question.options || [] as option}
            <button
              class="btn btn-outline w-full {textInput === option ? 'btn-primary' : ''}"
              on:click={() => handleAnswer(option)}
            >
              {option}
            </button>
          {/each}
        </div>
      {:else if question.type === 'multiple-select'}
        <div class="w-full max-w-md space-y-2">
          {#each question.options || [] as option}
            <button
              class="btn btn-outline w-full {selectedOptions.includes(option) ? 'btn-primary' : ''}"
              on:click={() => {
                selectedOptions = selectedOptions.includes(option)
                  ? selectedOptions.filter(o => o !== option)
                  : [...selectedOptions, option];
                handleAnswer(selectedOptions);
              }}
            >
              {option}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex justify-between items-center">
      <div class="text-sm opacity-50">
        {question.required ? 'Required' : 'Optional'}
      </div>
      <div class="flex gap-2">
        {#if !question.required}
          <button
            class="btn btn-ghost btn-sm"
            on:click={() => dispatch('skip')}
          >
            Skip
          </button>
        {/if}
        {#if question.type === 'multiple-select'}
          <FunButton
            disabled={question.required && selectedOptions.length === 0}
            on:click={() => dispatch('next')}
          >
            Next
          </FunButton>
        {/if}
      </div>
    </div>
  </div>
</div>
