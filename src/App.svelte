<script>
	import UploadImage from './components/UploadImage.svelte';
</script>

<main>
	<h1>Your Pictures</h1>
	<p>The sveltiest place to share your images!</p>
	<UploadImage />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>