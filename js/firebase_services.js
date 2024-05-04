var firebaseConfig = {
    apiKey: "AIzaSyBVXsdLj3dtRv2qL6bSH6Z3JNY-WlJB5Sk",
    authDomain: "pyoneer-project.firebaseapp.com",
    projectId: "pyoneer-project",
    storageBucket: "pyoneer-project.appspot.com",
    messagingSenderId: "389838344082",
    appId: "1:389838344082:web:0a0554585d0de7fd043b4b"
};

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
    if (!user && !(window.location.pathname == '/login.html' || window.location.pathname == '/Project-Pyoneer-Backend/login.html')) {
        window.location.replace("login.html");
    }
});