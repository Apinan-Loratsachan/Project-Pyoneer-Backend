var userData = {uid: null, email: null, displayName: null, photoURL: null}

function setData(key, value) {
    localStorage.setItem(key, value)
}

function getData(key) {
    return localStorage.getItem(key)
}

function removeData(key) {
    localStorage.removeItem(key)
}

function setUserData(uid, email, displayName, photoURL) {
    userData.uid = uid
    userData.email = email
    userData.displayName = displayName
    userData.photoURL = photoURL
    setData("uid", uid)
    setData("email", email)
    setData("displayName", displayName)
    setData("photoURL", photoURL)
}

function getUserData() {
    userData.uid = getData("uid")
    userData.email = getData("email")
    userData.displayName = getData("displayName")
    userData.photoURL = getData("photoURL")
}

function clearUserData() {
    userData.uid = null
    userData.email = null
    userData.displayName = null
    userData.photoURL = null
    removeData("uid")
    removeData("email")
    removeData("displayName")
    removeData("photoURL")
}