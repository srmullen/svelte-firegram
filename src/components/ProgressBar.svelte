<script>
  export let progress = 0;
</script>

<div class="progressbar" style="width: {progress}%"></div>

<style>
  .progressbar {
    background-color: var(--primary);
    height: 5px;
    margin-top: 20px;
    transition: width 1s ease-in-out;
  }
</style>