import { shipTypes } from "../ship"
import { boardLimit } from "../gameboard"

// CODING LIKE FETCHING
export function getAndAppendGameboard(playerObject) {
	const gameboard = playerObject.getGameboard()
	const isComputer = playerObject.getName() === "Computer"

	const gameboardDiv = createGameBoard(gameboard)
	gameboardDiv.id = isComputer ? "gameboard-two" : "gameboard-one"

	const textPara = document.createElement("p")
	textPara.className = "grid-title"
	textPara.textContent = isComputer ? "Enemy's grid" : "Your grid"

	const section = document.createElement("section")
	section.append(textPara, gameboardDiv)
	return section
}

// Create DOM
function createGameBoard(playerGameboard) {
	const gameboardDiv = document.createElement("div")
	gameboardDiv.className = "gameboard"

	for (let i = 0; i <= 10; i++) {
		const div = document.createElement("div")
		if (i !== 0) div.textContent = i
		div.classList.add("cell", "coordY")
		gameboardDiv.append(div)
	}

	playerGameboard.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			if (colIndex === 0) {
				const div = document.createElement("div")
				div.textContent = rowIndex + 1
				div.classList.add("cell", "coordX")
				gameboardDiv.append(div)
			}

			const div = document.createElement("div")
			div.dataset.row = rowIndex
			div.dataset.col = colIndex
			div.classList.add("cell")
			div.classList.toggle("ship-placed", col !== "Empty")

			gameboardDiv.append(div)
		})
	})
	return gameboardDiv
}

// Simulating a fetch
function getGameboard(playerGameboard) {
	return playerGameboard
}

// STYLE WHEN PLACING A SHIP
export function styleShipPreview(cell, shipSelected, position) {
	const { row, col } = cell.dataset
	const rowIndex = Number(row)
	const colIndex = Number(col)

	const shipName = shipSelected
	const shipLength = shipTypes[shipName]

	// Get the index used to calculate if it fits in the gameboard or the remaining cells to paint
	const indexToCheck = position === "horizontal" ? colIndex : rowIndex
	const fitsInGameboard = indexToCheck + shipLength <= boardLimit + 1
	const remainingCells = boardLimit - indexToCheck + 1

	const cellLength = fitsInGameboard ? shipLength : remainingCells
	const classToAdd = fitsInGameboard ? "ship-preview" : "not-possible"

	for (let i = 0; i < cellLength; i++) {
		const query = position === "horizontal" ? `[data-row="${rowIndex}"][data-col="${colIndex + i}"]` : `[data-row="${rowIndex + i}"][data-col="${colIndex}"]`

		const cell = document.querySelector(query)
		cell.classList.add(classToAdd)
	}
}

export function removePreview() {
	const shipsPreviewed = document.querySelectorAll(".cell.ship-preview, .cell.not-possible")
	shipsPreviewed.forEach((preview) => {
		preview.classList.remove("ship-preview")
		preview.classList.remove("not-possible")
	})
}

export function styleGameboard(playerObject) {
	const playerGameboard = playerObject.getGameboard()

	playerGameboard.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			if (col !== "Empty") {
				const div = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`)
				div.classList.remove("ship-preview")
				div.classList.add("ship-placed")
			}
		})
	})
}

export function removePreviousGameboard() {
	const gameContainer = document.querySelector(".game-container")
	gameContainer.classList.remove("none")

	const gameContainerSections = document.querySelectorAll(".game-container > section")
	gameContainerSections.forEach((section) => section.remove())
}

export function toggleGameContainer() {
	const container = document.querySelector(".game-container")
	const isHidden = container.classList.contains("none")
	isHidden ? container.classList.remove("none") : container.classList.add("none")
}
export function toggleGameContainer() {
	const container = document.querySelector(".game-container")
	const isHidden = container.classList.contains("none")
	isHidden ? container.classList.remove("none") : container.classList.add("none")
}
