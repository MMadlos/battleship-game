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
	const gameContainer = document.querySelector(".game-container")
	gameContainer.classList.remove("none")

	const gameContainerSections = document.querySelectorAll(".game-container > section")
	gameContainerSections.forEach((section) => section.remove())
}
