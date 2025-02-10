<script>
  import { authService } from '$lib/gundb';
  import FunButton from '$lib/components/FunButton.svelte';
  import { goto } from '$app/navigation';

  /** @type {string} */
  let username = '';
  /** @type {string} */
  let password = '';
  /** @type {string|null} */
  let error = null;
  /** @type {boolean} */
  let loading = false;

  async function handleLogin() {
    error = null;
    
    if (!username || !password) {
      error = 'Please fill in all fields';
      return;
    }

    loading = true;
    try {
      await authService.login(username, password);
      goto('/questions');
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function goToSignup() {
    goto('/auth/signup');
  }
</script>

<div class="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
  <div class="max-w-md w-full space-y-8 p-8 bg-base-200 rounded-lg shadow-lg">
    <div>
      <h2 class="text-3xl font-irish-grover text-center text-primary">
        Welcome Back
      </h2>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
      <div class="space-y-4">
        <div>
          <label for="username" class="sr-only">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            bind:value={username}
            required
            class="input input-bordered w-full"
            placeholder="Username"
          />
        </div>
        
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            bind:value={password}
            required
            class="input input-bordered w-full"
            placeholder="Password"
          />
        </div>
      </div>

      {#if error}
        <div class="text-error text-center text-sm">{error}</div>
      {/if}

      <div class="space-y-4">
        <FunButton
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Sign In
        </FunButton>

        <div class="text-center">
          <span class="text-sm">Don't have an account?</span>
          <button
            type="button"
            class="btn btn-link btn-sm font-irish-grover"
            on:click={goToSignup}
          >
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
