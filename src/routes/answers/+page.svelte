<script>
  import { onMount } from 'svelte';
  import { qaService, isAuthenticated } from '$lib/gundb';
  import { goto } from '$app/navigation';
  import AnswerCard from '$lib/components/answers/AnswerCard.svelte';

  /** @type {import('$lib/gundb/core/types').Question[]} */
  let questions = [];
  /** @type {Object.<string, import('$lib/gundb/core/types').Answer>} */
  let answers = {};
  /** @type {boolean} */
  let loading = true;
  /** @type {string|null} */
  let error = null;

  onMount(async () => {
    // Redirect if not authenticated
    if (!$isAuthenticated) {
      goto('/welcome');
      return;
    }

    try {
      // Load questions and answers
      [questions, answers] = await Promise.all([
        qaService.getQuestions(),
        qaService.getUserAnswers()
      ]);

      // Subscribe to answer changes
      const unsubscribe = qaService.subscribeToAnswers((data) => {
        answers = data;
      });

      return () => unsubscribe();
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  function handleEditAnswer(questionId) {
    // Find the index of the question
    const index = questions.findIndex(q => q.id === questionId);
    if (index !== -1) {
      // Navigate to questions page at specific index
      goto(`/questions?index=${index}`);
    }
  }

  $: answeredCount = Object.keys(answers).length;
  $: totalQuestions = questions.length;
  $: completionPercentage = Math.round((answeredCount / totalQuestions) * 100);
</script>

<div class="min-h-screen bg-base-100">
  {#if loading}
    <div class="h-full flex items-center justify-center">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
  {:else if error}
    <div class="h-full flex items-center justify-center">
      <div class="alert alert-error max-w-md mx-4">
        <span>{error}</span>
      </div>
    </div>
  {:else}
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <header class="mb-8">
          <h1 class="text-3xl font-irish-grover text-primary mb-2">
            Your Profile
          </h1>
          <p class="text-base-content/70">
            {answeredCount} of {totalQuestions} questions answered ({completionPercentage}% complete)
          </p>
        </header>

        <!-- Progress bar -->
        <div class="w-full h-2 bg-base-200 rounded-full mb-8">
          <div
            class="h-full bg-primary rounded-full transition-all duration-300"
            style="width: {completionPercentage}%"
          ></div>
        </div>

        <!-- Answer cards -->
        <div class="space-y-4">
          {#each questions as question (question.id)}
            <AnswerCard
              {question}
              answer={answers[question.id]}
              on:click={() => handleEditAnswer(question.id)}
            />
          {/each}
        </div>

        <!-- Add more questions button -->
        <div class="mt-8 flex justify-center">
          <button
            class="btn btn-primary"
            on:click={() => goto('/questions')}
          >
            Add More Answers
          </button>
        </div>
      </div>
    </main>
  {/if}
</div>
