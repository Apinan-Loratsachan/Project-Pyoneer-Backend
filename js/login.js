function login() {
    loginMethodBtn = document.getElementById("loginMethodContainer").innerHTML
    document.getElementById("loginMethodContainer").innerHTML = `
        <div class="loader animate__animated animate__infinite">
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
        </div>
        <div style="height: 20px;"></div>`

    setTimeout(function () {
        document.getElementById("loginMethodContainer").innerHTML = loginMethodBtn
    }, 750);
}

function signInWithGoogle() {
    loginMethodBtn = document.getElementById("loginMethodContainer").innerHTML
    document.getElementById("loginMethodContainer").innerHTML = `
        <div class="loader animate__animated animate__infinite">
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
        </div>
        <div style="height: 20px;"></div>`
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access Google API.
            const credential = result.credential;
            // The signed-in user info.
            const user = result.user;
            // Display user information or redirect as needed
            console.log(user);
            console.log(`UID : ${user.uid}\nEmail : ${user.email}\nDisplay name : ${user.displayName}\nUser Image : ${user.photoURL}`);
        }).catch((error) => {
            document.getElementById("loginMethodContainer").innerHTML = loginMethodBtn
            // Handle errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const credential = error.credential;
            console.error(errorMessage);
        });
}

// Google Sign-Out function
function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User signed out');
    }).catch((error) => {
        // An error happened.
        console.error(error.message);
    });
}

// Firebase Authentication state observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        console.log(`User is signed in\nUID : ${user.uid}\nEmail : ${user.email}\nDisplay name : ${user.displayName}\nUser Image : ${user.photoURL}`);
        window.location.replace("user_detail.html");
    } else {
        // No user is signed in.
        console.log('No user signed in.');
    }
});