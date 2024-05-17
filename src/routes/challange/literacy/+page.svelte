<script lang="ts">
	import { scaleLinear, scaleBand } from 'd3-scale';
	export let data;
	const csvData = data.csvData;
	const sortedData = csvData.sort((a, b) => a.Rate - b.Rate);

	const margin = { top: 20, right: 20, bottom: 40, left: 90 };
	let width = 600;
	let height = 800;

	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	$: xDomain = sortedData.map((d) => d.Rate);
	$: yDomain = sortedData.map((d) => d.Nation);

	$: xScale = scaleLinear()
		.domain([0, Math.max.apply(null, xDomain)])
		.range([0, innerWidth]);

	$: yScale = scaleBand().domain(yDomain).range([innerHeight, 0]).padding(0.25);

	let activeIndex = -1;
	function handleHover(i: number, event: string) {
		if (event === 'enter') {
			activeIndex = i;
		} else {
			activeIndex = -1;
		}
	}
</script>

<div class="wrapper">
	<h2>Literacy of the American black people compared with that of other nations.</h2>
	<div class="barchart-area" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({margin.left}, {margin.top})">
				{#each sortedData as d, i}
					<text
						class="cardo-bold"
						text-anchor="end"
						x={-10}
						dy=".35em"
						y={yScale(d.Nation) + yScale.bandwidth() / 2}
					>
						{d.Nation}
					</text>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<rect
						x={0}
						y={yScale(d.Nation)}
						width={xScale(d.Rate)}
						height={yScale.bandwidth()}
						fill="var(--color-{d.Nation === "Negroes, U.S.A." ? "crimson" : "green"})"
						on:mouseenter={() => handleHover(i, 'enter')}
						on:mouseleave={() => handleHover(i, 'leave')}
					/>
					{#if i === activeIndex}
						<text
							x={xScale(d.Rate) / 2}
							y={yScale(d.Nation) + yScale.bandwidth() / 2}
							dy=".35em"
							class="bold-number"
						>
							{d.Rate}
						</text>
					{/if}
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
	}
	h2 {
		text-align: center;
		max-width: 500px;
		margin: 0 auto;
		margin-bottom: 10px;
	}

	svg {
		width: 100%;
		overflow: visible;
	}

	.bold-number {
		font-family: 'Public serif', serif;
		font-weight: 900;
	}
</style>
