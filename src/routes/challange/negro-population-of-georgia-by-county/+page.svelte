<script lang="ts">
	import GeorgiaState from '$lib/GeorgiaState.svelte';

	export let data;
</script>

<GeorgiaState {data} populationLookup="data1870 (" />
<GeorgiaState {data} populationLookup="data1880_P" />
