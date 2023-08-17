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

// Style Ship element
export function addShipSelected(shipCard) {
	const currentSelected = document.querySelector(".ship-card.selected")
	if (currentSelected) currentSelected.classList.remove("selected")

	shipCard.classList.add("selected")
}

export function addShipPlaced() {
	const currentSelected = document.querySelector(".ship-card.selected")
	currentSelected.classList.remove("selected")
	currentSelected.classList.add("placed")
}
