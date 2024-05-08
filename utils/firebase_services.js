var firebaseConfig = {
    apiKey: "AIzaSyBVXsdLj3dtRv2qL6bSH6Z3JNY-WlJB5Sk",
    authDomain: "pyoneer-project.firebaseapp.com",
    projectId: "pyoneer-project",
    storageBucket: "pyoneer-project.appspot.com",
    messagingSenderId: "389838344082",
    appId: "1:389838344082:web:0a0554585d0de7fd043b4b"
};

firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

firebase.auth().onAuthStateChanged(async (user) => {
    let nowPath = window.location.pathname.replace('.html','')
    if (!user && !(nowPath == '/login' || nowPath == '/Project-Pyoneer-Backend/login')) {
        if (nowPath.includes('/Project-Pyoneer-Backend')) {
            window.location.replace("/Project-Pyoneer-Backend/login.html");
        } else {
            window.location.replace("login.html");
        }
    } else if (user) {
        userApproveData = await getDocumentFromFirestore("web-approve", user.email)
        if (userApproveData.approve != true && !(nowPath == '/verify' || nowPath == '/Project-Pyoneer-Backend/verify')) {
            if (nowPath.includes('/Project-Pyoneer-Backend')) {
                window.location.replace("Project-Pyoneer-Backend/verify.html");
            } else {
                window.location.replace("verify.html");
            }
        } else if (userApproveData.approve == true && (nowPath == '/verify' || nowPath == '/Project-Pyoneer-Backend/verify')) {
            if (nowPath.includes('/Project-Pyoneer-Backend')) {
                window.location.replace("/Project-Pyoneer-Backend/login.html");
            } else {
                window.location.replace("login.html");
            }
        }
    }
});

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
    const documentRef = firestore.collection(collectionName).doc(documentId);

    // Get the document
    return documentRef.get()
        .then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
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