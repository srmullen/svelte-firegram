# Build an Instagram Clone with Svelte and Firebase

Svelte Project Setup
--------------------

First we need to create a new svelte project. We use the degit tool to make a copy of the sveltejs/template repo. Change into the newly created project and install the dependencies.

```
npx degit sveltejs/template svelte-firgram
cd svelte-firegram
npm install
```

Now we can start the application.

`npm run dev`

Firebase Setup
--------------

Go to firebase.google.com and create an account if you do not already have one.

Click the 'Get Started' button and then 'Add project'. Name the project and disable analytics. When the project is ready we'll be taken to the project dashboard.

# Add Firebase to your web app

<!-- Not sure this is needed

1. Click the `</>` button. Give the app a nickname and check the box to setup Firebase Hosting. Then Click 'Register app'.
2. Copy the firebase scripts into `public/index.html` at the bottom of your body tag
3. Install the firebase CLI for hosting
  `npm install -g firebase-tools`
4. Deploy to firebase hosting
```
firebase login
firebase init
firebase deploy
```

After `firebase init` you'll be prompted to select which features you want. Choose Firestore, Functions, Hosting, Storage, and Emulators.

The CLI will ask you to choose a project. Choose the one we just setup. Get an error because I didn't set up firestore on the web console yet.
-->

The first thing we'll setup is firebase storage. This is what firebase offers for storing any types of files. We'll use it to store the images that our users will be uploading.


## Firebase storage

Navigate to the storage page on the firebase console and click 'Get started'. It will show you the default rules for the storage (all authenticated users can read/write), and let you choose the location of your storage. Choose wherever is closest to you. For now we'll allow everyone to read and write. Don't do this in production. Navigate to the rules tab under Storage and change the rules to the following.

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```

Back in our codebase we'll install the firbase tools.

`npm install firebase`

Under `src` create a new directory called `firebase` and inside it create a `config.js` file. Import firebase app and firebase storage.

On the web console go to the project setting and find your web app. Copy the 'Config SDK snippet' and paste it into your `config.js` file.

- Initialize the firebase app.
- Initialize the storage. We'll export this so it can be used to connect to firebase storage.
- Firebase needs to be loaded in the body of the HTML so move the index.html script tag.

```javascript
import * as firebase from 'firebase/app';
import 'firebase/firebase-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC05pHyU7BrAzw45jAkoESitbcQdA8ZoIE",
  authDomain: "svelte-firegram.firebaseapp.com",
  databaseURL: "https://svelte-firegram.firebaseio.com",
  projectId: "svelte-firegram",
  storageBucket: "svelte-firegram.appspot.com",
  messagingSenderId: "839981894475",
  appId: "1:839981894475:web:a9a7b24bd11f32c129f6ce"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {
  storage
};
```

## Firebase Firestore

What is Firestore?

Setup
1. On the firebase web dashboard navigate to the database page and click 'Create Database'
2. Choose 'Start in test mode'. This allows anyone to read and write to the database. It will make development easier right now, but we'll need to secure it before deploying our application.
3. Click done to finish creating the database.
4. In firebase/config.js import 'firebase/firebase-firestore'
5. Initialize the firestore and export it. `const firestore = firebase.firestore();`
6. We also want to have a timestamp on our images so we can display them in the order they were uploaded.

## Firebase Hosting (Wait until after the rest of the application is developed)

On the web console navigate to the hosting page and click 'Get started'. Follow the instructions.

1. Install firebase CLI
  `npm install -g firebase-tools`
2. Initialize the project
  `firebase login`
  `firebase init`
Incomplete

Code the web app.
-----------------

## UploadImage 

The UploadImage component will handle sending images to firebase storage. It is a form with a file input type.

- Create a components directory.
- Add the upload button/form.
  - Create components/UploadImage.svelte
  - Add basic contents and import into App.svelte.
  - Add component on the page to see that it is working.
  - Add the html
  - Style the html
  - Clear out `global.css` and add in our global styles.
   - Add visually-hidden class to`global.css`. We do this so the default file input isn't visible at all but it is still accessible to screen readers.
   ```css
    .visually-hidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: auto;
      margin: 0;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      white-space: nowrap;
    }
   ```
  - Log the change events on the file input.
  - Import storage and upload the file. Log out the percentage uploaded.
  ```javascript
    import { storage } from '../firebase/config';

    function handleChange(event) {
      const file = event.files[0];
      const storageRef = storage.ref(file.name);
      storageRef.put(file).on('state_changed', (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`${percentage}%`);
      })
    }
  ```
  - Now make sure that only images can be uploaded. Add image mime types. Try uploading an incorrect file type.
  - add error handler
    When something goes wrong we want to be able to tell that to the user. We'll see an error message when they choose an incorrect file type. We can also show them and error if something goes wrong during the upload, such as a loss of internet connection.
  - add complete handler
    Now the photos are uploading successfully. We need a way to display them. When the photo has completed uploading we'll get its storage location and save that into our firestore (aka our database).
  - import firestore from 'config.js' and save the url and createdAt timestamp.
  - Remove all the previously saved images since they do not have urls associated with them in the firestore.

  ```javascript
    import { projectStorage, projectFirestore, timestamp } from '../firebase/config';

    async () => {
        progress = 0;
        uploading = false;
        file = null;
        const url = storageRef.getDownloadURL();
        const createdAt = timestamp();
        collectionRef.add({ url, createdAt });
      }
  ```

  --- Issue ---
  Importing firebase/storage is causing issues. Not everything about firebase seems setup at the moment. Libraries aren't loaded or aren't names as expected.
  FIX: Import 'firebase/firebase-storage' rather than 'firebase/storage' Not sure why.

## Progress Bar

- Create the progress bar with full width and import it into UploadImage.
- Add the progress property and show the progress update as an image uploads.
- When the image is done uploading now the progress bar isn't removed. Handle that in the storage oncomplete handler.
- Animate the progress bar by adding transition css property. Should/could this be animated with svelte?

## Image Grid

The ImageGrid is used to display the images that we've uploaded to storage.

- Create the ImageGrid.svelte component.
- First just display the image you uploaded to storage. Get the url and put it in am image tag.
```html
  <script>
    let src = "https://firebasestorage.googleapis.com/v0/b/svelte-firegram.appspot.com/o/IMG_0700.JPG?alt=media&token=98e1316b-8f86-40fe-924b-0bd2863338cd";
  </script>

  <div class="image-grid">
    <img {src} alt="Oliver" />
  </div>
```
- Import the component into App.svelte and place it below the UploadImage component. You should see the image on the page.
- Add some styles
- Now let's load the image urls from firestore.
- Subscribe to the firestore 'images' collection. onSnapshop assign the documents to the docs property of the component.
- Use the #each template syntax to display the images.
- Now upload images and they should display in the grid.
- Now animate the images as they appear in the grid.
  - `import { fade } from 'svelte/transition'`
    - Add the fade directive. Give it duration so longer loading images still fade in.
  - `import { flip } from 'svelte/animate'`
  - flip stand for First, Last, Invert, Play. It is a strategy for optimizing the animation by precalculating the steps rather than doing them as the animation plays out.

## Modal

- Create `components/Modal.svelte` and import it into `App.svelte`
```html
<script>
  export let src;
</script>

<div class="modal">
  <img {src} alt="Modal" />
</div>
```
- Give it a src and see that it displays the image. It doesn't look like a modal right now
- Add styles so it looks like a modal.
- Now display the modal on an image click.
  - In ImageGrid create an event dispatcher.
  - Attach on:click event to the image that dispatches an event with the image url.
  - Im App listen to that event and set the modalSrc.
  - View the iamge in the modal. Can't close it now.
- Implement Modal closing on backdrop click.
  - Dispatch a close event with backdrop on:click.
  - Image closes no matter where on the page is clicked. Prevent that by adding the `self` modifier. i.e. `on:click|self`
