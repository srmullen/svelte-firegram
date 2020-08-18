<script>
  import { createEventDispatcher } from 'svelte';
  export let src;

  const dispatch = createEventDispatcher();
</script>

<div class="backdrop" on:click|self={() => dispatch('close')}>
  <img {src} alt="Modal" />
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
  }

  .backdrop img {
    max-height: 80%;
    margin: 60px auto;
    display: block;
    box-shadow: 3px 5px 7px rgba(0,0,0,0.5);
    border: 3px solid white;
    object-fit: contain;
  }
</style>