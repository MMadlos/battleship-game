const gameboardOne = document.getElementById("gameboard-one")
const gameboardTwo = document.getElementById("gameboard-two")

export function renderGameboard() {
	createRowsAndCols(gameboardOne)
	createRowsAndCols(gameboardTwo)

	addCellIndex("gameboard-one")
	addCellIndex("gameboard-two")
}

function createRowsAndCols(gameboard) {
	const gridSize = 10
	for (let i = 0; i <= gridSize; i++) {
		const row = document.createElement("div")
		row.classList.add("row")
		gameboard.append(row)

		if (i === 0) row.classList.add("coordY")

		for (let j = 0; j <= gridSize; j++) {
			const cell = document.createElement("div")
			cell.classList.add("cell")
			row.appendChild(cell)

			if (j === 0) {
				cell.classList.add("coordX")
				if (i > 0) cell.textContent = i
			}
			if (i === 0) {
				cell.classList.add("coordY")
				if (j > 0) cell.textContent = j
			}
		}
	}
}

function addCellIndex(gameboard) {
	const allRows = document.querySelectorAll(`#${gameboard} > .row:not(.coordY)`)
	allRows.forEach((row, index) => {
		row.dataset.row = index

		const allCells = row.querySelectorAll(".cell:not(.coordX)")
		allCells.forEach((cell, index) => {
			cell.dataset.col = index
		})
	})
}
