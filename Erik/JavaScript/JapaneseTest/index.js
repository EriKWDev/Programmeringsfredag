const request = require("request")

const api = "https://jisho.org/api/v1/search/words"
let hiragana = [
    "a",  "i",  "u",  "e",  "o",
    "ka", "ki", "ku", "ke", "ko",
    "ha", "hi", "fu", "he", "ho",
    "ma", "mi", "mu", "me", "mo",
    "na", "ni", "nu", "ne", "no",
]
let words = []
let nonWorking = []

class Word {
    constructor(romaji, kanji, hiragana, meaning) {
        this.romaji = romaji
        this.kanji = kanji
        this.hiragana = hiragana
        this.meaning = meaning
    }
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const getWord = async (word) => {
    request(`${api}?keyword=${word.toLowerCase()}`, (error, response, body) => {
        if(error || response.statusCode != 200) {
            nonWorking.push(new Word(word))
            return
        }
        let data = JSON.parse(body)["data"][0]

        if(data == undefined) {
            return
        }
        //console.log(data)
        let newWord = new Word(
            word,
            data["japanese"][0].word,
            data["japanese"][0].reading,
            data["senses"][0]["english_definitions"][0]
        )

        if(newWord.hiragana != undefined && newWord.hiragana.length == 2 && newWord.kanji != undefined) {
            words.push(newWord)
        } else {
            nonWorking.push(newWord)
        }
    })
}

const getWords = async () => {
    let n = 0;

    for(let syllable1 of hiragana) {
        for(let syllable2 of hiragana) {
            getWord(`${syllable1}${syllable2}`)
            n++;
        }
    }

    return await sleep(hiragana.length * 500)
}

const main = async () => {
    await getWords()
    //console.log(words)
    console.log("Non-working:")
    let text = ""
    for(let word of nonWorking) {
        text += `${word.romaji}, `
    }
    console.log(text)
}

main()