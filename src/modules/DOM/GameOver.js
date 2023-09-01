export function GameOverDOM(winner) {
	const gameOverText = document.createElement("p")
	gameOverText.textContent = winner === "Computer" ? "You lose :(" : "You won :)"
	gameOverText.className = "game-over"

	const textSection = document.querySelector(".text-section")
	textSection.append(gameOverText)

	// Add restart button
	const restartBtn = document.createElement("button")
	restartBtn.textContent = "Play again"
	restartBtn.id = "restart-btn"

	textSection.append(restartBtn)
}
