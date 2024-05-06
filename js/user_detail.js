firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        document.getElementById('uid').innerHTML = `<Strong class="prevent-all">UID : </Strong>${user.uid}<div style="height: 20px;"></div>`
        document.getElementById('email').innerHTML = `<Strong class="prevent-all">Email : </Strong>${user.email}<div style="height: 20px;"></div>`
        document.getElementById('display_name').innerHTML = `<Strong class="prevent-all">Display name : </Strong>${user.displayName}<div style="height: 20px;"></div>`
        const imageElement = document.createElement('img')
        imageElement.classList = 'img-fluid main-hyperlink-image prevent-all'
        imageElement.src = user.photoURL
        imageElement.alt = "user_image"
        imageElement.id = "user_image"
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

// window.addEventListener('resize', function () {
//     if (window.innerHeight <= 550 || window.innerWidth <= 767) {
//         this.document.getElementById('login-container').classList.remove('padding-space')
//         this.document.getElementById('login-container').classList.add('padding-space2')
//     } else {
//         this.document.getElementById('login-container').classList.remove('padding-space2')
//         this.document.getElementById('login-container').classList.add('padding-space')
//     }
// });