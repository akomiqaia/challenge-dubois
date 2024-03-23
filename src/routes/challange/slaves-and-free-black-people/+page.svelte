<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';

	export let data;
	const csvData: { Year: string; Free: number }[] = data.csvData.map((d) => {
		return {
			Year: d.Year.toString(),
			Free: d.Free === 100 ? 3 : Number(d.Free)
		};
	});

	const width = 400;
	const height = 600;

	const margin = { top: 70, right: 20, bottom: 20, left: 50 };
	const innerHeight = height - margin.top - margin.bottom;
	const innerWidth = width - margin.left - margin.right;

	$: xDomain = csvData.map((d) => d.Year);
	$: yDomain = csvData.map((d) => d.Free);

	$: yScale = scaleBand().domain(xDomain).range([0, innerHeight]).padding(0.05);

	const rectWidth = innerWidth - 100;
	$: freePercentageScale = scaleLinear()
		.domain([0, Math.max.apply(null, yDomain)])
		.range([0, rectWidth]);
	$: tickScale = scaleLinear().domain([3, 0]).range([0, rectWidth]);
</script>

<h2>Slaves and Free Black People</h2>
<div class="svg-wrapper">
	<svg {width} {height}>
		<g transform={`translate(${innerWidth},0)`}>
			<text dy=".71em" text-anchor="end" font-size="12">
				<tspan x="0" dy="1.1em">Percent</tspan>
				<tspan x="0" dy="1.1em">of free</tspan>
				<tspan x="0" dy="1.1em">black people</tspan>
			</text>
		</g>
		<g transform={`translate(${margin.left},${margin.top})`}>
			{#each [3, 2, 1] as tickValue}
				<g transform={`translate(${tickScale(tickValue)},0)`}>
					<text text-anchor="middle" dy=".71em" y={-20}>
						{tickValue}%
					</text>
					<line y2={-5} stroke="black" />
				</g>
			{/each}
			{#each csvData as d, i}
				<text text-anchor="end" x="-20" dy=".32em" y={yScale(d.Year)}>
					{d.Year}
				</text>
				{#if i !== csvData.length - 1}
					<rect x="0" y={yScale(d.Year)} width={rectWidth} height={yScale.bandwidth()} />
					{@const x1 = rectWidth - freePercentageScale(d.Free)}
					{@const y1 = yScale(d.Year)}
					{@const x2 = rectWidth}
					{@const y2 = yScale(d.Year)}
					{@const x3 = rectWidth}
					{@const y3 = yScale(d.Year) + yScale.bandwidth()}
					{@const x4 = rectWidth - freePercentageScale(csvData[i + 1].Free)}
					{@const y4 = yScale(d.Year) + yScale.bandwidth()}
					{#if i === csvData.length - 2}
						{@const x5 = rectWidth - freePercentageScale(3)}
						{@const y5 = yScale(d.Year) + yScale.bandwidth() / 3}

						<polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5}`} />
					{:else}
						<polygon points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`} fill="red" />
					{/if}
				{/if}
				<text text-anchor="start" x={rectWidth + 20} dy=".32em" y={yScale(d.Year)}>
					{d.Free}%
				</text>
			{/each}
		</g>
	</svg>
</div>

<style>
	.svg-wrapper {
		width: 100%;
	}

	svg g rect {
		fill: var(--color-black);
	}

	svg polygon {
		fill: var(--color-crimson);
	}
</style>
