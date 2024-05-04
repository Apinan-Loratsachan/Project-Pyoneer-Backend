var firestore = firebase.firestore();

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
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // User is signed in.
        const approve = firestore.collection("web-approve");
        userApproveData = await getDocumentFromFirestore(approve, user.email)
        if (userApproveData != null) {
            if (userApproveData.approve == true) {
                window.location.replace("user-detail.html");
            } else {
                window.location.replace("verify.html");
            }
        } else {
            await writeToFirestore(approve, user.email, { UID: user.uid, Name: user.displayName, approve: false });
            window.location.replace("verify.html");
        }
    } else {
        // No user is signed in.
        document.body.innerHTML = `<div class="container padding-space" id="login-container">
        <div id="login-form-container" class="card blur animate__animated animate__zoomIn">
            <div class="card-body info-section">
                <div id="header" style="padding: 10px;">
                    <h1 id="headerText" style="color: black; text-align: center; padding-top: 10px;">เข้าสู่ระบบ
                    </h1>
                </div>
                <div id="liveAlertPlaceholder"></div>
            </div>
            <div class="container">
                <div class="row justify-content-md-center">
                    <div class="col col-lg-4">
                        <img class="img-fluid prevent-all" src="assets/icons/pyoneer_bg_less.png" alt="pyoneer logo">
                    </div>
                    <div class="col-md-auto col-lg-6">
                        <form action="javascript:;" onsubmit="loginWithEmailPassword()">
                            <div class="form-group">
                                <label for="InputEmail">อีเมล</label>
                                <input type="email" class="form-control" id="InputEmail" aria-describedby="emailHelp"
                                    placeholder="Email" required>
                                <small id="emailHelp" class="form-text text-muted"></small>
                            </div>
                            <div style="height: 20px;"></div>
                            <div class="form-group">
                                <label for="InputPassword">รหัสผ่าน</label>
                                <input type="password" class="form-control" id="InputPassword" placeholder="Password" required>
                            </div>
                            <div style="height: 20px;"></div>
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" id="rememberEmail">
                                <label class="form-check-label" for="exampleCheck1">จดจำอีเมล</label>
                            </div>
                            <div style="height: 20px;"></div>
                            <div id="loginMethodContainer">
                                <div id="loginBtnContainer">
                                    <button type="submit" class="btn btn-dark" id="loginBtn" 
                                        style="width: 100%;">เข้าสู่ระบบ</button>
                                </div>
                                <div class="text-center my-3">
                                    หรือ
                                </div>
                                <div id="googleLoginContainer">
                                    <button type="button" class="btn btn-primary" id="googleLoginBtn"
                                        onclick="signInWithGoogle()" style="width: 100%;">เข้าสู่ระบบด้วย
                                        Google</button>
                                </div>
                            </div>
                            <div style="height: 20px;"></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>`
        if (window.innerHeight <= 785 || window.innerWidth <= 767) {
            this.document.getElementById('login-container').classList.remove('padding-space')
            this.document.getElementById('login-container').classList.add('padding-space2')
        } else {
            this.document.getElementById('login-container').classList.remove('padding-space2')
            this.document.getElementById('login-container').classList.add('padding-space')
        }

        if (localStorage.getItem("rememberEmail") == 'true') {
            document.getElementById('rememberEmail').checked = true
            document.getElementById('InputEmail').value = localStorage.getItem("email")
        }
        console.log('No user signed in.');
    }
});

window.addEventListener('resize', function () {
    if (window.innerHeight <= 785 || window.innerWidth <= 767) {
        this.document.getElementById('login-container').classList.remove('padding-space')
        this.document.getElementById('login-container').classList.add('padding-space2')
    } else {
        this.document.getElementById('login-container').classList.remove('padding-space2')
        this.document.getElementById('login-container').classList.add('padding-space')
    }
});

function loginWithEmailPassword() {

    closeAlert()

    email = document.getElementById('InputEmail').value
    password = document.getElementById('InputPassword').value
    loginMethodBtn = document.getElementById("loginMethodContainer").innerHTML

    if (document.getElementById('rememberEmail').checked) {
        localStorage.setItem("rememberEmail", true);
        localStorage.setItem("email", email);
    } else {
        localStorage.setItem("rememberEmail", false);
        localStorage.setItem("email", '');
    }
    console.log(localStorage.getItem("rememberEmail"))

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
    try {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log('User signed in:', user);
                // Redirect or perform any other actions here
            })
            .catch((error) => {
                localStorage.setItem("email", '');
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Login error:', errorMessage);
                document.getElementById("loginMethodContainer").innerHTML = loginMethodBtn
                const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
                const appendAlert = (message, type) => {
                    const wrapper = document.createElement('div')
                    wrapper.innerHTML = [
                        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                        `   <div>${message}</div>`,
                        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="closeAlert()"></button>',
                        '</div>'
                    ].join('')

                    alertPlaceholder.append(wrapper)
                }

                appendAlert('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'danger')
                // Display error message to the user if needed
            });
    }
    catch (e) {
        document.getElementById("loginMethodContainer").innerHTML = loginMethodBtn
    }
}

function closeAlert() {
    document.getElementById('liveAlertPlaceholder').innerHTML = ''
}

function writeToFirestore(collectionName, documentId, data) {
    // Reference to the document
    const documentRef = collectionName.doc(documentId);

    // Set the data to the document
    return documentRef.set(data)
        .then(() => {
            console.log("Document written successfully!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
}

function getDocumentFromFirestore(collectionName, documentId) {
    // Reference to the document
    const documentRef = collectionName.doc(documentId);

    // Get the document
    return documentRef.get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                return doc.data();
            } else {
                console.log("No such document!");
                return null;
            }
        })
        .catch((error) => {
            console.error("Error getting document:", error);
            return null;
        });
}