<script lang="ts">
	import { scaleLinear, scaleBand } from 'd3-scale';
	export let data;
	const csvData: {
		Date: number;
		Land: number;
	}[] = data.csvData;

	const sortedData = csvData
		.sort((a, b) => b.Date - a.Date)
		.map((d) => {
			return {
				Date: d.Date.toString(),
				Land: d.Land
			};
		});

	const margin = { top: 20, right: 20, bottom: 40, left: 90 };
	let width = 600;
	let height = 800;

	$: innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	$: xDomain = sortedData.map((d) => d.Land);
	$: yDomain = sortedData.map((d) => d.Date);

	$: xScale = scaleLinear()
		.domain([0, Math.max.apply(null, xDomain)])
		.range([0, innerWidth]);

	$: yScale = scaleBand().domain(yDomain).range([innerHeight, 0]).padding(0.25);
	function formatNumbersWithCommas(x: number) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
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
	<h2>Acres of land owned by black people in Georgia</h2>
	<div class="barchart-area" bind:clientWidth={width}>
		<svg {width} {height}>
			<g transform="translate({margin.left}, {margin.top})">
				{#each sortedData as d, i}
					<text
						class="cardo-bold"
						text-anchor="end"
						x={-10}
						dy=".35em"
						y={yScale(d.Date) + yScale.bandwidth() / 2}
					>
						{d.Date}
					</text>
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<rect
						x={0}
						y={yScale(d.Date)}
						width={xScale(d.Land)}
						height={yScale.bandwidth()}
						fill="var(--color-crimson)"
						on:mouseenter={() => handleHover(i, 'enter')}
						on:mouseleave={() => handleHover(i, 'leave')}
					/>
					{#if i === 0 || i === sortedData.length - 1 || i === activeIndex}
						<text
							x={xScale(d.Land) / 2}
							y={yScale(d.Date) + yScale.bandwidth() / 2}
							dy=".35em"
							class="bold-number"
						>
							{formatNumbersWithCommas(d.Land)}
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
