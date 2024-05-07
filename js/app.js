logoResize()
getUserData()

document.getElementById('user_image').src = userData.photoURL;

firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        // document.getElementById('user_image').style.opacity = '0'; // Fade out the image
        // setTimeout(() => {
        //     document.getElementById('user_image').src = user.photoURL;
        //     document.getElementById('user_image').style.opacity = '1'; // Fade in the new image
        // }, 500); // Adjust the time according to your preference

        adminData = await getDocumentFromFirestore("admin", user.email)
        if (adminData != null) {
            document.getElementById('adminContainer').innerHTML = `
    <div style="height: 30px"></div>
    <div class="card blur animate__animated animate__bounceIn">
        <div class="card-body">
            <div id="header" style="padding-top: 10px; padding-bottom: 0px;">
                <h4 id="headerText" style="color: black; text-align: center; padding-top: 10px;">เครื่องมือผู้ดูแล</h4>
            </div>
            <div id="liveAlertPlaceholder"></div>
        </div>
        <div class="container main-menu-container">
            <div class="row justify-content-md-center">
                <div class="text-center main-hyperlink-container">
                    <a href="javascript:window.location.replace('admin/approve.html')" class="main-hyperlink">
                        <div>
                            <img src="assets/images/approve.jpg" alt="logo ค้นหา" class="main-hyperlink-image prevent-all">
                        </div>
                        <div class="main-hyperlink-text">อนุมัติ</div>
                    </a>
                </div>
                <div class="text-center main-hyperlink-container">
                    <a href="javascript:window.location.replace('querylist.html')" class="main-hyperlink">
                        <div>
                            <img src="assets/images/querylist.jpg" alt="logo ค้นหา" class="main-hyperlink-image prevent-all">
                        </div>
                        <div class="main-hyperlink-text">Menu 2</div>
                    </a>
                </div>
                <div class="text-center main-hyperlink-container">
                    <a class="main-hyperlink" href="javascript:window.location.replace('user-detail.html')">
                        <div id="user_image_container">
                            <img src="assets/icons/pyoneer_logo.png" alt="user image" class="main-hyperlink-image prevent-all">
                        </div>
                        <div class="main-hyperlink-text">Menu 3</div>
                    </a>
                </div>
            </div>
        </div>
    </div>`
        }
    } else {
        // No user is signed in.
        console.log('No user signed in.');
    }
});

window.addEventListener('resize', function () {
    logoResize()
});

function logoResize() {
    if (window.innerWidth >= 575) {
        document.getElementById('logoContainer').className = 'logoPadding'
    } else {
        document.getElementById('logoContainer').className = ''
    }
}