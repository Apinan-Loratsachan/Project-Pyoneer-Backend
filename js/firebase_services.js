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
        window.location.replace("login.html");
    } else {
        const approve = firestore.collection("web-approve");
        userApproveData = await getDocumentFromFirestore(approve, user.email)
        if (userApproveData.approve == false && nowPath != '/verify') {
            window.location.replace("verify.html");
        } else if (userApproveData.approve == true && nowPath == '/verify') {
            window.location.replace("user-detail.html");
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
    const documentRef = collectionName.doc(documentId);

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