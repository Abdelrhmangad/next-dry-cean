// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
function initFirebase() {
	const firebaseConfig = {
		apiKey: "AIzaSyD1RcqZDrkDFqWmHVn_oAJnIZwX8TGrlAA",
		authDomain: "truckvin-600c0.firebaseapp.com",
		projectId: "truckvin-600c0",
		storageBucket: "truckvin-600c0.appspot.com",
		messagingSenderId: "1021007029122",
		appId: "1:1021007029122:web:ba6ac10dc9b1eb6cd3259b"
	};

	// Initialize Firebase
	const apps = getApps();
	if (!apps.length) {
		initializeApp(firebaseConfig);
	}
}

export const app = initFirebase();
export const database = getFirestore();
