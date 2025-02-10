<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { qaService, isAuthenticated } from '$lib/gundb';
  import QuestionCard from '$lib/components/questions/QuestionCard.svelte';
  import { goto } from '$app/navigation';

  /** @type {import('$lib/gundb/core/types').Question[]} */
  let questions = [];
  /** @type {Object.<string, import('$lib/gundb/core/types').Answer>} */
  let answers = {};
  /** @type {number} */
  let currentIndex = 0;
  /** @type {boolean} */
  let loading = true;
  /** @type {string|null} */
  let error = null;

  /** @type {HTMLElement|null} */
  let cardElement = null;
  let touchStartY = 0;
  let isAnimating = false;

  onMount(async () => {
    // Redirect if not authenticated
    if (!$isAuthenticated) {
      goto('/welcome');
      return;
    }

    try {
      // Load questions and existing answers
      [questions, answers] = await Promise.all([
        qaService.getQuestions(),
        qaService.getUserAnswers()
      ]);
      
      // Check for index parameter
      const indexParam = $page.url.searchParams.get('index');
      if (indexParam) {
        currentIndex = parseInt(indexParam, 10);
      } else {
        // Start with first unanswered required question
        const nextQuestion = await qaService.getNextQuestion();
        if (nextQuestion) {
          currentIndex = questions.findIndex(q => q.id === nextQuestion.id);
        }
      }
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  });

  async function handleAnswer(event) {
    const { questionId, answer } = event.detail;
    
    try {
      let saveAns = await qaService.saveAnswer(questionId, answer);
      console.log(questionId, answer);
      answers = await qaService.getUserAnswers();

      
      // Auto-advance for single-choice questions
      const question = questions[currentIndex];
      if (question.type === 'multiple-choice' || question.type === 'text') {
        await goToNextQuestion();
      }
    } catch (e) {
      error = e.message;
    }
  }

  async function goToNextQuestion() {
    console.log(currentIndex, questions.length);
    if (currentIndex < questions.length - 1) {
      currentIndex++;
    } else {
      // Go to answers profile page when all questions are done
      goto('/answers');
    }
  }

  function handleNext() {
    goToNextQuestion();
  }

  function handleSkip() {
    if (!questions[currentIndex].required) {
      goToNextQuestion();
    }
  }

  function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (!cardElement || isAnimating) return;

    const touchY = event.touches[0].clientY;
    const deltaY = touchStartY - touchY;

    // Only allow upward swipe
    if (deltaY > 0) {
      const translateY = -deltaY;
      cardElement.style.transform = `translateY(${translateY}px)`;
      cardElement.style.opacity = `${1 - (deltaY / 500)}`;
    }
  }

  async function handleTouchEnd(event) {
    if (!cardElement) return;

    const touchY = event.changedTouches[0].clientY;
    const deltaY = touchStartY - touchY;

    // Reset card position
    cardElement.style.transform = '';
    cardElement.style.opacity = '';

    // If swiped up far enough, go to next question
    if (deltaY > 100) {
      // Only allow skipping non-required questions
      if (!questions[currentIndex].required) {
        await goToNextQuestion();
      }
    }
  }

  $: currentQuestion = questions[currentIndex];
  $: currentAnswer = currentQuestion ? answers[currentQuestion.id]?.answer : null;
  $: progress = ((currentIndex + 1) / questions.length) * 100;
</script>

<div class="min-h-screen bg-base-100 relative">
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
    <!-- Progress bar -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-base-content/10">
      <div
        class="h-full bg-primary transition-all duration-300 ease-out"
        style="width: {progress}%"
      ></div>
    </div>

    <!-- View answers button -->
    <div class="absolute top-4 right-4">
      <button
        class="btn btn-ghost btn-sm"
        on:click={() => goto('/answers')}
      >
        View All Answers
      </button>
    </div>

    <!-- Question cards -->
    <div 
      class="h-full p-4 pt-8"
      bind:this={cardElement}
      on:touchstart={handleTouchStart}
      on:touchmove={handleTouchMove}
      on:touchend={handleTouchEnd}
    >
      {#if currentQuestion}
        <QuestionCard
          question={currentQuestion}
          currentAnswer={currentAnswer}
          on:answer={handleAnswer}
          on:next={handleNext}
          on:skip={handleSkip}
        />
      {/if}
    </div>
  {/if}
</div>
