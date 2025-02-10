<script>
import { onMount } from 'svelte';
import * as d3 from 'd3';
import gun from '$lib/gundb/core/gunInstance';

// Expose gun instance for testing
if (typeof window !== 'undefined') {
    window.gun = gun;
}

let graphContainer;
let nodes = [];
let links = [];
let simulation;

function updateGraph() {
    // Clear existing nodes
    d3.select(graphContainer).selectAll("*").remove();

    const width = graphContainer.clientWidth;
    const height = graphContainer.clientHeight;

    const svg = d3.select(graphContainer)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create arrow marker for links
    svg.append("defs").selectAll("marker")
        .data(["end"])
        .join("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#999");

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 1)
        .attr("marker-end", "url(#arrow)");

    const node = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g");

    node.append("circle")
        .attr("r", 5)
        .attr("fill", d => d.isRoot ? "#ff4444" : "#66bb6a");

    node.append("text")
        .attr("x", 8)
        .attr("y", "0.31em")
        .text(d => d.id)
        .clone(true).lower()
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 3);

    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });
}

function traverseGunData(node, visited = new Set(), parentId = null) {
    if (!node || visited.has(node._['#'])) return;
    
    const nodeId = node._['#'];
    visited.add(nodeId);
    
    if (!nodes.find(n => n.id === nodeId)) {
        nodes.push({
            id: nodeId,
            isRoot: !parentId
        });
    }
    
    if (parentId) {
        links.push({
            source: parentId,
            target: nodeId
        });
    }
    
    Object.keys(node._).forEach(key => {
        if (key !== '#' && typeof node._[key] === 'object' && node._[key] !== null) {
            const childNode = node._[key];
            if (childNode && childNode._ && childNode._['#']) {
                traverseGunData(childNode, visited, nodeId);
            }
        }
    });
}

function refreshGraph() {
    nodes = [];
    links = [];
    traverseGunData(gun);
    updateGraph();
}

onMount(() => {
    updateGraph();
    // Refresh graph every 5 seconds
    const interval = setInterval(refreshGraph, 500);
    return () => clearInterval(interval);
});
</script>

<div class="container">
    <h1>GunDB Node Graph</h1>
    <div class="button-group">
        <button on:click={refreshGraph}>Refresh Graph</button>
        <button on:click={() => {
            gun.get('test').put({ message: 'Test data ' + Date.now() });
        }}>Add Test Data</button>
    </div>
    <div class="graph" bind:this={graphContainer}></div>
</div>

<style>
    .container {
        padding: 1rem;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    .button-group {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .graph {
        flex: 1;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 1rem;
        background: #f5f5f5;
    }

    button {
        padding: 0.5rem 1rem;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #45a049;
    }

    h1 {
        margin: 0 0 1rem 0;
    }
</style>
