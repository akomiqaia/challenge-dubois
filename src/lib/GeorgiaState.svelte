<script lang="ts">
	import type { geoJsonType } from '../routes/challange/black-people-population-of-georgia-by-county/+page.svelte';
	import { createEventDispatcher } from 'svelte';
	import { geoIdentity, geoPath } from 'd3-geo';

	export let geojson: geoJsonType;
	export let populationLookup: string;
	export let categories;
	export let colorScale;

	let width: number, height: number;

	$: projection = geoIdentity().reflectY(true).fitSize([width, height], geojson);
	$: pathGenerator = geoPath(projection);

	$: counties = geojson.features.map((feature) => {
		return {
			state: feature.properties.NHGISNAM,
			color: colorScale(feature.properties[populationLookup]),
			path: pathGenerator(feature)
		};
	});
	const dispatch = createEventDispatcher();
	function handleMouseOver(state) {
		dispatch('hover', state);
	}
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		{#each counties as { path, color, state }}
			<path
				d={path}
				fill={color}
				on:mouseover={() => handleMouseOver(state)}
				on:focus={() => handleMouseOver(state)}
			/>
		{/each}
	</svg>
</div>

<style>
	div {
		width: 40vw;
		height: 40vh;
		overflow: hidden;
	}

	path {
		stroke: black;
		stroke-width: 1px;
	}
</style>
