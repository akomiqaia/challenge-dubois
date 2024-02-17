<script lang="ts">
	import { geoIdentity, geoPath } from 'd3-geo';
	import { scaleOrdinal } from 'd3-scale';

	export let data;
  export let populationLookup

	let width, height;

	const geojson = data.geoJson;

	$: projection = geoIdentity().reflectY(true).fitSize([width, height], geojson);
	$: pathGenerator = geoPath(projection);

	$: counties = geojson.features.map((feature) => {
		return {
      color: colorScale(feature.properties[populationLookup]),
			path: pathGenerator(feature)
		};
	});
  
	const categories = [
		'> 1000',
		'1000 - 2500',
		'2500 - 5000',
		'5000 - 10000',
		'10000 - 15000',
		'15000 - 20000',
		'20000 - 30000'
	];
	const colorScale = scaleOrdinal().domain(categories).range([
		'teal',
		'#ffd700', // gold
		'#ffc0cb', // pink
		'#dc143c', // red
		'#d2b48c', // tan
		'#654321', // brown
		'navy'
	]);
</script>

<div bind:clientWidth={width} bind:clientHeight={height}>
	<svg {width} {height}>
		{#each counties as { path, color }}
			<path d={path} fill={color} />
		{/each}
	</svg>
</div>

<style>
	div {
		width: 90vw;
		height: 90vh;
		overflow: hidden;
	}

	path {
		stroke: black;
		stroke-width: 1px;
	}
</style>
