<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';

	export let data;
	const csvData: { Year: string; Free: number }[] = data.csvData
		.map((d) => {
			return {
				Year: d.Year.toString(),
				Free: d.Free === 100 ? 7 : d.Free
			};
		})
		.reverse();

	let width = 300;
	let height = 600;

	const yTicks = csvData.map((d) => d.Year);

	const xTicks = [3, 2, 1];
	const padding = { top: 20, right: 15, bottom: 10, left: 15 };

	$: xScale = scaleLinear().domain([3, 0]).range([0, width]);

	$: yScale = scaleBand()
		.domain(yTicks)
		.range([height + height / yTicks.length, 0]);

	$: path = `M${csvData.map((d) => {
		return `${xScale(d.Free)},${yScale(d.Year)}`;
	})}`;

	$: redArea = `${path}L${xScale(0)},${yScale(csvData[csvData.length - 1].Year)}L${xScale(0)},${yScale(csvData[0].Year)}Z`;

	// generate  torn effect by adding random points to polygon
	const randomPoints = (n: number) => {
		let points: string[] = [];

		// split the height into n points that are randomly distributed and sorted
		const yPoints = Array.from({ length: n }, () => Math.random() * height - padding.bottom).sort(
			(a, b) => b - a
		);

		// for each y point, add a random x point
		yPoints.forEach((y) => {
			const x = Math.random() * 8;
			points.push(`${x},${y}`);
		});
		return points.join(' ');
	};
	const tornEffectPoints = `0,0 ${width},0 ${width},${height - padding.bottom} 0,${height - padding.bottom}  ${randomPoints(500)} 0,0`;
</script>

<h2>Slaves and Free Black People</h2>

<div class="area-chart" bind:clientWidth={width}>
	<svg>
		<defs>
			<clipPath id="clipPathId">
				<polygon points={tornEffectPoints} />
			</clipPath>
			<clipPath id="tornEffect"> </clipPath>
		</defs>
		<!-- data -->
		<g class="red-area" clip-path="url(#clipPathId)">
			<rect x="0" y="0" stroke="#000000" stroke-miterlimit="10" {width} {height} />
			<path fill="var(--color-crimson)" d={redArea} />
			<path class="path-line" d={path} />
		</g>

		<!-- y axis -->
		<g>
			{#each yTicks as tick}
				<g class="tick" transform="translate(0, {yScale(tick)})">
					<line x2="100%" />
					<text text-anchor="end" dy=".32em" x={-25}>{tick}</text>
				</g>
			{/each}
		</g>
		<g transform="translate({width + 25}, -60)" class="cardo-bold">
			<text text-anchor="middle">Percentage of</text>
			<text dy="1em" text-anchor="middle">free</text>
			<text dy="2em" text-anchor="middle">black people</text>
		</g>
		<g>
			{#each yTicks as tick, i}
				<text text-anchor="start" x={width + 25} dy=".32em" y={yScale(tick)}>
					{csvData[i].Free === 7 ? 100 : csvData[i].Free}%
				</text>
			{/each}
		</g>

		<!-- x axis -->
		<g class="axis x-axis">
			{#each xTicks as tick}
				<g transform="translate({xScale(tick) - 10}, {-10})">
					<text text-anchor="start">{tick}%</text>
					<line x1={10} y1={0} x2={10} y2={10} stroke="black" />
				</g>
			{/each}
		</g>
	</svg>
</div>

<style>
	.area-chart {
		width: 100%;
		max-width: 300px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 70px;
	}

	svg {
		position: relative;
		width: 100%;
		height: 600px;
		overflow: visible;
	}

	.tick line {
		stroke: white;
		stroke-width: 1.5;
	}

	.path-line {
		fill: none;
		stroke: white;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1.5;
	}
</style>
