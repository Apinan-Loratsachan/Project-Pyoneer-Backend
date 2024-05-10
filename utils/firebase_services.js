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
        
        // Check if the user is a teacher and set teacherCode
        if (userApproveData.isTeacher) {
            const userDoc = await firestore.collection('users').doc(user.email).get();
            const userData = userDoc.data();
        
            if (userData && userData.teacherCode) {
                console.log('User already has a teacherCode:', userData.teacherCode);
            } else {
                let teacherCode = '';
                let isTeacherCode = await isTeacherCodeExists(teacherCode);
        
                while (isTeacherCode) {
                    teacherCode = generateTeacherCode();
                    console.log('Generated new teacherCode:', teacherCode);
                    isTeacherCode = await isTeacherCodeExists(teacherCode);
                    console.log('isTeacherCode:', isTeacherCode);
                }
        
                await setTeacherCode(user.email, teacherCode);
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


function generateTeacherCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log('Generated teacherCode:', code);
    return code;
}

async function isTeacherCodeExists(teacherCode) {
    try {
      const usersCollection = firestore.collection('users');
      const querySnapshot = await usersCollection.get();
      let exists = false;
  
      querySnapshot.forEach((doc) => {
        if (doc.data().teacherCode === teacherCode) {
          exists = true;
        }
      });
  
      return exists;
    } catch (error) {
      console.error('Error in isTeacherCodeExists:', error);
      return false;
    }
  }

  async function setTeacherCode(email, teacherCode) {
    try {
      const usersCollection = firestore.collection('users');
      const userDoc = await usersCollection.doc(email).get();
  
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData.teacherCode !== teacherCode) {
          await usersCollection.doc(email).update({ teacherCode: teacherCode });
          console.log('teacherCode updated successfully for email:', email);
        } else {
          console.log('teacherCode is already up-to-date for email:', email);
        }
      } else {
        await usersCollection.doc(email).set({ teacherCode: teacherCode });
        console.log('teacherCode set successfully for email:', email);
      }
    } catch (error) {
      console.error('Error setting teacherCode:', error);
    }
  }