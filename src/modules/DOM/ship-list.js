import { SHIP_LENGTH } from "../ship"

export function displayShipList() {
	const shipList = document.createElement("section")
	shipList.classList.add("ship-list")

	for (const [shipName, shipLength] of Object.entries(SHIP_LENGTH)) {
		const card = createShipElement(shipName, shipLength)
		shipList.append(card)
	}

	const textSection = document.querySelector(".text-section")
	textSection.after(shipList)
}

// Create the DOM
function createShipElement(shipName, shipLength) {
	const div = document.createElement("div")
	div.className = "ship-card"
	div.dataset.ship = shipName

	const shipNameEl = document.createElement("p")
	shipNameEl.className = "ship-name"
	shipNameEl.textContent = shipName

	const shipLengthEl = document.createElement("p")
	shipLengthEl.className = "ship-length"
	shipLengthEl.textContent = `Length: ${shipLength}`

	div.append(shipNameEl, shipLengthEl)
	return div
}

export function shipCardStyle(state, element) {
	const currentSelected = document.querySelector(".ship-card.selected")

	const isSelected = state === "selected"
	const isPlaced = state === "placed"

	if (currentSelected && isSelected) {
		currentSelected.classList.remove("selected")
		element.classList.add("selected")
	}

	if (!currentSelected && isSelected) element.classList.add("selected")

	if (isPlaced) {
		currentSelected.classList.remove("selected")
		currentSelected.classList.add("placed")
	}
}
