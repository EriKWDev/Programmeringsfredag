let articleName = "article.md"

const getArticlesFromFirebase = async () => {
    let articlesSnapshot = await database.collection("Articles").where("status", "==", "done").get()
    return articlesSnapshot
}

const generateTOC = async () => {
    let articles = await getArticlesFromFirebase()
    let contentElement = document.getElementById("content")

    articles.forEach(document => {
        let article = document.data()
        article.id = document.id

        console.log(article, document)
        renderArticlePreview(article).then(renderedHTML => {
            contentElement.innerHTML += renderedHTML
        })
    })
}

generateTOC()