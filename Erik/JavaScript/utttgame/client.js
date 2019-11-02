var socket = io("http://localhost")
const tweetContainer = document.getElementById("tweet-container")

function createTweet(tweet) {
    let HTML =
    `
    <div class="tweet">
        <img width="30" class="tweet-image" src="${tweet.user.profile_image_url}">
        <p class="tweet-text">${tweet.text}</p>
    </div>
    `
    return HTML
}

socket.on("tweet", (tweet) => {
    tweetContainer.innerHTML = `${createTweet(tweet)}${tweetContainer.innerHTML}`
})