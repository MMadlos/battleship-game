import "./style.css"
import { Player } from "./modules/player"
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

// INIT GAMEBOARDS

// TODO --> Al reiniciar juego, tengo que volver a generar los valores Default
startBtnListener()

function startBtnListener() {
	const startBtn = document.getElementById("start-game")
	startBtn.addEventListener("click", () => {
		startBtn.remove()
		initGame()
	})
}

function initGame() {
	const gameboardOneDOM = document.getElementById("gameboard-one")
	const gameboardTwoDOM = document.getElementById("gameboard-two")

	setVariables()
	setDefault()
	toggleGameContainer()
	renderGameboard(gameboardOneDOM, gameboardPlayerOne)
	renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)
}

function setDefault() {
	const defaultShipsOne = [
		["Carrier", [0, 5], "vertical"],
		["Battleship", [0, 0]],
		["Destroyer", [2, 0]],
		["Submarine", [5, 6]],
		["PatrolBoat", [9, 4]],
	]

	const defaultShipsTwo = [
		["Carrier", [5, 8], "vertical"],
		["Battleship", [4, 0]],
		["Destroyer", [3, 3]],
		["Submarine", [0, 7]],
		["PatrolBoat", [9, 4]],
	]

	defaultShipsOne.forEach((ship) => {
		gameboardOne.setShip(ship[0], ship[1], ship[2])
	})

	defaultShipsTwo.forEach((ship) => {
		gameboardTwo.setShip(ship[0], ship[1], ship[2])
	})
}

// "START OF THE GAME"
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
	GameOverDOM(winner)
	restartGame()
}

function restartGame() {
	const restartBtn = document.getElementById("restart-btn")
	const gameOverText = document.querySelector(".game-over")

	restartBtn.addEventListener("click", () => {
		restartBtn.remove()
		gameOverText.remove()

		removePreviousGameboard()
		initGame()
	})
}
