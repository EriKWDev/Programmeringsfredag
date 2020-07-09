const renderArticle = async (article) => {
    let template = `
# ${article.title || "Title"}
*published ${article.date || "Today"}, by ${article.author || "Author"}*

${article.text || "## Hello, World!"}
    `

    return await renderMarkdown(template)
}

const renderArticlePreview = async (article) => {
    let template =
    `
### ${article.title}
*${article.date}*
    `

    return `<div class="articlePreview">${await renderMarkdown(template)}</div>`
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

    let abbreviations = ""
    return await md.render(`${abbreviations} \n\n ${markdown}`)
}