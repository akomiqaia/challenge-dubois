<script context="module" lang="ts">
	export type geoJsonType = typeof import('../../../data/challenge01/geojson.json');
</script>

<script lang="ts">
	import { scaleOrdinal } from 'd3-scale';
	import GeorgiaState from '$lib/GeorgiaState.svelte';

	export let data;

	const geoJson: geoJsonType = data.geoJson;

	const categories = [
		'20000 - 30000',
		'15000 - 20000',
		'10000 - 15000',
		'5000 - 10000',
		'2500 - 5000',
		'1000 - 2500',
		'> 1000',
		''
	] as const;

	const colorScale = scaleOrdinal().domain(categories).range([
		'rgba(0, 0, 128, 0.6)', // navy
		'rgba(101, 67, 33, 0.7)', // brown
		'rgba(210, 180, 140, 0.7)', // tan
		'rgba(220, 20, 60, 0.7)', // red
		'rgba(255, 192, 203, 0.7)', // pink
		'rgba(255, 215, 0, 0.7)', // gold
		'rgba(0, 128, 128, 0.7)', // teal
		'rgba(255, 255, 255, 0.7)' // white
	]);

	const categoryMap = {
		'20000 - 30000': '20,000 TO 30,000',
		'15000 - 20000': '15,000 TO 20,000',
		'10000 - 15000': '10,000 TO 15,000',
		'5000 - 10000': '5,000 TO 10,000',
		'2500 - 5000': '2,500 TO 5,000',
		'1000 - 2500': '1,000 TO 2,500',
		'> 1000': 'UNDER 1,000',
		'': 'Unknown'
	} as const;

	let currentCategory: null | (typeof categories)[number] = null;

	function hightLightOnlySelected(category: (typeof categories)[number]) {
		if (currentCategory === category) {
			currentCategory = null;
			const paths = document.querySelectorAll('path');
			paths.forEach((path) => {
				path.style.opacity = '1';
			});
			return;
		}
		currentCategory = category;
		const paths = document.querySelectorAll('path');
		paths.forEach((path) => {
			if (path.getAttribute('fill') === colorScale(category)) {
				path.style.opacity = '1';
			} else {
				path.style.opacity = '0.1';
			}
		});
	}

	let currentlyHovered: {
		state: string;
		population1870: string;
		population1880: string;
	} = {
		state: '',
		population1870: '',
		population1880: ''
	};

	function handleHover(event: { detail: string }) {
		currentlyHovered.state = event.detail;
		const p1870 = (currentlyHovered.population1870 =
			geoJson.features.find((feature) => feature.properties.NHGISNAM === currentlyHovered.state)
				?.properties['data1870 ('] ?? '');
		const p1880 =
			geoJson.features.find((feature) => feature.properties.NHGISNAM === currentlyHovered.state)
				?.properties.data1880_P ?? '';
		currentlyHovered.population1870 = p1870;
		currentlyHovered.population1880 = p1880;
		currentlyHovered = { ...currentlyHovered };
	}
</script>

<main>
	<div class="hover-details">
		{#if currentlyHovered.state}
			<h3>Currently hovering: {currentlyHovered.state}</h3>
			<p>
				Since 1870 to 1880 the population in <b>{currentlyHovered.state}</b> changed from
				<span style="background-color: {colorScale(currentlyHovered.population1870)}"
					>{currentlyHovered.population1870 ? currentlyHovered.population1870 : 'unknown'}</span
				>
				to
				<span style="background-color: {colorScale(currentlyHovered.population1880)}"
					>{currentlyHovered.population1880}</span
				>
			</p>
		{:else}
			<h3>Hover over a county to see how the population of a county changed over 10 years</h3>
		{/if}
	</div>

	<h2>Population of Black people in Georgia by County</h2>
	<div class="content">
		<div class="map-wrapper">
			<p class="cardo-bold">1870</p>
			<GeorgiaState
				geojson={geoJson}
				{categories}
				{colorScale}
				populationLookup="data1870 ("
				on:hover={handleHover}
			/>
		</div>
		<div class="map-wrapper">
			<p class="cardo-bold">1880</p>
			<GeorgiaState
				geojson={geoJson}
				{categories}
				{colorScale}
				populationLookup="data1880_P"
				on:hover={handleHover}
			/>
		</div>
	</div>
	<div class="legend-wrapper">
		{#each categories as category}
			<div
				class="legend"
				on:mouseenter={() => hightLightOnlySelected(category)}
				on:mouseleave={() => hightLightOnlySelected(currentCategory)}
			>
				<div class="circle" style="background-color: {colorScale(category)};"></div>
				<p>{categoryMap[category]}</p>
			</div>
		{/each}
	</div>
</main>

<style>
	.hover-details {
		margin-bottom: 20px;
		height: 100px;
	}
	.hover-details span {
		padding: 10px;
		font-weight: 700;
	}
	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40px;
	}
	.circle {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}
	.legend-wrapper {
		display: flex;
	}

	.legend {
		width: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 10px;
		cursor: pointer;
	}
	.legend-wrapper p {
		margin-left: 30px;
	}

	.map-wrapper > p {
		margin-left: 30%;
	}
</style>
