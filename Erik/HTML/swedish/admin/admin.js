

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("login").style.display = "none"
        document.getElementById("content").style.display = "block"
        console.log("Signed in!")
    } else {
        document.getElementById("login").style.display = "block"
        document.getElementById("content").style.display = "none"
        console.log("Not signed in.")
    }
  })

const loginAdmin = () => {
    let email = document.getElementById("email").value
    let password = document.getElementById("pass").value

    if(email != "" && password != "" && email.split("@").length == 2) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            console.error(error.code)
            console.error(error.message)
        })
    }
}

const logOut = () => {
    firebase.auth().signOut()
}