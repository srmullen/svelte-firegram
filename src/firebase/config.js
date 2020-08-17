import * as firebase from 'firebase/app';
import 'firebase/firebase-storage';

// console.log(firebase.INTERNAL);

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