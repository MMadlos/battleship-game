import { shipTypes } from "./ship"
import { getAndAppendShipList } from "./DOM/ship-list"

const textSection = document.querySelector(".text-section")

export function DOM() {
	const shipList = ShipListDOM()

	const append = () => {
		textSection.after(shipList.render)
	}

	return { shipList, append }
}

function ShipListDOM() {
	const render = renderShipList()

	const select = (shipName) => {
		// Removes if another one is selected
		const currentSelected = document.querySelector(".ship-card.selected")
		if (currentSelected) currentSelected.classList.remove("selected")

		// Add selection
		const shipSelected = document.querySelector(`[data-ship="${shipName}"]`)
		shipSelected.classList.add("selected")
	}

	const shipPlaced = () => {
		const currentSelected = document.querySelector(".ship-card.selected")
		currentSelected.classList.remove("selected")
		currentSelected.classList.add("placed")
	}

	const isPossible = (rowIndex, colIndex, shipLength, position) => {
		if (position === "horizontal") {
			for (let i = 0; i < shipLength; i++) {
				const cell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex + i}"]`)

				cell.classList.add("ship-preview")
			}
		}
		if (position === "vertical") {
			for (let i = 0; i < shipLength; i++) {
				const cell = document.querySelector(`[data-row="${rowIndex + i}"][data-col="${colIndex}"]`)

				cell.classList.add("ship-preview")
			}
		}
	}

	const isNotPossible = (rowIndex, colIndex, remainingCells, position) => {
		if (position === "horizontal") {
			for (let i = 0; i < remainingCells; i++) {
				const divToPaint = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex + i}"]`)
				divToPaint.classList.add("not-possible")
			}
		}
		if (position === "vertical") {
			for (let i = 0; i < remainingCells; i++) {
				const divToPaint = document.querySelector(`[data-row="${rowIndex + i}"][data-col="${colIndex}"]`)
				divToPaint.classList.add("not-possible")
			}
		}
	}

	const removePreview = () => {
		const shipsPreviewed = document.querySelectorAll(".cell.ship-preview, .cell.not-possible")
		shipsPreviewed.forEach((preview) => {
			preview.classList.remove("ship-preview")
			preview.classList.remove("not-possible")
		})
	}

	return { render, select, shipPlaced, isPossible, isNotPossible, removePreview }
}

function renderShipList() {
	const shipListSection = document.createElement("section")
	shipListSection.classList.add("ship-list")

	for (const ship in shipTypes) {
		const div = document.createElement("div")
		const shipName = document.createElement("p")
		const shipLength = document.createElement("p")

		div.className = "ship-card"
		shipName.className = "ship-name"
		shipLength.className = "ship-length"

		shipName.textContent = ship
		shipLength.textContent = shipTypes[ship]

		div.dataset.ship = ship

		div.append(shipName, shipLength)
		shipListSection.append(div)
	}

	return shipListSection
}

export function renderGameboard(gameboardDOM, playerGameboard) {
	for (let i = 0; i <= 10; i++) {
		const div = document.createElement("div")
		if (i !== 0) div.textContent = i
		div.classList.add("cell", "coordY")
		gameboardDOM.append(div)
	}

	playerGameboard.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			if (colIndex === 0) {
				const div = document.createElement("div")
				gameboardDOM.append(div)
				div.textContent = rowIndex + 1
				div.classList.add("cell", "coordX")
			}

			const div = document.createElement("div")

			div.dataset.row = rowIndex
			div.dataset.col = colIndex
			div.classList.add("cell")
			div.classList.toggle("ship-placed", col !== "Empty")

			gameboardDOM.append(div)
		})
	})
}

export function toggleGameContainer() {
	const container = document.querySelector(".game-container")
	const isHidden = container.classList.contains("none")
	isHidden ? container.classList.remove("none") : container.classList.add("none")
}

export function GameOverDOM(winner) {
	const gameOverText = document.createElement("p")
	gameOverText.textContent = winner === "Computer" ? "You lose :(" : "You win :)"
	gameOverText.className = "game-over"

	const body = document.getElementById("app")
	body.append(gameOverText)

	// Add restart button
	const restartBtn = document.createElement("button")
	restartBtn.textContent = "Play again"
	restartBtn.id = "restart-btn"

	body.append(restartBtn)

	// Remove text container
	const textContainer = document.querySelector(".text-container")
	textContainer.classList.add("none")
}

export function removePreviousGameboard() {
	const cellsAll = document.querySelectorAll(".gameboard  > div")
	cellsAll.forEach((cell) => cell.remove())
}
