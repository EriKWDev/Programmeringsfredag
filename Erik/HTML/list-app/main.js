let database = firebase.firestore()
let currentUser = null
let currentData = {}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // logged in
        currentUser = user
        console.log(user)
        createUI(user)
        getData()
    } else {
        // not logged in
        currentUser = null
        window.location.replace("/login")
    }
})

const createUI = (user) => {
    let userElement = document.getElementById("user")
    let HTML =
    `
    <a class="logout-button" onClick="logout()">Logout</a>
    <img class="user-img" src="${user.photoURL}" alt="${user.displayName}">
    `
    userElement.innerHTML = HTML
}

const getData = () => {
    if (currentUser != null) {
        database.collection("items").where("uid", "==", currentUser.uid).orderBy("category").onSnapshot((data) => {
            currentData = {}
            data.forEach((doc) => {
                let item = doc.data()
                item.id = doc.id
                currentData[item.id] = item
            })
            updateTable()
        })
    }
}

const updateTable = () => {
    let listElement = document.getElementById("list-container")
    let HTML = 
    `
    <table>
    <colgroup>
        <col span="1" class="category-column">
        <col span="1" class="title-column">
        <col span="1">
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
    previousCategory = ""
    for(let key in currentData) {
        let item = currentData[key]
        if (previousCategory != item.category) {
            HTML += `<tr><td style="color: var(--color-${item.color});" class="list-header">${capitalize(item.category)}</td></tr>`
            previousCategory = item.category
        }
        HTML += 
        `
        <tr id="${item.id}" style="border-right: 4px solid var(--color-${item.color}); border-left: 4px solid var(--color-${item.color});" class="list-item">
            <td></td>
            <td><input type="text" placeholder="${capitalize(item.title)}"></td>
            <td>${capitalize(item.location)}</td>
            <td>${capitalize(item.quantity)}</td>
            <td>${new Date(item.dateAdded.seconds*1000).toDateString()}</td>
            <td>
                <i class="fa fa-cog"></i>
                <i class="fa fa-edit"></i>
                <i onClick="deleteItem('${item.id}');" class="fa fa-times"></i>
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

const editItem = (id) => {
    let itemElement = document.getElementById(id)
    
}

const updateItem = async (id) => {
    let item = currentData[id]
    await database.collection("items").doc(item.id).set(item)
}

const deleteItem = async (id) => {
    await database.collection("items").doc(id).delete()
}

const capitalize = (text) => {
    return text[0].toUpperCase() + text.slice(1).toLowerCase()
}

const logout = () => {
    firebase.auth().signOut().then(() => {

    }).catch((error) => {
        console.error(error.message)
    })
}

const addItem = async (title, category, quantity, location, color, subCategories) => {
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
        "uid":currentUser.uid,
    })
}