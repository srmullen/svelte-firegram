<script>
  import { storage } from '../firebase/config';

  function uploadImage(event) {
    const file = event.target.files[0];
    const storageRef = storage.ref(file.name);
    storageRef.put(file).on('state_changed', (snapshot) => {
      const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`${percentage}%`);
    });
  }
</script>

<form>
  <label>
    <input class="visually-hidden" type="file" on:change={uploadImage} />
    <span>+</span>
  </label>
  <div class="output"></div>
</form>

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