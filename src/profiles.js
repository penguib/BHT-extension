const url = window.location.href
const userID = url.match(/-?[0-9]+/)[0]
const api = "https://brick-hill.trade/api/extension/user/"

async function getUserData(id) {
    let data;
    try {
        data = await fetch(api + id)

        try {
            const json = data.json()
            return json
        } catch(err) {
            return {
                status: "error",
                message: "Unable to parse api"
            }
        }

    } catch(err) {
        return {
            status: "error",
            message: "Unable to retreive data"
        }
    }
    return {
        status: "error",
        message: "Something went wrong"
    }
}

;(async () => {
    let data = await getUserData(userID)
    const mainDiv = document.querySelector("div.col-6-12")

    const card = document.createElement("div")
    card.className = "card"

    const top = document.createElement("div")
    top.className = "top red"
    top.innerText = "User Info"
    card.appendChild(top)

    const container = document.createElement("div")
    container.className = "content"
    container.style = "display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; text-align: center"
    card.appendChild(container)

    if (data.status === "error") {
        const errorText = document.createElement("span")
        errorText.innerText = data.message
        container.appendChild(errorText)

        const lineBreak = document.createElement("div")
        lineBreak.className = "line"
        lineBreak.style = "width: 100%; margin: 5px"
        container.appendChild(lineBreak)

        const info = document.createElement("a")
        info.innerText = "View on Brick Hill Trade"
        info.href = "https://brick-hill.trade/user/" + userID
        info.style = "width: 100%"
        info.classList = "gray-text"
        container.appendChild(info)

        mainDiv.insertBefore(card, mainDiv.lastElementChild)
        return
    }

    const value = document.createElement("button")
    value.className = "button medium green"
    value.innerText = "Value: " + data.user.value.toLocaleString()
    container.appendChild(value)

    const avg = document.createElement("button")
    avg.className = "button medium orange"
    avg.innerText = "Average: " + data.user.average.toLocaleString()
    container.appendChild(avg)

    const specials = document.createElement("button")
    specials.className = "button medium red"
    specials.innerText = "Specials: " + data.user.specials.toLocaleString()
    container.appendChild(specials)

    const rank = document.createElement("button")
    rank.className = "button medium blue"
    rank.innerText = "Rank: #" + data.user.rank.toLocaleString()
    container.appendChild(rank)

    const lineBreak = document.createElement("div")
    lineBreak.className = "line"
    lineBreak.style = "width: 100%; margin: 5px"
    container.appendChild(lineBreak)

    const info = document.createElement("a")
    info.innerText = "View on Brick Hill Trade"
    info.href = "https://brick-hill.trade/user/" + userID
    info.style = "width: 100%"
    info.classList = "gray-text"
    container.appendChild(info)

    mainDiv.insertBefore(card, mainDiv.lastElementChild)
})()
