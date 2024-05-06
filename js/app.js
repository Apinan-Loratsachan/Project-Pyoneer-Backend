firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        document.getElementById('user_image').style.opacity = '0'; // Fade out the image
        setTimeout(() => {
            document.getElementById('user_image').src = user.photoURL;
            document.getElementById('user_image').style.opacity = '1'; // Fade in the new image
        }, 500); // Adjust the time according to your preference
    } else {
        // No user is signed in.
        console.log('No user signed in.');
    }
});