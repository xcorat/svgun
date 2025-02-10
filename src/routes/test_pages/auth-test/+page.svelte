<script>
    import { onMount } from 'svelte';
    import authService from '$lib/gundb/services/auth';
    import { authStore } from '$lib/gundb/stores/auth';

    // State declarations using runes
    let showDialog = $state(false);
    let newUsername = $state('');
    let newPassword = $state('');
    let dialogError = $state('');
    let key = $state('');
    let value = $state('');
    let status = $state('');
    let userData = $state({});
    let namespaceData = $state({});

    // Derived values
    let namespaceEntries = $derived(Object.entries(namespaceData).sort((a, b) => a[0].localeCompare(b[0])));
    let isFormValid = $derived(key !== '' && value !== '');
    let isAuthenticated = $derived($authStore.isAuthenticated);
    let currentUser = $derived($authStore.user);

    // Effects to handle user data subscriptions
    $effect(() => {
        if (currentUser && isAuthenticated) {
            // Reset data when user changes
            userData = {};
            namespaceData = {};
            
            // Callback functions for subscriptions
            const userDataCallback = (data, key) => {
                if (data) {
                    if (typeof data === 'object') {
                        // For objects, show a placeholder
                        userData = { ...userData, [key]: '[Object]' };
                    } else {
                        userData = { ...userData, [key]: data };
                    }
                }
            };

            const namespaceCallback = (data, key) => {
                if (data) {
                    namespaceData = { ...namespaceData, [key]: data };
                }
            };

            // Setup subscriptions
            currentUser.map().on(userDataCallback);
            currentUser.get('namespace').map().on(namespaceCallback);

            // Cleanup subscriptions when effect re-runs or component unmounts
            return () => {
                if (currentUser) {
                    currentUser.map().off(userDataCallback);
                    currentUser.get('namespace').map().off(namespaceCallback);
                }
                userData = {};
                namespaceData = {};
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

    async function addKeyValue() {
        try {
            // Get the current authenticated user and add to namespace
            await new Promise((resolve, reject) => {
                authService.user.get('namespace').get(key).put(value, (ack) => {
                    if (ack.err) reject(new Error(ack.err));
                    else resolve(ack);
                });
            });
            
            status = `Added ${key}:${value} successfully`;
            key = '';
            value = '';
        } catch (error) {
            status = `Error adding key-value: ${error.message}`;
        }
    }

</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">GunDB Auth Test Page</h1>
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

    <!-- User Data Graph -->
    <div class="collapse collapse-arrow bg-base-200 mb-8">
        <input type="checkbox" checked /> 
        <div class="collapse-title text-xl font-semibold">
            User Data Graph
            {#if isAuthenticated && Object.keys(userData).length > 0}
                <span class="text-sm font-normal ml-2">({Object.keys(userData).length} items)</span>
            {/if}
        </div>
        <div class="collapse-content">
            {#if !isAuthenticated}
                <div class="p-4 bg-yellow-100 rounded-lg">
                    <p>Please authenticate to view user data</p>
                </div>
            {:else if Object.keys(userData).length === 0}
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p>No data in user graph</p>
                </div>
            {:else}
                <div class="space-y-2">
                    {#each Object.entries(userData) as [key, value]}
                        <div class="p-4 bg-gray-100 rounded-lg flex items-start">
                            <div class="flex-1">
                                <span class="font-mono text-sm">{key}:</span>
                                <span class="ml-2 {typeof value === 'object' ? 'text-blue-600' : ''}">
                                    {value}
                                </span>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <!-- Add Key-Value Form -->
    <div class="collapse collapse-arrow bg-base-200 mb-8">
        <input type="checkbox" checked />
        <div class="collapse-title text-xl font-semibold">
            Add to Namespace
        </div>
        <div class="collapse-content">
            <div class="flex gap-4 mb-4">
                <input
                    type="text"
                    bind:value={key}
                    placeholder="Key"
                    class="input input-bordered w-full max-w-xs"
                />
                <input
                    type="text"
                    bind:value={value}
                    placeholder="Value"
                    class="input input-bordered w-full max-w-xs"
                />
                <button 
                    onclick={addKeyValue} 
                    class="btn btn-primary"
                    disabled={!isAuthenticated || !isFormValid}
                >
                    Add Key-Value
                </button>
            </div>
            {#if !isAuthenticated}
                <div class="text-sm text-yellow-600 mt-2">
                    Please authenticate to add data
                </div>
            {/if}
        </div>
    </div>

    <!-- User Namespace -->
    <div class="collapse collapse-arrow bg-base-200 mb-8">
        <input type="checkbox" checked />
        <div class="collapse-title text-xl font-semibold">
            User Namespace
            {#if namespaceEntries.length > 0}
                <span class="text-sm font-normal ml-2">({namespaceEntries.length} items)</span>
            {/if}
        </div>
        <div class="collapse-content">
            {#if !isAuthenticated}
                <div class="p-4 bg-yellow-100 rounded-lg">
                    <p>Please authenticate to view namespace data</p>
                </div>
            {:else if namespaceEntries.length === 0}
                <div class="p-4 bg-gray-100 rounded-lg">
                    <p>No data in namespace</p>
                </div>
            {:else}
                <div class="overflow-x-auto">
                    <table class="table w-full">
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each namespaceEntries as [k, v]}
                                <tr>
                                    <td>{k.replace('namespace.', '')}</td>
                                    <td>{v}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        </div>
    </div>
</div>
