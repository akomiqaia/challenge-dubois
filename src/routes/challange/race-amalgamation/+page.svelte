<script lang="ts">
	export let data;
	const csvData = data.csvData;
</script>

<div class="wrapper">
	<div class="title">
		<h2>Race Amalgamation In Georgia</h2>
		<h4>Based on a study of 40 000 individuals</h4>
	</div>

	<div class="graph">
		<div class="left">
			{#each csvData as d}
				<div class="text-wrapper" style="height: {d.Percentage}%;">
					<h3>{d.Category}</h3>
					<p>{d.Description}</p>
				</div>
			{/each}
		</div>
		<div class="right">
			{#each csvData as d}
				<div class="bar {d.Category.toLowerCase()}" style="height: {d.Percentage}%;">
					<p>
						{d.Percentage}%
					</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
	}
	.title {
		text-transform: uppercase;
		margin: 0 auto;
		max-width: 500px;
		text-align: center;
	}

	.graph {
		width: 100%;
		height: 600px;
		display: flex;
		justify-content: center;
	}
	p {
		margin: 0;
	}
	.left h3,
	.left p {
		max-width: 200px;
    margin: 0;
	}
  .left h3 {
    font-family: "Public Sans", sans-serif;
    font-size: 1.5rem;
    padding-right: 90%;
  }
	.text-wrapper {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		flex-direction: column;
		/* padding-top: 10px; */
	}
	.bar {
		width: 200px;
		display: flex;
		justify-content: center;
		align-items: center;
    font-family: "Public Sans", sans-serif;
    font-weight: 900;
		&.brown {
			background-color: var(--color-brown);
			color: var(--color-crimson);
		}
		&.yellow {
			background-color: var(--color-gold);
			color: var(--color-black);
		}
		&.black {
			background-color: var(--color-black);
			color: whitesmoke;
		}
	}
</style>
