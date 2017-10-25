const config = {
    apiKey: "AIzaSyD0Fh_eak1Z-Lm_dDf_aXlhXWtToO-APD4",
    authDomain: "aftermathcac.firebaseapp.com",
    databaseURL: "https://aftermathcac.firebaseio.com",
    storageBucket: "aftermathcac.appspot.com",
};
firebase.initializeApp(config);
const database = firebase.database();

//get elements
const btnSignUp = document.getElementById('btnSignUp');
//user data elements
const txtEmail = document.getElementById('inEmail');
const txtPassword = document.getElementById('inPass');
const txtPhone = document.getElementById('inPhone');
const txtNameFirst = document.getElementById('name-first');
const txtNameLast = document.getElementById('name-last');
const txtClasscode = document.getElementById('classcode');
const txtMathLevel = document.getElementById('math-level');
const txtStruggle = document.getElementById('struggle');

//add signup event
btnSignUp.addEventListener('click', e => {
    const auth = firebase.auth();
    //get email and pass (extract text) + other user data

    const email = txtEmail.value;
    const pass = txtPassword.value;
    const firstName = txtNameFirst.value;
    const lastName = txtNameLast.value;
    const phoneNumber = txtPhone.value;
        
    const userObj = {
        classCode: txtClasscode.value,
        mathLevel: txtMathLevel.value,
        struggle: txtStruggle.value
    };

    //sign in
    auth.createUserWithEmailAndPassword(email, pass).then(function(user) {
        console.log('account created');

        //send user data to database        
        firebase.database().ref('users/' + user.uid).set(userObj).then(
            function() {
                console.log('User data successfully stored')
            }).catch(function(error) {
                console.log(error);
            });
        //change auth database
        user.updateProfile({
            displayName: firstName + ' ' + lastName,
            phoneNumber: phoneNumber + ''
        }).then(function() {
            console.log('Auth data successfully written');
        }).catch(function(error) {
            console.log(error);
        });

        //display popup saying they're signed in
        //send email to user saying they're an official member now - add email verification later
        
        window.location.href = 'login.html';
    }).catch(function(error) {
        console.log(error.message);
    });
});