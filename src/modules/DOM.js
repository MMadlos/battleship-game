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
