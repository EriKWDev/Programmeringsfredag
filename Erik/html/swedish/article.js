let articleName = "article.md"

const getFile = async (fileName) => {
    let response = await fetch(fileName)
    let text = await response.text()
    return text
}

const loadArticle = (articleName) => {
    getFile(articleName).then(async (text) => {
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
        
        let abbreviations = await getFile("abbreviations.md")
        document.getElementById("content").innerHTML = await md.render(`${abbreviations} \n\n ${text}`)
    })
}

loadArticle(articleName)