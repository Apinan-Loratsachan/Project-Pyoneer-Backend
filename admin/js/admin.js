firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        let nowPath = window.location.pathname.replace('.html','')
        adminData = await getDocumentFromFirestore("admin", user.email)
        if (adminData == null) {
            if (nowPath.includes('/Project-Pyoneer-Backend')) {
                window.location.replace("./../Project-Pyoneer-Backend/login.html");
            } else {
                window.location.replace("./../login.html");
            }
        }
    }
});