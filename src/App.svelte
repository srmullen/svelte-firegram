<script>
	import UploadImage from './components/UploadImage.svelte';
	import ImageGrid from './components/ImageGrid.svelte';
	import Modal from './components/Modal.svelte';

	// let modalSrc = "https://firebasestorage.googleapis.com/v0/b/svelte-firegram.appspot.com/o/IMG_0700.JPG?alt=media&token=4016e07e-eea9-4da6-90c0-a98042e752aa";
	let modalSrc = null;

	function imageSelected(event) {
		modalSrc = event.detail.url;
	}

	function closeModal() {
		modalSrc = null;
	}
</script>

<main>
	<h1>Your Pictures</h1>
	<p>The sveltiest place to share your images!</p>
	<UploadImage />
	<ImageGrid  on:select={imageSelected} />

	{#if modalSrc}
		<Modal src={modalSrc} on:close={closeModal} />
	{/if}
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
			max-width: 1000px;
		}
	}
</style>