var firebaseConfig = {
    apiKey: "AIzaSyBVXsdLj3dtRv2qL6bSH6Z3JNY-WlJB5Sk",
    authDomain: "pyoneer-project.firebaseapp.com",
    projectId: "pyoneer-project",
    storageBucket: "pyoneer-project.appspot.com",
    messagingSenderId: "389838344082",
    appId: "1:389838344082:web:0a0554585d0de7fd043b4b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore()

const db = firestore.collection("news")

// document.getElementById("getData").addEventListener("click", (e) => {
//     e.preventDefault()

//     db.doc().set({
//         test: "test"
//     }).then(() => {
//         console.log("Data saved")
//     }).catch((error) => {
//         console.error(error)
//     })
// })

document.getElementById("getData").addEventListener("click", (e) => {
    e.preventDefault();

    // Get a reference to the "news" collection
    const newsCollection = firestore.collection("news");

    // Get all documents within the "news" collection
    newsCollection.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is the data of each document
            const dataDiv = document.createElement('div')
            dataDiv.innerHTML = doc.id + " => " + doc.data().topic
            document.getElementById("data").appendChild(dataDiv)

            console.log(doc.id, " => ", doc.data());
        });
    }).catch((error) => {
        console.error("Error getting documents: ", error);
    });
});
