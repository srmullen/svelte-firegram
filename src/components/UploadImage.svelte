<script>
  import { storage, firestore, timestamp } from '../firebase/config';
  import ProgressBar from './ProgressBar.svelte';

  let progress = 0;
  let error;
  let uploading = false;
  let file = null;

  const types = ['image/png', 'image/jpeg'];

  function handleChange(event) {
    error = null;
    file = event.target.files[0];
    if (file && types.includes(file.type)) {
      const storageRef = storage.ref(file.name);
      const collectionRef = firestore.collection('images');
      uploading = true;
      storageRef.put(file).on('state_changed', (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress = percentage;
      }, (err) => {
        error = 'Something went wrong!';
        progress = 0;
        uploading = false;
        console.log(error);
      }, async () => {
        progress = 0;
        uploading = false;
        file = null;
        const url = await storageRef.getDownloadURL();
        const createdAt = timestamp();
        collectionRef.add({ url, createdAt });
      });
    } else {
      error = 'Please select an image file (png or jpeg).';
    }
  }
</script>

<form>
  <label>
    <input class="visually-hidden" type="file" on:change={handleChange} />
    <span>+</span>
  </label>
  <div class="output"></div>
</form>
<div class="output">
  {#if error}
    <div class="error">{error}</div>
  {/if}
  {#if file}
    <div>{file.name}</div>
  {/if}
  {#if uploading}
    <ProgressBar {progress} />
  {/if}
</div>

<style>
  label {
    display: block;
    width: 30px;
    height: 30px;
    color: var(--primary);
    border: 1px solid var(--primary);
    border-radius: 50%;
    margin: 10px auto;
    line-height: 30px;
    font-weight: bold;
    font-size: 24px;
  }

  label:hover {
    background-color: var(--primary);
    color: white;
  }
  
</style>