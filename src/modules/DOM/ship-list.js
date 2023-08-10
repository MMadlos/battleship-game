import { shipTypes } from "../ship"

//CODING LIKE I'M FETCHING DATA
export function getAndAppendShipList() {
	const ships = getShipTypes()
	const shipsByNameAndLength = getShipByNameAndLength(ships)

	const shipListSection = document.createElement("section")
	shipListSection.classList.add("ship-list")

	shipsByNameAndLength.forEach((ship) => {
		const { name, length } = ship

		const card = createShipElement(name, length)
		shipListSection.append(card)
	})

	const textSection = document.querySelector(".text-section")
	textSection.after(shipListSection)
}

// Create the DOM
function createShipElement(shipName, shipLength) {
	const div = document.createElement("div")
	const shipNameEl = document.createElement("p")
	const shipLengthEl = document.createElement("p")

	div.className = "ship-card"
	shipNameEl.className = "ship-name"
	shipLengthEl.className = "ship-length"

	shipNameEl.textContent = shipName
	shipLengthEl.textContent = `Length: ${shipLength}`

	div.dataset.ship = shipName

	div.append(shipNameEl, shipLengthEl)
	return div
}

// Style Ship element
export function addStyleToShipElement(shipEl) {
	const currentSelected = document.querySelector(".ship-card.selected")
	if (currentSelected) currentSelected.classList.remove("selected")

	const isNotSelected = [...shipEl.classList].length === 1
	shipEl.classList.toggle("selected", isNotSelected)
}

export function styleShipPlaced() {
	const currentSelected = document.querySelector(".ship-card.selected")
	currentSelected.classList.remove("selected")
	currentSelected.classList.add("placed")
}

// Simulating a transformation of the data fetched
function getShipByNameAndLength(ships) {
	const shipsByNameAndLength = []
	for (const [name, length] of Object.entries(ships)) {
		const ship = {
			name,
			length,
		}

		shipsByNameAndLength.push(ship)
	}
	return shipsByNameAndLength
}

// Simulating a fetch
function getShipTypes() {
	return shipTypes
}
