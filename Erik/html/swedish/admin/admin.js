

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

const publishArticle = () => {
    let article = getArticle()
    
    if(article.title != "" && article.author != "" && article.date != "" && article.text != "") {
        database.collection("Articles").add(article)
    }
}

const getArticle = () => {
    let title = document.getElementById("title").value
    let author = document.getElementById("author").value
    let date = document.getElementById("date").value
    let text = document.getElementById("article").value

    return {
        title: title,
        author: author,
        date: date,
        text: text,
        status: "done"
    }
}

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

const preview = async () => {
    document.getElementById("preview").innerHTML = await renderArticle(getArticle()).catch(error => {console.log(error)})
}

document.getElementById("article").addEventListener("keyup", () => {
    preview()
})

document.getElementById("title").addEventListener("keyup", () => {
    preview()
})

document.getElementById("date").addEventListener("change", () => {
    preview()
})

document.getElementById("author").addEventListener("keyup", () => {
    preview()
})