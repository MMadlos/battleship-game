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
