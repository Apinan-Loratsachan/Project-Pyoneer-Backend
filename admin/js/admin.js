firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        adminData = await getDocumentFromFirestore("admin", user.email)
        if (adminData == null) {
            window.location.replace("./../index.html");
        }
    }
});