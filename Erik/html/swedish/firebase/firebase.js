
const firebaseConfig = {
    apiKey: "AIzaSyCUAaxu1McSSRFCilg3ttbjvGZthL0eYr0",
    authDomain: "swedish-blog.firebaseapp.com",
    databaseURL: "https://swedish-blog.firebaseio.com",
    projectId: "swedish-blog",
    storageBucket: "swedish-blog.appspot.com",
    messagingSenderId: "689169397765",
    appId: "1:689169397765:web:11990979223afd34"
}

firebase.initializeApp(firebaseConfig)

const database = firebase.firestore()