firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        console.log(user)
        document.getElementById('uid').innerHTML = `<Strong>UID : </Strong>${user.uid}`
        document.getElementById('email').innerHTML = `<Strong>Email : </Strong>${user.email}`
        document.getElementById('display_name').innerHTML = `<Strong>Display name : </Strong>${user.displayName}`
        const imageElement = document.createElement('img')
        imageElement.className = 'img-fluid'
        imageElement.src = user.photoURL
        imageElement.alt = "user_image"
        imageElement.id = "user_image"
        imageElement.setAttribute('style', "margin-bottom: 50px;")
        document.getElementById('user_image_container').appendChild(imageElement)
    } else {
        // No user is signed in.
        console.log('No user signed in.');
    }
});

function signOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User signed out');
    }).catch((error) => {
        // An error happened.
        console.error(error.message);
    });
}