import "./style.css"
import { Player } from "./modules/player"
import { setDefaultShips } from "./modules/defaultShips"
import { renderGameboard, toggleGameContainer, GameOverDOM, removePreviousGameboard } from "./modules/DOM"

// DEFAULT
let playerOne, playerTwo
let gameboardOne, gameboardTwo // Gameboard factories
let gameboardPlayerOne, gameboardPlayerTwo // Gameboard content

function setVariables() {
	playerOne = Player("Player 1")
	playerTwo = Player("Computer")

	gameboardOne = playerOne.gameboard
	gameboardTwo = playerTwo.gameboard
	gameboardPlayerOne = gameboardOne.getGameboard()
	gameboardPlayerTwo = gameboardTwo.getGameboard()
}

// TODO
//* Add all ships in so the player can select which ship to place in the grid
// Make the Start game button disabled until all ships are placed
// Select ship
// Get coordinates after clicking the grid
// Set ship in those coordinates
// Remove ship from the options
// Start game btn after all ships are placed
// Add styles
// Add possibility to set all ships randomly
// Add possibility to remove ship placed

initGame()

function initGame() {
	const gameboardOneDOM = document.getElementById("gameboard-one")
	const gameboardTwoDOM = document.getElementById("gameboard-two")

	setVariables()
	setDefaultShips(gameboardOne, gameboardTwo)
	renderGameboard(gameboardOneDOM, gameboardPlayerOne)
	renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)
	startBtnListener()
}

// TODO --> Refactor. Instead of moving ships around, select the ship he wants to place and then select the grid
const playerGrid = document.getElementById("gameboard-one")

function startBtnListener() {
	// TODO -> Player can't click in the enemy's grid until it clicks the start game
	const startBtn = document.getElementById("start-game")
	startBtn.addEventListener("click", () => {
		startBtn.remove()
		enableAttackEnemy()
	})
}

// "START OF THE GAME"
function enableAttackEnemy() {
	const opponentGameboard = document.getElementById("gameboard-two")
	opponentGameboard.addEventListener("click", (e) => {
		const cell = e.target.closest("div.cell")
		const isNotGameboard = cell.classList.contains("coordY") || cell.classList.contains("coordX")

		if (isNotGameboard) return

		const coordX = cell.dataset.row
		const coordY = cell.dataset.col

		const gameboardContent = gameboardPlayerTwo[coordX][coordY]
		const isAlreadyAttacked = gameboardContent === "Hit" || gameboardContent === "Missed"

		if (isAlreadyAttacked) return console.log("You already attacked these coordinates")

		playerOne.attack(playerTwo, [coordX, coordY])
		cell.classList.add(gameboardPlayerTwo[coordX][coordY].toLowerCase())

		// Check gameover for PlayerTwo
		console.log({ "Computer Gameover": playerTwo.checkGameOver() })
		if (playerTwo.checkGameOver()) return displayGameOver("Player")

		// TODO -> Should show more stuff before the computer attacks the player (eg. animation )
		// [...]

		setTimeout(computerAttacks, 500)
	})
}

function computerAttacks(coords = [undefined, undefined]) {
	const [_coordX, _coordY] = coords

	const coordX = _coordX || getRandomIndex()
	const coordY = _coordY || getRandomIndex()

	const isHit = gameboardPlayerOne[coordX][coordY] === "Hit"
	const isMissed = gameboardPlayerOne[coordX][coordY] === "Missed"
	const canAttack = !isHit && !isMissed

	if (canAttack) {
		playerTwo.attack(playerOne, [coordX, coordY])

		const playerOneCellDOM = document.querySelector(`[data-row="${coordX}"][data-col="${coordY}"]`)
		playerOneCellDOM.classList.add(gameboardPlayerOne[coordX][coordY].toLowerCase())

		if (playerOne.checkGameOver()) return displayGameOver("Computer")
	}

	if (!canAttack) {
		// It first searches if there's a spot that can be attacked in the same row. If not, it searches the first spot in the  gameboard.

		const currentRow = gameboardPlayerOne[coordX]
		const canAttackCell = (element) => element !== "Hit" && element !== "Missed"

		const newCoordY = currentRow.findIndex(canAttackCell)
		if (newCoordY !== -1) return computerAttacks([coordX, newCoordY])

		for (let i = 0; i < 10; i++) {
			const row = gameboardPlayerOne[i]
			const colIndex = row.findIndex(canAttackCell)

			if (colIndex !== -1) return computerAttacks([i, colIndex])
		}
	}
}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}

function displayGameOver(winner) {
	toggleGameContainer()
	GameOverDOM(winner)
	restartGame()
}

function restartGame() {
	// TODO --> Check how to render the init screen again.
	// Check classes of game-container and how to init game
	const restartBtn = document.getElementById("restart-btn")
	const gameOverText = document.querySelector(".game-over")

	restartBtn.addEventListener("click", () => {
		restartBtn.remove()
		gameOverText.remove()

		const textContainer = document.querySelector(".text-container")
		textContainer.classList.remove("none")

		removePreviousGameboard()
		initGame()
	})
}
