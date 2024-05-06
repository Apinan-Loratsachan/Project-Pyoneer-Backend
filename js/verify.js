firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        userApproveData = await getDocumentFromFirestore("web-approve", user.email)
        if (userApproveData.approve == false) {
            document.getElementById('login-container').innerHTML = `<div id="login-form-container" class="card blur animate__animated animate__zoomIn">
            <div class="card-body info-section prevent-select">
                <div id="header" style="padding: 10px;">
                    <div style="text-align: right">
                        <a href="">
                            <i class="fa-solid fa-arrows-rotate fa-xl back-hyperlink"></i>
                        </a>
                    </div>
                    <h1 id="headerText" style="color: black; text-align: center; padding-top: 10px; margin-top: -24px;">ยืนยันตัวตน
                    </h1>
                    <div style="height: 20px;"></div>
                    <div class="text-center">โปรดติดต่อเจ้าหน้าที่ที่หมายเลข <b>098-765-4321</b> เพื่อยืนยันตัวตน และแจ้ง <b>Email</b> ของคุณที่แสดงอยู่ในข้อมูลด่านล่างให้กับเจ้าหน้าที่</div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
            <div class="container">
                <h4 id="headerText" class="prevent-all" style="color: black; text-align: center; padding-top: 10px;">ข้อมูลผู้ใช้
                </h4>
                <div style="height: 20px;"></div>
                <div class="row justify-content-md-center">
                    <div class="col col-lg-4 prevent-all" style="text-align: center;" id="user_image_container">
                        <img src="${user.photoURL}" alt="user image" class="user-detail-image prevent-all" id="user_image">
                    </div>
                    <div class="col-md-auto col-lg-6">
                        <Div id="uid">
                            <Strong class="prevent-all">UID : </Strong>${user.uid}<div style="height: 20px;"></div>
                        </Div>
                        <Div id="email">
                            <Strong class="prevent-all">Email : </Strong><span style="color: Blue;">${user.email}</span><div style="height: 20px;"></div>
                        </Div>
                        <Div id="display_name">
                            <Strong class="prevent-all">Display name : </Strong>${user.displayName}<div style="height: 20px;"></div>
                        </Div>
                    </div>
                </div>
                <div class="row justify-content-md-center">
                    <div id="looutBtnContainer" class="col col-lg-10" style="text-align: center;">
                        <button type="button" class="btn btn-danger" id="loginBtn" style="width: 100%; max-width: 600px;" onclick="signOut()">ออกจากระบบ</button>
                    </div>
                    <div style="height: 20px;"></div>
                </div>
            </div>
        </div>`
        }
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