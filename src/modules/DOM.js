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
			div.textContent = col
			div.dataset.row = rowIndex
			div.dataset.col = colIndex
			div.classList.add("cell")
			if (col !== "Empty") div.classList.add("ship-placed")

			gameboardDOM.append(div)
		})
	})
}

export function toggleGameContainer() {
	const container = document.querySelector(".game-container")
	const isHidden = container.classList.contains("none")
	console.log(isHidden)
	isHidden ? container.classList.remove("none") : container.classList.add("none")
}
