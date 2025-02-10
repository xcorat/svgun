<script>
    const tests = [
        {
            name: 'Button Test',
            description: 'Test page for button components and interactions',
            path: '/test_pages/button-test'
        },
        {
            name: 'UI Samples',
            description: 'Collection of UI component samples and patterns',
            path: '/test_pages/ui-sample'
        },
        {
            name: 'GunDB Node Graph',
            description: 'Interactive visualization of GunDB data structure',
            path: '/test_pages/node-graph'
        }
    ];
</script>

<div class="container">
    <h1>Test Pages</h1>
    <div class="test-grid">
        {#each tests as test}
            <a href={test.path} class="test-card">
                <h2>{test.name}</h2>
                <p>{test.description}</p>
            </a>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #2c3e50;
    }

    .test-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .test-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        text-decoration: none;
        color: inherit;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 1px solid #e0e0e0;
    }

    .test-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .test-card h2 {
        font-size: 1.25rem;
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
    }

    .test-card p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    @media (max-width: 640px) {
        .container {
            padding: 1rem;
        }

        .test-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
