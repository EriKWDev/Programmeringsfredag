const fse = require("fs-extra")
const path = require("path")

let hashtags = {}

const getMessages = async () => {
    let messages = []

    let filenames = await fse.readdir(path.join(__dirname, "dataGathering", "citat"))

    for (let filename of filenames) {
        let JSONMessages = await fse.readJSON(path.join(__dirname, "dataGathering", "citat", filename))

        for (let message of JSONMessages) {
            if (!message.subtype && message.user_profile) {
                //console.log(message)

                let newMessage = {
                    message: message.text,
                    name: message.user_profile.real_name,
                    alias: message.user_profile.display_name,
                    date: filename.split(".")[0],
                    tags: message.text.match(/\B(\#[a-zA-ZåäöÅÄÖ0-9!,.]+\b)(?!;)/g),
                    beingCited: message.text.match(/\B(\@[a-zA-ZåäöÅÄÖ0-9!,.]+\b)|\-\B(\ [a-zA-ZåäöÅÄÖ0-9!,.]+\b)/g)
                }

                if (newMessage.tags) {
                    messages.push(message)
                    console.log("MESSAGE:")
                    console.log(newMessage)
                    console.log("\n\n\n _____________________________________________ \n\n\n")

                    for(let tag of newMessage.tags) {
                        hashtags[tag] = (hashtags[tag] == undefined ? 1 : hashtags[tag] + 1)
                    }
                }
            }
        }
    }

    return messages
}


const main = async () => {
    await getMessages()

    console.log(hashtags)
    
    //console.log(await getMessages())

    let tmp = ""

    for(let tag in hashtags) {
        for(let n = 0; n < hashtags[tag]; n++) {
            tmp += tag + " "
        }
    }

    console.log(tmp)
    console.log(`Total hashtags: ${Object.keys(hashtags).length}`)

    let longest = ""
    let avg = 0

    for(let key in hashtags) {
        avg += key.length/(Object.keys(hashtags).length)
        if(key.length > longest.length) {
            longest = key
        }
    }

    console.log(`Longest hashtag is: ${longest} (${longest.length} characters!)`)
    console.log(`Average length of a hashtag is just ${avg} characters`)
}

main()