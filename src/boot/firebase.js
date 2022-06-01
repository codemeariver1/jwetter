import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBo8fq0JMJOoiuLerypup8CDbXBYGD_tc8",
  authDomain: "jwetter-1.firebaseapp.com",
  projectId: "jwetter-1",
  storageBucket: "jwetter-1.appspot.com",
  messagingSenderId: "1022050441268",
  appId: "1:1022050441268:web:3c50bad7ccbc80ce5bd261",
};

const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
let db = firebase.firestore(app);

export default db;
