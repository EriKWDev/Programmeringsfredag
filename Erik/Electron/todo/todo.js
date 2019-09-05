const fs = require("fs")

fs.writeFile("test.json")

let projects = []

let currentProjectId = 0
let currentSubProjectId = -1

const populateProject = () => {
    let sideBar = document.getElementById("side-bar")
    sideBar.innerHTML = ``
    let i = 0
    for(let subProject of projects[currentProjectId].subProjects) {
        sideBar.innerHTML += 
        `
        <div id="sub-project-${i}" class="sub-project" onClick="populateContent(${i})">
            <p>${subProject.title}</p>
        </div>
        `
        i++
    }
}

const populateContent = (subProjectId) => {
    if(subProjectId == currentSubProjectId) {
        return
    }

    let subProject = projects[currentProjectId].subProjects[subProjectId]
    let content = document.getElementById("content")
    content.innerHTML = ``
    let i = 0

    for(let todo of subProject.todos) {
        content.innerHTML +=
        `
        <div status="${todo.status.toLowerCase()}" class="todo">
            <div class="todo-check-wrapper">
                <div onClick="toggleStatus(${i})" id="todo-check-${i}" status="${todo.status.toLowerCase()}" class="todo-check"></div>
                <div>
                    <p class="todo-title">${todo.title}</p>
                    ${todo.description != null ? 
                        `<p class="todo-description">${todo.description}</p>` :
                        ``
                    }
                </div>
            </div>
        </div>
        `
        i++
    }

    currentSubProjectId = subProjectId
}

const toggleStatus = (todoId) => {
    let todoCheck = document.getElementById(`todo-check-${todoId}`)
    let currentStatus = projects[currentProjectId].subProjects[currentSubProjectId].todos[todoId].status
    let newStatus = currentStatus == "done" ? "progress" : "done"

    todoCheck.setAttribute("status", newStatus)
    projects[currentProjectId].subProjects[currentSubProjectId].todos[todoId].status = newStatus 
}

const initiate = async () => {
    let data = await fetch("data.json")
    let json = await data.json()
    projects = json.projects

    populateProject()
    populateContent(0)
}

initiate()