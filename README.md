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
import 'firebase/storage';

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

Hosting (Wait until after the rest of the application is developed)
-------

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

    function uploadImage(event) {
      const file = event.files[0];
      const storageRef = storage.ref(file.name);
      storageRef.put(file).on('state_changed', (snapshot) => {
        const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`${percentage}%`);
      })
    }
  ```

  --- Issue ---
  Importing firebase/storage is causing issues. Not everything about firebase seems setup at the moment. Libraries aren't loaded or aren't names as expected.
  FIX: Import 'firebase/firebase-storage' rather than 'firebase/storage' Not sure why.
