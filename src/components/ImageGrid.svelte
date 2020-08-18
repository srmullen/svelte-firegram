<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { firestore } from '../firebase/config';

  let unsubscribe;
  let docs = [];

  onMount(() => {
    unsubscribe = firestore.collection('images')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const documents = [];
        snapshot.forEach(doc => { 
          documents.push({ ...doc.data(), id: doc.id });
        });
        docs = documents;
      });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  })
</script>

<div class="image-grid">
  {#each docs as image (image.id)}
    <div class="image-wrap" animate:flip={{ duration: 500 }} transition:fade={{duration: 2000}}>
      <img src={image.url} alt="Oliver" />
    </div>
  {/each}
</div>

<style>
  .image-grid {
    margin: 20px auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 40px;
  }

  .image-wrap {
    overflow: hidden;
    padding: 50% 0;
    position: relative;
    opacity: 0.8;
    transition: opacity 0.4s ease;
  }

  .image-wrap:hover {
    opacity: 1;
  }

  .image-wrap img {
    min-width: 100%;
    min-height: 100%;
    max-width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>