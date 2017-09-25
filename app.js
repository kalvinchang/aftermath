const firebaseKey = config.FIREBASE_KEY;

(function() {
	const config = {
	    apiKey: firebaseKey,
	    authDomain: "aftermathcac.firebaseapp.com",
	    databaseURL: "https://aftermathcac.firebaseio.com",
	    projectId: "aftermathcac",
	    storageBucket: "aftermathcac.appspot.com",
	    messagingSenderId: "386683841943"
	};
	firebase.initializeApp(config);

	//get elements
	const txtEmail = document.getElementById('inEmail');
	const txtPassword = document.getElementById('inPass');
	const btnLogin = document.getElementById('btnLogin');
	const btnSignUp = document.getElementById('btnSignUp');
	const btnLogout = document.getElementById('btnLogout');

	//add login event
	btnLogin.addEventListener('click', e => {
		console.log("reached");
		//get email and pass (extract text)
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
		//sign in
		const promise = auth.signInWithEmailAndPassword(email, pass);
		promise.catch(e => console.log(e.message));
	});
}());

// const auth = firebase.auth();
// auth.signInWithEmailAndPassword(email, pass);
// auth.createUserWithEmailAndPassword(email, pass);
// auth.onAuthStateChanged(firebaseUser => { });

