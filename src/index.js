import "./style.css"
import { Player } from "./modules/player"
import { renderGameboard, toggleGameContainer } from "./modules/DOM"

// DEFAULT
const playerOne = Player("Player 1")
const playerTwo = Player("Computer")

const gameboardOne = playerOne.gameboard
const gameboardTwo = playerTwo.gameboard
const gameboardPlayerOne = gameboardOne.getGameboard()
const gameboardPlayerTwo = gameboardTwo.getGameboard()

// INIT GAMEBOARDS
const startBtn = document.getElementById("start-game")
startBtn.addEventListener("click", () => {
	const gameboardOneDOM = document.getElementById("gameboard-one")
	const gameboardTwoDOM = document.getElementById("gameboard-two")

	startBtn.classList.add("none")

	setDefault()
	toggleGameContainer()
	renderGameboard(gameboardOneDOM, gameboardPlayerOne)
	renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)
})

function setDefault() {
	const defaultShipsOne = [
		["Carrier", [0, 5]],
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
	if (playerTwo.checkGameOver()) return console.log("YOU WON :)")

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

		if (playerOne.checkGameOver()) return console.log("The opponent wins :(")
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
