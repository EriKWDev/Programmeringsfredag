
const loginHTML = `
<div id="login-container">
    <h2>Please login to see Recipes!</h2>
    <button onclick="toggleSignIn();">Login!</button>
</div>
`;

const logoutHTML = `
<div id="login-container">
    <button onclick="toggleSignIn();">Logout</button>
</div>
`;

function toggleSignIn() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/plus.login");
        firebase.auth().signInWithRedirect(provider);
    } else {
        firebase.auth().signOut();
    }
}

function initApp() {
    firebase.auth().getRedirectResult().then(function(result) {
        var user = result.user;
    }).catch(function(error) {
        console.log(error)
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            console.log("Successfully signed in!", user);
            document.getElementById("main-container").innerHTML = logoutHTML;
        } else {
            // User is signed out.
            console.log("User is signed out.");
            document.getElementById("main-container").innerHTML = loginHTML;
        }
    });
}

window.onload = function() {
    initApp();
};