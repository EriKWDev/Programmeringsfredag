let database = firebase.firestore()

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // logged in
        console.log("logged in!")
        database.collection("users").doc(user.uid).set({
            uid: user.uid,
            name: user.email.split("@")[0],
            picture: user.photoURL,
            email: user.email,
            displayName: user.providerData[0].displayName
        }).then((result) => {
            window.location.replace("/")
        })
    } else {
        // not logged in
        console.log("not logged in!")
    }
})

const loginGoogle = () => {
    baseProvider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(baseProvider).catch((error) => {
        console.error(error.message)
    })
}

const logout = () => {
    firebase.auth().signOut().then(() => {

    }).catch((error) => {
        console.error(error.message)
    })
}
