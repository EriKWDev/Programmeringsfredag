let hiragana = [
    "a",  "i",  "u",  "e",  "o",
    "ka", "ki", "ku", "ke", "ko",
    "ha", "hi", "fu", "he", "ho",
    "ma", "mi", "mu", "me", "mo",
    "na", "ni", "nu", "ne", "no",
]

let articles = [
    "ha", "no", "mo", "to", "ga", "ya", "de", "he", "ni",
]

let articlesWithWo = [
    "ha", "no", "mo", "to", "ga", "ya", "de", "he", "ni",
    "wo",
]

const generateRandomSentence = () => {
    return getRandomWord() + " " + getRandomArticle() + " " + getRandomWord();
}

const getRandomWord = () => {
    let word = ""
    for(let i = 0; i < Math.ceil(Math.random()*4); i++) {
        word += hiragana[Math.ceil(Math.random()*hiragana.length) - 1];
    }
    return word;
}

const getRandomArticle = (hasUsedWo) => {
    let n = Math.ceil(Math.random()*articles.length) - 1
    if(hasUsedWo) {
        return articles[n]
    } else {
        return articlesWithWo[n]
    }
}

for(let i = 0; i < 100; i++) {
    console.log(generateRandomSentence())
}