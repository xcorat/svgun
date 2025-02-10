<script>
    import { authStore } from '$lib/gundb/stores/auth';
    import authService from '$lib/gundb/services/auth';

    async function handleLogout() {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
    
    let userNamespace = {};

    // Subscribe to namespace changes when authenticated
    $: if ($authStore.user && $authStore.isAuthenticated) {
        console.log($authStore.user)
        $authStore.user.get('namespace').map().on((data, k) => {
            if (data) {
                userNamespace[k] = data;
                userNamespace = { ...userNamespace }; // Trigger reactivity
            }
        });
    }
</script>

<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">System Status</h1>

    <!-- Authentication Status -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Authentication Status</h2>
        <div class="p-4 rounded-lg {$authStore.isAuthenticated ? 'bg-green-100' : 'bg-red-100'}">
            <div class="flex justify-between items-center">
                <p class="font-medium">
                    {#if $authStore.isAuthenticated}
                        ✅ Authenticated as <span class="font-bold">{$authStore.user.is?.alias || 'unknown'}</span>
                    {:else}
                        ❌ Not Authenticated
                    {/if}
                </p>
                {#if $authStore.isAuthenticated}
                    <button 
                        on:click={handleLogout}
                        class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                {/if}
            </div>
        </div>
    </div>

    <!-- User Namespace Data -->
    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">User Namespace Data</h2>
        {#if !$authStore.isAuthenticated}
            <div class="p-4 bg-yellow-100 rounded-lg">
                <p>Please authenticate to view namespace data</p>
            </div>
        {:else if Object.keys(userNamespace).length === 0}
            <div class="p-4 bg-gray-100 rounded-lg">
                <p>No data in namespace</p>
            </div>
        {:else}
            <div class="space-y-2">
                {#each Object.entries(userNamespace).slice(0, 5) as [key, value]}
                    <div class="p-4 bg-gray-100 rounded-lg">
                        <span class="font-medium">{key}:</span> {value}
                    </div>
                {/each}
                {#if Object.keys(userNamespace).length > 5}
                    <p class="text-sm text-gray-600 mt-2">
                        ... and {Object.keys(userNamespace).length - 5} more items
                    </p>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Additional Info -->
    {#if $authStore.isAuthenticated}
        <div class="text-sm text-gray-600">
            <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
    {/if}
</div>
