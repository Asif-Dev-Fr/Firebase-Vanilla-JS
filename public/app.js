// SDK = Software Development Kit : 
// console.log(firebase)

// Start auth : 
const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signedInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

// Section login with email 
let authEmail = document.getElementById('authEmail');

let register = document.getElementById('registerWithEmail');
let registerSection = document.getElementById('registerSection');
let registerForm = document.getElementById('registerForm');

let signWithEmail = document.getElementById('signWithEmail');
let loginSection = document.getElementById('loginSection');
let loginForm = document.getElementById('loginForm');

// Login with google : 
const provider = new firebase.auth.GoogleAuthProvider();

signedInBtn.onclick = () => auth.signInWithPopup(provider)

// unlog : 
signOutBtn.onclick = () => auth.signOut();

// Register with an email : 
register.addEventListener("click", () => {
    registerSection.hidden = false;
    loginSection.hidden = true ? loginSection.hidden = true : '';
});

registerForm.onsubmit = (e) => {
    e.preventDefault();

    let userEmail = document.getElementById('userEmail').value;
    let userPassword = document.getElementById('userPassword').value;

    //Create User with Email and Password
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
};

// Login with an email :
signWithEmail.onclick = () => {
    loginSection.hidden = false;
    if(registerSection.hidden = true) {
        registerSection.hidden = true;
    }
};

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let loginEmail = document.getElementById('loginEmail').value;
    let loginPassword = document.getElementById('loginPassword').value;

    firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });

});


// Set an authentication state observer and get user data of the user connected : 
auth.onAuthStateChanged(user => {
    if(user) {
        console.log(user)
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        register.classList.add('hidden');
        authEmail.classList.add('hidden');
        let loggendWithEmail = user.email.substring(0, user.email.indexOf("@"));
        let currentUser = user.displayName === null ? loggendWithEmail.charAt(0).toUpperCase() + loggendWithEmail.slice(1) : user.displayName;
        userDetails.innerHTML = `
            <h3> Hello ${currentUser}! </h3>
            <p>Your email adress is ${user.email}  </p>
        `
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        register.classList.remove('hidden');
        authEmail.classList.remove('hidden');
        userDetails.innerHTML = "";
    }
});


// Database : 
const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');
const form = document.getElementById('form');
const sectionDatabase = document.getElementById('sectionDatabase')

// Reference to a database location : 
let thingsRef;
// Stop sending data : 
let unsubscribe;


auth.onAuthStateChanged(user => {
    if(user) {
        // Database Reference
        thingsRef = db.collection('clients');

        sectionDatabase.hidden = false; 

        form.onsubmit = (e) => {
            e.preventDefault();
            let messageInput = document.getElementById('message').value;
            
            // Add object to database 
            thingsRef.add({
                id: user.uid,
                message: messageInput,
                // serverTimestramp() = Date.now()
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            // clear input : 
            form.reset()
        }

        // Fetch those data 
        // To match the information that you are getting based on the user that is connected : 
        unsubscribe = thingsRef
            .where('id', '==', user.uid)
            // .orderBy('createdAt') // Requires a query
            .onSnapshot(querySnapshot => {
                // Map results to an array of li elements
                const items = querySnapshot.docs.map(doc => {
                    return `<li class="list">${doc.data().message}</li>`
                });
                thingsList.innerHTML = items.join('');
            });

    } else {
        // Unsubscribe when the user signs out
        unsubscribe && unsubscribe();
        sectionDatabase.hidden = true;
    }
});

