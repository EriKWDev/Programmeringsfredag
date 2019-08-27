let articleName = "article.md"

const getFile = async (fileName) => {
    let response = await fetch(fileName)
    let text = await response.text()
    return text
}

const renderMarkdown = async (markdown, useAbbreviations = true) => {
    let md = window.markdownit({
        html: true,
        linkify: true,
        typographer: true
    }).use(window.markdownitContainer, "good example", {
        validate: (params) => { 
            return params.match("good")
        }
    }).use(window.markdownitContainer, "bad example", {
        validate: (params) => { 
            return params.match("bad")
        }
    }).use(window.markdownitFootnote).use(window.markdownitAbbr).use(window.markdownitMark)

    let abbreviations = useAbbreviations ? await getFile("articles/abbreviations.md") : ""
    return await md.render(`${abbreviations} \n\n ${markdown}`)
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
             renderMarkdown(article.content).then(renderedHTML => {
                contentElement.innerHTML += renderedHTML
             })
        })
    })
}

getArticlesFromFirebase()