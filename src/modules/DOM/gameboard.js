import { BOARD_LIMIT } from "../gameboard"

// CODING LIKE FETCHING
export function displayGrid(playerObject) {
	const gridContent = playerObject.gameboard.grid
	const grid = createGrid(gridContent)

	const isGridOne = document.querySelector("#gameboard-one")
	console.log(isGridOne)
	grid.id = isGridOne ? "gameboard-two" : "gameboard-one"

	const text = document.createElement("p")
	text.className = "grid-title"
	text.textContent = isGridOne ? "Enemy's grid" : "Your grid"

	const section = document.createElement("section")
	const gameContainer = document.querySelector(".game-container")

	section.append(text, grid)
	gameContainer.append(section)
	return section
}

function createGrid(playerGrid) {
	const gameboardDiv = document.createElement("div")
	gameboardDiv.className = "gameboard"

	for (let i = 0; i <= BOARD_LIMIT + 1; i++) {
		const div = document.createElement("div")
		if (i !== 0) div.textContent = i
		div.classList.add("cell", "coordY")
		gameboardDiv.append(div)
	}

	playerGrid.forEach((row, rowIndex) => {
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

			gameboardDiv.append(div)
		})
	})
	return gameboardDiv
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
