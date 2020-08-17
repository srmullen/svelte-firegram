<script>
  import { onMount, onDestroy } from 'svelte';
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

  let src = "https://firebasestorage.googleapis.com/v0/b/svelte-firegram.appspot.com/o/IMG_0700.JPG?alt=media&token=98e1316b-8f86-40fe-924b-0bd2863338cd";
</script>

<div class="image-grid">
  {#each docs as image}
    <div class="image-wrap">
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
    height: 0;
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