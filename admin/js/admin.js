firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        let nowPath = window.location.pathname.replace('.html','')
        adminData = await getDocumentFromFirestore("admin", user.email)
        if (adminData == null) {
            if (nowPath.includes('/Project-Pyoneer-Backend')) {
                window.location.replace("./../Project-Pyoneer-Backendlogin.html");
            } else {
                window.location.replace("./../index.html");
            }
        }
    }
});