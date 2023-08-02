import "./style.css"
import { Player } from "./modules/player"
import { renderGameboard } from "./modules/DOM"

// DEFAULT
const playerOne = Player("Player 1")
const playerTwo = Player("Computer")

const gameboardOne = playerOne.gameboard
const gameboardTwo = playerTwo.gameboard

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

// INIT GAMEBOARDS
const gameboardOneDOM = document.getElementById("gameboard-one")
const gameboardPlayerOne = gameboardOne.getGameboard()
renderGameboard(gameboardOneDOM, gameboardPlayerOne)

const gameboardTwoDOM = document.getElementById("gameboard-two")
const gameboardPlayerTwo = gameboardTwo.getGameboard()
renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)

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
	cell.textContent = gameboardPlayerTwo[coordX][coordY]
	cell.classList.add(cell.textContent.toLowerCase())

	// Check gameover for PlayerTwo
	console.log({ "Computer Gameover": playerTwo.checkGameOver() })
	if (playerTwo.checkGameOver()) return console.log("YOU WON :)")

	computerAttacks()
})

function computerAttacks(coords) {
	// Starting here, it's the computers move
	// TODO -> Should show more stuff before the computer attacks the player (eg. animation )
	// [...]
	let randomCoordX
	let randomCoordY

	if (coords) {
		const [coordX, coordY] = coords
		randomCoordX = coordX
		randomCoordY = coordY
	}

	if (!coords) {
		randomCoordX = coords || getRandomIndex()
		randomCoordY = coords || getRandomIndex()
	}

	const gameboardContentOne = gameboardPlayerOne[randomCoordX][randomCoordY]
	const isAlreadyAttacked = gameboardContentOne === "Hit" || gameboardContentOne === "Missed"

	if (!isAlreadyAttacked) {
		playerTwo.attack(playerOne, [randomCoordX, randomCoordY])
		const playerOneCellDOM = document.querySelector(`[data-row="${randomCoordX}"][data-col="${randomCoordY}"]`)
		playerOneCellDOM.textContent = gameboardPlayerOne[randomCoordX][randomCoordY]
		playerOneCellDOM.classList.add(playerOneCellDOM.textContent.toLowerCase())

		// Check gameover for Player One
		console.log({ randomCoordX, randomCoordY, gameboardContentOne })
		console.log({ "PlayerOne Gameover": playerOne.checkGameOver() })
		if (playerOne.checkGameOver()) return console.log("The opponent wins :(")
	}

	if (isAlreadyAttacked) {
		console.log("There's already been attacked")

		const currentRow = gameboardPlayerOne[randomCoordX] // Array(10)
		const newCoordY = currentRow.findIndex((element) => element !== "Hit" && element !== "Missed")
		if (newCoordY !== -1) return computerAttacks([randomCoordX, newCoordY])
		let coordYForEach, coordXForEach
		for (let i = 0; i < 10; i++) {
			const row = gameboardPlayerOne[i]
			const colIndex = row.findIndex((element) => element !== "Hit" && element !== "Missed")

			coordXForEach = i
			coordYForEach = colIndex
			if (colIndex !== -1) return computerAttacks([coordXForEach, coordYForEach])
		}
	}
}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
