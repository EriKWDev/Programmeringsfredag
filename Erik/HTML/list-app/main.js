let database = firebase.firestore()
let currentUser = null
let currentUserFriends = []
let currentData = {}
let currentFriendsData = {}
let focusId = ""

const defaultNewCategory = "abc";

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // logged in
        database.collection("users").doc(user.uid).get().then((result) => {
            currentUser = result.data()
            database.collection("users").where("friends", "array-contains", user.uid).get().then((result) => {
                result.forEach(doc => {
                    let friend = doc.data()
                    currentUserFriends.push(friend)
                })
                createUI()
                getData()
            })
        })
    } else {
        // not logged in
        currentUser = null
        window.location.replace("/login")
    }
})

const createUI = () => {
    let userElement = document.getElementById("user")
    let HTML = ``

    if(currentUserFriends.length > 0) {
        HTML += `<i class="fa fa-users"></i>`

        for(let friend of currentUserFriends) {
            console.log(friend)
            HTML += 
            `
                <img title="${friend.displayName}: ${friend.email}" class="user-img" src="${friend.picture}" alt="${friend.displayName}">
            `
        }
    }

    HTML +=
    `
    <i class="fa fa-user"></i>
    <img title="${currentUser.displayName}: ${currentUser.email}" class="user-img" src="${currentUser.picture}" alt="${user.displayName}">
    <a class="logout-button" onClick="logout()">Logout</a>
    `
    userElement.innerHTML = HTML
}

const getData = async () => {
    if (currentUser != null) {
        database.collection("items").where("uid", "==", currentUser.uid).onSnapshot((data) => {
            currentData = {}
            
            data.forEach((doc) => {
                let item = doc.data()
                item.id = doc.id
                currentData[item.id] = item
            })

            updateTable()
            focus()
        })
    }

    if (currentUserFriends.length > 0) {
        currentUserFriends.forEach((friend) => {
            database.collection("items").where("uid", "==", friend.uid).onSnapshot((friendData) => {
                let thisFriendDict = {}
                friendData.forEach((doc) => {
                    let item = doc.data()
                    console.log("FRIENDS", item)
                    item.id = doc.id
                    thisFriendDict[item.id] = item
                })
                currentFriendsData[friend.uid] = thisFriendDict

                updateTable()
                focus()
            })
        })
    }
}

const focus = () => {
    let focusElement = document.getElementById(`${focusId}-input-title`)
    if (focusElement != null) {
        focusElement.focus()
    }
}

const updateTable = async () => {
    let listElement = document.getElementById("list-container")
    let HTML = 
    `
    <table>
    <colgroup>
        <col span="1" class="category-column">
        <col span="1" class="title-column">
        <col span="1" class="location-column">
        <col span="1">
        <col span="1">
        <col span="1">
    </colgroup>
    <tr class="list-item table-headers">
        <th>Kategori</th>
        <th>Namn</div>
        <th>Plats</div>
        <th>Mängd</div>
        <th>Datum</div>
        <th>Inställningar</div>
    </tr>
    `
    previousCategory = "-1"
    previousColor = "-1"
    
    let combinedData = {}
    for (let friend of currentUserFriends) {
        for(let friendItemKey in currentFriendsData[friend.uid]) {
            let friendItem = currentFriendsData[friend.uid][friendItemKey]
            combinedData[friendItem.id] = friendItem
        }
    }

    for (let itemKey in currentData) {
        let item = currentData[itemKey]
        combinedData[item.id] = item
    }

    let items = Object.keys(combinedData).map((key) => {
        return combinedData[key];
    })

    items = items.sort((a, b) => {
        if (a.category.trim().toLowerCase() == b.category.trim().toLowerCase()) {
            if (a.color == b.color) {
                return a.added == false ? -1 : 1
            }
            return a.color > b.color ? 1 : -1
        }
        return capitalize(a.category) > capitalize(b.category) ? 1 : -1
    })

    for(let item of items) {
        // let item = currentData[key]
        let isNewItem = item.added == null || item.added == false
        if (isNewItem) {
            focusId = item.id;
        }
        if (previousCategory.toLowerCase() != item.category.toLowerCase() || previousColor != item.color) {
            HTML += `
            <tr>
                <td style="color: var(--color-${item.color});" class="list-header">
                    <span>${capitalize(item.category)}</span>
                    <i onClick="addItem(undefined, '${item.category}', undefined, undefined, '${item.color}')" style="color: var(--color-${item.color});" class="fa fa-plus faa-wrench animated-hover"></i>
                </td>
            </tr>`
            previousCategory = item.category
            previousColor = item.color
        }

        HTML += 
        `
        <tr id="${item.id}" style="border-right: 4px solid var(--color-${item.color}); border-left: 4px solid var(--color-${item.color});" class="list-item">
            <td>
                <input onkeypress="tabE('${item.id}-input-title', event, false)" id="${item.id}-input-category" style="display: ${isNewItem ? "block" : "none"};" type="text" placeholder="${capitalize(item.category)}">
            </td>
            <td>
                <input onkeypress="tabE('${item.id}-input-location', event, false)" id="${item.id}-input-title" style="display: ${isNewItem ? "block" : "none"};" type="text" placeholder="${capitalize(item.title)}">
                <span id="${item.id}-text-title" style="display: ${isNewItem ? "none" : "block"};">${capitalize(item.title)}</span>
            </td>
            <td>
                <input onkeypress="tabE('${item.id}-input-quantity', event, false)" id="${item.id}-input-location" style="display: ${isNewItem ? "block" : "none"};" type="text" placeholder="${capitalize(item.location)}">
                <span id="${item.id}-text-location" style="display: ${isNewItem ? "none" : "block"};">${capitalize(item.location)}</span>
            </td>
            <td>
                <input onkeypress="tabE('${item.id}', event, true)" id="${item.id}-input-quantity" style="display: ${isNewItem ? "block" : "none"};" type="text" placeholder="${capitalize(item.quantity)}">
                <span id="${item.id}-text-quantity" style="display: ${isNewItem ? "none" : "block"};">${capitalize(item.quantity)}</span>
            </td>
            <td>
                <span title="${new Date(item.dateAdded.seconds*1000).toDateString()}">${relativeDate(new Date(item.dateAdded.seconds*1000))}</span>
            </td>
            <td>
                <select title="Color #${item.color}" style="background-color: var(--color-${item.color})" id="${item.id}-select" onChange="setColor('${item.id}')">
                    <option title="Color #0" ${item.color == 0 ? "selected" : ""} value="0">Röd</option>
                    <option title="Color #1" ${item.color == 1 ? "selected" : ""} value="1">Blå</option>
                    <option title="Color #2" ${item.color == 2 ? "selected" : ""} value="2">Grön</option>
                    <option title="Color #3" ${item.color == 3 ? "selected" : ""} value="3">Lila</option>
                    <option title="Color #4" ${item.color == 4 ? "selected" : ""} value="4">Orange</option>
                    <option title="Color #5" ${item.color == 5 ? "selected" : ""} value="5">Gul</option>
                    <option title="Color #6" ${item.color == 6 ? "selected" : ""} value="6">Turkos</option>
                    <option title="Color #7" ${item.color == 7 ? "selected" : ""} value="7">Vinröd</option>
                    <option title="Color #8" ${item.color == 8 ? "selected" : ""} value="8">Ljusgrå</option>
                    <option title="Color #9" ${item.color == 9 ? "selected" : ""} value="9">Svart</option>
                </select>
                <i onClick="editItem('${item.id}')" class="fa fa-edit faa-wrench animated-hover"></i>
                <!--- <i class="fa fa-cog faa-wrench animated-hover"></i> --->
                <i onClick="deleteItem('${item.id}');" class="fa fa-times faa-wrench animated-hover"></i>
            </td>
        </tr>
        `
    }
    HTML += 
    `
    </table>
    `
    listElement.innerHTML = HTML
}

const relativeDate = (date) => {
    let days = datediff(date);
    switch (days) {
        case -1:
            return "Idag"
        case 0:
            return "Idag"
        case 1:
            return "Igår"
        case 2:
            return "I förrgår"
        case 7:
            return "1 Vecka sedan"
        case 14:
            return "2 Veckor sedan"
        default:
            if (days < 20) {
                return `${days} Dagar sedan`
            }
            return date.toLocaleDateString()
    }
}

const editItem = (id) => {
    let inputs = [];
    let texts = [];

    inputs.push(document.getElementById(`${id}-input-category`))
    inputs.push(document.getElementById(`${id}-input-title`))
    inputs.push(document.getElementById(`${id}-input-location`))
    inputs.push(document.getElementById(`${id}-input-quantity`))
    texts.push(document.getElementById(`${id}-text-title`))
    texts.push(document.getElementById(`${id}-text-location`))
    texts.push(document.getElementById(`${id}-text-quantity`))
    
    let willEdit = inputs[0].style.display == "none"

    if (willEdit) {
        for(let text of texts) {
            text.style.display = "none"
        }
        for(let input of inputs) {
            input.style.display = "block"
        }
        currentData[id].added = false
        item.added = false
    } else {
        currentData[id].category = inputs[0].value == "" ? currentData[id].category : inputs[0].value
        currentData[id].title = inputs[1].value == "" ? currentData[id].title : inputs[1].value
        currentData[id].location = inputs[2].value == "" ? currentData[id].location : inputs[2].value
        currentData[id].quantity = inputs[3].value == "" ? currentData[id].quantity : inputs[3].value

        for(let input of inputs) {
            input.style.display = "none"
        }
        for(let text of texts) {
            text.style.display = "block"
        }
        
        updateItem(id)
    }
}

const setColor = (id) => {
    let item = currentData[id]
    let newColor = selectElement = document.getElementById(`${id}-select`).value

    if (item.color != newColor) {
        item.color = newColor

        if (item.added == false) {
            editItem(id)
        }

        updateItem(id)
    }
} 

const updateItem = async (id) => {
    let item = currentData[id]
    currentData[id].added = true
    item.added = true
    await database.collection("items").doc(item.id).set(item)
}

const deleteItem = async (id) => {
    await database.collection("items").doc(id).delete()
}

const capitalize = (text) => {
    if (text == "") {
        return text
    }

    const capitalizeWord = (word) => {
        return word[0].toUpperCase() + word.slice(1).toLowerCase()
    }
    return text.split(" ").map(x => capitalizeWord(x)).join(" ")
}

const logout = () => {
    firebase.auth().signOut().then(() => {

    }).catch((error) => {
        console.error(error.message)
    })
}

const addItem = async (title="Maträtt", category=defaultNewCategory, quantity="0", location="K0", color="9", subCategories=[], added=false) => {
    await database.collection("items").add({
        "title":title,
        "category":category,
        "quantity":quantity,
        "location":location,
        "color":color,
        "dateAdded":new firebase.firestore.Timestamp(
            Math.round(new Date().getTime() / 1000), 0
        ),
        "subCategories":subCategories,
        "added":added,
        "uid":currentUser.uid,
    })
}

const datediff = (first, second=new Date()) => {
    return Math.floor((second-first)/(1000*60*60*24))
}

const tabE =(id, event, last=false) => {
    let e = (typeof event != 'undefined') ? window.event : event // IE : Moz 
    if (e.keyCode == 13) {
        if (last == true) {
            editItem(id)
        } else {
            let element = document.getElementById(id)
            element.focus()
        }
    } 
}