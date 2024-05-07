getUserData()

document.getElementById('uid').innerHTML = `<Strong class="prevent-all">UID : </Strong>${userData.uid}<div style="height: 20px;"></div>`
document.getElementById('email').innerHTML = `<Strong class="prevent-all">Email : </Strong>${userData.email}<div style="height: 20px;"></div>`
document.getElementById('display_name').innerHTML = `<Strong class="prevent-all">Display name : </Strong>${userData.displayName}<div style="height: 20px;"></div>`
const imageElement = document.createElement('img')
imageElement.classList = 'user-detail-image prevent-all'
imageElement.src = userData.photoURL
imageElement.alt = "user_image"
imageElement.id = "user_image"
document.getElementById('user_image_container').appendChild(imageElement)

function signOut() {
    clearUserData()
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log('User signed out');
    }).catch((error) => {
        // An error happened.
        console.error(error.message);
    });
}