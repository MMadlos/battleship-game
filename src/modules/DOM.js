export function createGameboard() {
	const gameboardOne = document.getElementById("gameboard-one")
	const gameboardTwo = document.getElementById("gameboard-two")

	GameboardDOM(gameboardOne)
	GameboardDOM(gameboardTwo)

	function GameboardDOM(gameboard) {
		for (let i = 0; i < 10; i++) {
			const row = document.createElement("div")
			row.classList.add("row")
			gameboard.append(row)

			if (i === 0) row.classList.add("coordY")

			for (let j = 0; j < 10; j++) {
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
}
