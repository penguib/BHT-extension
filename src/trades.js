const api = "https://brick-hill.trade/api/extension/item/"
const cachedValues = {}
const config = {
    childList: true,
    subtree: true
}
const tradeAreaPath = "div.main-holder.grid > div#viewtrades-v > div.col-2-3"
const createBucksItem = () => {
    const bucksIcon = document.createElement("span")
    bucksIcon.classList = "bucks-icon"
    bucksIcon.style = "margin: 3px;"
    return bucksIcon
}
// beware of just buck trades
const tradeArea = new MutationObserver(async (_, ob) => {
    // items returns a NodeList of 2 ul elements representing a list
    // of both giving and getting respectively. We have to map that list to
    // just grab their children, li elements, then map it again to get their
    // children, a elements. Then we map it again to isolate the a's href and
    // do some regex to extract just the items id. Should return 2 arrays of
    // giving and getting item ids
    let holder = document.querySelector(tradeAreaPath)
    let items = holder.querySelectorAll("ul.tile-holder.no-center")
    let itemArray = Array.from(items).map(element => Array.from(element.children))
    let itemIDArray = itemArray.map(a => a.map(x => x.children[0].href.match(/[0-9]+/)[0]))
    let givingValue = 0
    let gettingValue = 0

    // Disconnect the observer so we don't observe the changes we will make later
    // causing an infinite loop of death
    ob.disconnect()

    // first index will always be what you are giving
    for (let trade in itemIDArray) {
        for (let id of itemIDArray[trade]) {
            if (cachedValues[id]) {
                const value = cachedValues[id];
                (trade == 0) ? givingValue += value : gettingValue += value;
                continue
            }
            try {
                const itemData = await fetch(api + id)
                const itemJSON = await itemData.json()
                const value = itemJSON.item.value;
                cachedValues[id] = value;
                (trade == 0) ? givingValue += value : gettingValue += value
                if (trade == 0) {
                    givingValue += value
                } else {
                    gettingValue += value
                }
            } catch(err) {
                console.error(err)
            }
        }
    }

    const givingText = holder.querySelector("#giving-text")
    const gettingText = holder.querySelector("#getting-text")
    if (!holder.contains(givingText)) {
        const avgText = holder.querySelector("div.smedium-text")
        const giving = avgText.cloneNode(true)
        giving.id = "giving-text"
        giving.innerText = "Total value: "

        const bucksText = document.createElement("span")
        bucksText.classList = "bucks-text very-bold"
        bucksText.appendChild(createBucksItem())
        // Could be a security vuln if bad text got into the value api
        bucksText.innerHTML += " " + givingValue.toLocaleString()
        giving.appendChild(bucksText)

        avgText.appendChild(giving)
    } else {
        const valueText = givingText.querySelector("span")
        valueText.innerHTML = ""
        valueText.appendChild(createBucksItem())
        valueText.innerHTML += " " + givingValue.toLocaleString()
    }
    if (!holder.contains(gettingText)) {
        // We need to filter the array here because we added another div with smedium-text
        // class right above. So we are just searching for the last div with the class without
        // an ID
        const avgTexts = Array.from(holder.querySelectorAll("div.smedium-text")).filter(a => !a.id)
        const avgText = avgTexts[avgTexts.length - 1]
        const getting = avgText.cloneNode(true)
        getting.id = "getting-text"
        getting.innerText = "Total value: "

        const bucksText = document.createElement("span")
        bucksText.classList = "bucks-text very-bold"
        bucksText.appendChild(createBucksItem())
        // Could be a security vuln if bad text got into the value api
        bucksText.innerHTML += " " + gettingValue.toLocaleString()
        getting.appendChild(bucksText)

        avgText.appendChild(getting)
    } else {
        const valueText = gettingText.querySelector("span")
        valueText.innerHTML = ""
        valueText.appendChild(createBucksItem())
        valueText.innerHTML += " " + gettingValue.toLocaleString()
    }

    // Reconnect the observer so we can still run this code for the other trades
    tradeArea.observe(holder, config)
})
const tradeAreaOberserver = new MutationObserver((_, ob) => {
    let holder = document.querySelector(tradeAreaPath)
    if (document.contains(holder)) {
        ob.disconnect()
        tradeArea.observe(holder, config)
    }
})

tradeAreaOberserver.observe(document.body, config)
