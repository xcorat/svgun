<script>
  import { authService } from '$lib/gundb';
  import userService from '$lib/gundb/services/user';
  import FunButton from '$lib/components/FunButton.svelte';
  import { goto } from '$app/navigation';

  /** @type {string} */
  let username = '';
  /** @type {string} */
  let password = '';
  /** @type {string} */
  let confirmPassword = '';
  /** @type {string|null} */
  let error = null;
  /** @type {boolean} */
  let loading = false;

  async function handleSignup() {
    error = null;
    
    if (!username || !password) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    loading = true;
    try {
      // Create user in Gun
      await authService.createUser(username, password);
      
      // Log in the user
      await authService.login(username, password);
      
      // Create user profile
      await userService.createProfile(username);
      
      // Navigate to questions page
      goto('/questions');
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-base-100 flex flex-col items-center justify-center p-4">
  <div class="max-w-md w-full space-y-8 p-8 bg-base-200 rounded-lg shadow-lg">
    <div>
      <h2 class="text-3xl font-irish-grover text-center text-primary">
        Create Account
      </h2>
    </div>
    
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSignup}>
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
        
        <div>
          <label for="confirm-password" class="sr-only">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            bind:value={confirmPassword}
            required
            class="input input-bordered w-full"
            placeholder="Confirm Password"
          />
        </div>
      </div>

      {#if error}
        <div class="text-error text-center text-sm">{error}</div>
      {/if}

      <div>
        <FunButton
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Sign Up
        </FunButton>

        <div class="text-center mt-4">
          <span class="text-sm">Already have an account?</span>
          <button
            type="button"
            class="btn btn-link btn-sm font-irish-grover"
            on:click={() => goto('/auth/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
