const api = "https://brick-hill.trade/api/extension/item/"
const itemID = window.location.href.match(/-?[0-9]+/)[0]

async function getItemData(id) {
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
    const data = await getItemData(itemID)
    const mainDiv = document.querySelector("div.item-holder")

    const card = document.createElement("div")
    card.className = "card"

    const top = document.createElement("div")
    top.className = "top blue"
    top.innerText = "Item Info"
    card.appendChild(top)

    const content = document.createElement("div")
    content.className = "content"
    content.style = "text-align: center"
    card.appendChild(content)

    const holder = document.createElement("div")
    holder.style = "display: flex; gap: 5px; justify-content: space-evenly;"
    content.appendChild(holder)

    const value = document.createElement("button")
    value.className = "button medium green"
    value.innerText = "Value: " + data.item.value.toLocaleString()
    holder.appendChild(value)

    const demand = document.createElement("button")
    demand.className = "button medium blue"
    demand.innerText = "Demand: " + data.item.demand
    holder.appendChild(demand)

    const shorthand = document.createElement("button")
    shorthand.className = "button medium red"
    shorthand.innerText = "Shorthand: " + data.item.shorthand
    holder.appendChild(shorthand)

    const lineBreak = document.createElement("div")
    lineBreak.className = "line"
    lineBreak.style = "width: 100%; margin: 5px"
    content.appendChild(lineBreak)

    const info = document.createElement("a")
    info.innerText = "View on Brick Hill Trade"
    info.href = "https://brick-hill.trade/item/" + itemID
    info.style = "width: 100%"
    info.classList = "gray-text"
    content.appendChild(info)

    mainDiv.insertBefore(card, mainDiv.lastElementChild)
})()
