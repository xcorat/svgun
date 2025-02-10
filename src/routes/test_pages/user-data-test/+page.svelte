<script>
    import { onMount } from 'svelte';
    import authService from '$lib/gundb/services/auth';
    import { authStore } from '$lib/gundb/stores/auth';

    // State declarations using runes
    let showDialog = $state(false);
    let newUsername = $state('');
    let newPassword = $state('');
    let dialogError = $state('');
    let status = $state('');
    let answersData = $state({});
    let letsqaData = $state({});

    // Derived values
    let isAuthenticated = $derived($authStore.isAuthenticated);
    let currentUser = $derived($authStore.user);

    // Effects to handle user data subscriptions
    $effect(() => {
        if (currentUser && isAuthenticated) {
            // Reset data when user changes
            answersData = {};
            letsqaData = {};
            
            // Callback functions for subscriptions
            const answersCallback = (data, key) => {
                if (data) {
                    try {
                        // Store the full object for answers
                        answersData = { 
                            ...answersData, 
                            [key]: {
                                ...data,
                                // Create a preview with just the answer
                                preview: `A: ${data.answer?.slice(0, 100)}${data.answer?.length > 100 ? '...' : ''}`
                            }
                        };
                    } catch (error) {
                        console.error('Error processing answer data:', error);
                    }
                }
            };

            const letsqaCallback = (data, key) => {
                if (data) {
                    if (typeof data === 'object') {
                        letsqaData = { ...letsqaData, [key]: JSON.stringify(data, null, 2) };
                    } else {
                        letsqaData = { ...letsqaData, [key]: data };
                    }
                }
            };

            // Setup subscriptions
            currentUser.get('answers').map().on(answersCallback);
            currentUser.get('letsqa').map().on(letsqaCallback);

            // Cleanup subscriptions when effect re-runs or component unmounts
            return () => {
                if (currentUser) {
                    currentUser.get('answers').map().off(answersCallback);
                    currentUser.get('letsqa').map().off(letsqaCallback);
                }
                answersData = {};
                letsqaData = {};
            };
        }
    });

    // Default credentials
    const defaultUser = 'testuser';
    const defaultPass = 'testpass';

    async function switchUser() {
        dialogError = '';
        if (!newUsername || !newPassword) {
            dialogError = 'Both username and password are required';
            return;
        }

        try {
            // First, logout current user if authenticated
            if (isAuthenticated) {
                await authService.logout();
                // Reset local data is handled by the effect
            }

            // Try to create user first (in case it doesn't exist)
            try {
                await authService.createUser(newUsername, newPassword);
            } catch (error) {
                // User might already exist, which is fine
            }

            // Now try to log in
            await authService.login(newUsername, newPassword);
            status = `Switched to user: ${newUsername}`;
            showDialog = false;
            newUsername = '';
            newPassword = '';
        } catch (error) {
            dialogError = error.message;
        }
    }

    onMount(async () => {
        try {
            await authService.createUser(defaultUser, defaultPass).catch(() => {});
            await authService.login(defaultUser, defaultPass);
            status = 'Logged in as testuser';
        } catch (error) {
            status = `Login failed: ${error.message}`;
        }
    });
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">User Data Test Page</h1>
    <div class="mb-4 flex justify-between items-start">
        <div>
            <p class="text-sm text-gray-600">Default credentials: {defaultUser}:{defaultPass}</p>
            <p class="text-sm text-gray-600 mt-1">Status: {status}</p>
        </div>
        <button class="btn btn-sm" onclick={() => showDialog = true}>
            Switch User
        </button>
    </div>

    <!-- User Switch Dialog -->
    <dialog class="modal" class:modal-open={showDialog}>
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Switch User</h3>
            <div class="space-y-4">
                <div class="form-control w-full">
                    <label class="label" for="username">
                        <span class="label-text">Username</span>
                    </label>
                    <input 
                        type="text" 
                        id="username"
                        bind:value={newUsername} 
                        placeholder="Enter username" 
                        class="input input-bordered w-full" 
                    />
                </div>
                <div class="form-control w-full">
                    <label class="label" for="password">
                        <span class="label-text">Password</span>
                    </label>
                    <input 
                        type="password" 
                        id="password"
                        bind:value={newPassword} 
                        placeholder="Enter password" 
                        class="input input-bordered w-full" 
                    />
                </div>
                {#if dialogError}
                    <div class="text-error text-sm">{dialogError}</div>
                {/if}
            </div>
            <div class="modal-action">
                <button class="btn btn-ghost" onclick={() => showDialog = false}>Cancel</button>
                <button 
                    class="btn btn-primary" 
                    onclick={switchUser}
                    disabled={!newUsername || !newPassword}
                >
                    Switch
                </button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button onclick={() => showDialog = false}>close</button>
        </form>
    </dialog>

    <!-- User Answers Data -->
    <div class="collapse collapse-arrow bg-base-200 mb-8">
        <input type="checkbox" checked /> 
        <div class="collapse-title text-xl font-semibold">
            User Answers
            {#if Object.keys(answersData).length > 0}
                <span class="text-sm font-normal ml-2">({Object.keys(answersData).length} items)</span>
            {/if}
        </div>
        <div class="collapse-content">
            {#if !isAuthenticated}
                <div class="p-4 bg-yellow-100 rounded-lg">
                    <p>Please authenticate to view answers data</p>
                </div>
            {:else if Object.keys(answersData).length === 0}
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p>No answers data found</p>
                </div>
            {:else}
                <div class="space-y-2">
                    {#each Object.entries(answersData) as [key, value]}
                        <div class="collapse collapse-arrow bg-gray-100 rounded-lg">
                            <input type="checkbox" /> 
                            <div class="collapse-title font-medium text-sm">
                                <span class="font-mono">{key}:</span>
                                <span class="ml-2">{value.preview}</span>
                            </div>
                            <div class="collapse-content">
                                <div class="mt-2 space-y-2">
                                    <div class="bg-white rounded p-3">
                                        <div class="text-sm whitespace-pre-wrap">{value.answer}</div>
                                    </div>
                                    {#if value.metadata}
                                        <div class="bg-white rounded p-3 mt-2">
                                            <div class="font-semibold mb-2">Metadata:</div>
                                            <pre class="text-xs whitespace-pre-wrap">{JSON.stringify(value.metadata, null, 2)}</pre>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- User LetsQA Data -->
    <div class="collapse collapse-arrow bg-base-200 mb-8">
        <input type="checkbox" checked /> 
        <div class="collapse-title text-xl font-semibold">
            User LetsQA Data
            {#if Object.keys(letsqaData).length > 0}
                <span class="text-sm font-normal ml-2">({Object.keys(letsqaData).length} items)</span>
            {/if}
        </div>
        <div class="collapse-content">
            {#if !isAuthenticated}
                <div class="p-4 bg-yellow-100 rounded-lg">
                    <p>Please authenticate to view LetsQA data</p>
                </div>
            {:else if Object.keys(letsqaData).length === 0}
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p>No LetsQA data found</p>
                </div>
            {:else}
                <div class="space-y-2">
                    {#each Object.entries(letsqaData) as [key, value]}
                        <div class="p-4 bg-gray-100 rounded-lg">
                            <div class="font-mono text-sm mb-1">{key}:</div>
                            <pre class="whitespace-pre-wrap text-sm">{value}</pre>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
