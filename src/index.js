import "./style.css"
import { Player } from "./modules/player"
import { boardLimit } from "./modules/gameboard"
import { setDefaultShips } from "./modules/defaultShips"
import { renderGameboard, toggleGameContainer, GameOverDOM, removePreviousGameboard } from "./modules/DOM"
import { shipTypes } from "./modules/ship"

// DEFAULT
const gameboardOneDOM = document.getElementById("gameboard-one")
const gameboardTwoDOM = document.getElementById("gameboard-two")

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

// TODO --> Refactor. Instead of moving ships around, select the ship he wants to place and then select the grid

//* Add all ships in so the player can select which ship to place in the grid
//* Make the Start game button disabled until all ships are placed
addShipsPlayerGameboard()
function addShipsPlayerGameboard() {
	// Select ship -> Get shipName
	const allShipCards = document.querySelectorAll(".ship-card")
	const playerGrid = document.getElementById("gameboard-one")

	// To be able to detect when a ship is selected, first we need to know if the player has clicked on a ship. Then we are able to get the data to place the ship when the player clicks in the gameboard.
	// If no ship is selected, it shouldn't do nothing if the player clicks the gameboard.

	let shipSelected, coordinates

	allShipCards.forEach((card) => {
		card.addEventListener("click", () => {
			const shipName = card.querySelector(".ship-name").textContent

			// If another ship is selected and the player selects another ship:
			if (shipSelected) {
				const currentSelected = document.querySelector(".ship-card.selected")
				currentSelected.classList.remove("selected")
			}

			shipSelected = shipName
			card.classList.add("selected")
		})
	})

	// If a ship is selected, it should show a visual guide of the ship when moving the mouse over the gameboard.

	let currentDiv
	playerGrid.addEventListener("mouseover", (e) => {
		if (!shipSelected) return

		const cell = e.target.closest(".cell")
		const isNotGameboard = cell.classList.contains("coordY") || cell.classList.contains("coordX")
		if (isNotGameboard) return

		const shipName = shipSelected
		const shipLength = shipTypes[shipName]

		// Checks if there are already divs with .ship-preview and remove them all
		const shipsPreviewed = document.querySelectorAll(".cell.ship-preview, .cell.not-possible")
		shipsPreviewed.forEach((preview) => {
			preview.classList.remove("ship-preview")
			preview.classList.remove("not-possible")
		})

		//Check if the ship can be placed (it's not traspassing the gameboard)
		const rowIndex = Number(cell.dataset.row)
		const colIndex = Number(cell.dataset.col)

		if (colIndex + shipLength <= boardLimit + 1) {
			for (let i = colIndex; i < colIndex + shipLength; i++) {
				const divToPaint = document.querySelector(`[data-row="${rowIndex}"][data-col="${i}"]`)
				divToPaint.classList.add("ship-preview")
			}
		} else {
			const remainingCells = boardLimit - colIndex + 1
			for (let i = 0; i < remainingCells; i++) {
				const divToPaint = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex + i}"]`)
				divToPaint.classList.add("not-possible")
			}
		}
	})

	// Get coordinates after clicking the grid
	playerGrid.addEventListener("click", (e) => {
		const cell = e.target.closest("div.cell")
		const isNotGameboard = cell.classList.contains("coordY") || cell.classList.contains("coordX")

		if (isNotGameboard) return

		const coordX = cell.dataset.row
		const coordY = cell.dataset.col

		if (!shipSelected) return console.log(gameboardPlayerOne[coordX][coordY])

		// Set ship in those coordinates
		coordinates = [coordX, coordY]
		gameboardOne.setShip(shipSelected, coordinates)
		shipSelected = undefined
		console.log(gameboardPlayerOne[coordX][coordY])

		// Render gameboard
		removePreviousGameboard()
		renderGameboard(gameboardOneDOM, gameboardPlayerOne)
		renderGameboard(gameboardTwoDOM, gameboardPlayerTwo) // Temporal
	})

	// Add ship style as placed

	// Display start game btn after all ships are placed
	// Add styles
	// Add possibility to set all ships randomly
	// Add possibility to remove ship placed
}

initGame()

function initGame() {
	setVariables()
	// setDefaultShips(gameboardOne, gameboardTwo)
	renderGameboard(gameboardOneDOM, gameboardPlayerOne)
	renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)
	startBtnListener()
}

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
