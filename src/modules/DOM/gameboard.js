import { shipTypes } from "../ship"
import { boardLimit } from "../gameboard"

// CODING LIKE FETCHING
export function getAndAppendGameboard(playerObject) {
	const gameboard = playerObject.getGameboard()
	const isComputer = playerObject.getName() === "Computer"

	const section = document.createElement("section")

	const gameboardDiv = createGameBoard(gameboard)
	gameboardDiv.id = isComputer ? "gameboard-two" : "gameboard-one"

	const textPara = document.createElement("p")
	textPara.className = "grid-title"
	textPara.textContent = isComputer ? "Enemy's grid" : "Your grid"

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

	if (position === "horizontal") {
		const fitsInGameboardHor = colIndex + shipLength <= boardLimit + 1
		const remainingCellsHor = boardLimit - colIndex + 1

		const cellLength = fitsInGameboardHor ? shipLength : remainingCellsHor
		const classToAdd = fitsInGameboardHor ? "ship-preview" : "not-possible"

		for (let i = 0; i < cellLength; i++) {
			const cell = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex + i}"]`)
			cell.classList.add(classToAdd)
		}
	}
}
