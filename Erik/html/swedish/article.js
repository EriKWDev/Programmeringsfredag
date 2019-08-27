let articleName = "article.md"

const getFile = async (fileName) => {
    let response = await fetch(fileName)
    let text = await response.text()
    return text
}

const loadArticle = (articleName) => {
    getFile(`articles/${articleName}`).then(async (text) => {
        let contentElement = document.getElementById("content")
        contentElement.innerHTML = await renderMarkdown(text)
    })
}

// loadArticle(articleName)

const getArticlesFromFirebase = async () => {
    database.collection("Articles").where("status", "==", "done").get().then(articlesSnapshot => {
        let contentElement = document.getElementById("content")

        articlesSnapshot.forEach(document => {
            let article = document.data()
            console.log(article)
            renderArticlePreview(article).then(renderedHTML => {
                contentElement.innerHTML += renderedHTML
            })
        })
    })
}

getArticlesFromFirebase()