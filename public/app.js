// SDK = Software Development Kit : 
console.log(firebase)

// Start auth : 
const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signedInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

// Log in function : 
const provider = new firebase.auth.GoogleAuthProvider();

// click event with an existing method on firebase : 
signedInBtn.onclick = () => auth.signInWithPopup(provider)

// unlog : 
signOutBtn.onclick = () => auth.signOut();

// logic to see if auth : 
auth.onAuthStateChanged(user => {
    if(user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `
            <h3> Hello ${user.displayName}! </h3>
            <p>Your email adress is ${user.email}  </p>
        `
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = "";
    }
})

// Database : 
const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');
const form = document.getElementById('form');
const secondTwo = document.getElementById('secondTwo')

// Reference to a database location : 
let thingsRef;
// Stop sending data : 
let unsubscribe;


auth.onAuthStateChanged(user => {
    if(user) {
        // Database Reference
        thingsRef = db.collection('clients');

        secondTwo.hidden = false; 

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
        secondTwo.hidden = true;
    }
});