import "./style.css"

import { PLAYER } from "./modules/player"
import { SHIP_NAMES } from "./modules/ship"
import { setShipRandomly } from "./modules/placeShipsRandom"

import { displayShipList, addShipSelected, addShipPlaced } from "./modules/DOM/ship-list"
import { displayGrid, addShipPreview, removeShipPreview, addShipToGrid } from "./modules/DOM/gameboard"
import { displayErrorMessage, removeErrorMessage } from "./modules/DOM/messages"

// import { setEnemyShips } from "./modules/defaultShips"
// import { toggleGameContainer, GameOverDOM, removePreviousGameboard } from "./modules/DOM/GameOver"
// import { getAndAppendShipList, addStyleToShipElement, styleShipPlaced } from "./modules/DOM/ship-list"
// import { getAndAppendGameboard, styleShipPreview, removePreview, styleGameboard } from "./modules/DOM/gameboard"
// import { setShipRandomly } from "./modules/placeShipsRandom"

// VARIABLES
let playerOne, playerTwo
let gameboardOne, gameboardTwo // Gameboard factories
let gridOne, gridTwo // Gameboard content -> Check if it's still necessary

initGame()
function initGame() {
	setVariables()
	displayShipList()
	displayGrid(playerOne)
	displayGrid(playerTwo)
	selectAndPlaceShip()
	btnRandomShips()
}

function setVariables() {
	playerOne = PLAYER("Player 1")
	playerTwo = PLAYER("Computer")

	gameboardOne = playerOne.gameboard
	gameboardTwo = playerTwo.gameboard

	gridOne = gameboardOne.grid
	// gridTwo = gameboardTwo.grid
}

function selectAndPlaceShip() {
	let shipSelected
	let position = "horizontal"

	const shipList = document.querySelectorAll(".ship-card")
	shipList.forEach((card) => {
		card.onclick = () => {
			addShipSelected(card)

			shipSelected = card.dataset.ship
		}
	})

	const playerGrid = document.getElementById("gameboard-one")
	;["mouseover", "mouseout", "click"].forEach((mouseEvent) => {
		playerGrid.addEventListener(mouseEvent, (e) => {
			const isNotGameboard = e.target.closest("coordY") || e.target.closest("coordX")
			if (!shipSelected || isNotGameboard) return

			const cell = e.target.closest(".cell")

			document.onkeydown = rotateShipPosition

			if (mouseEvent === "mouseover") addShipPreview(cell, shipSelected, position)
			if (mouseEvent === "mouseout") removeShipPreview()
			if (mouseEvent === "click") {
				const { row, col } = cell.dataset
				const coordinates = [Number(row), Number(col)]
				const setShip = gameboardOne.setShip(shipSelected, coordinates, position)

				if (setShip.error) return displayErrorMessage(setShip.message)

				shipSelected = undefined
				removeErrorMessage()
				addShipPlaced()
				addShipToGrid()
				checkAndDisplayStartBtn()
			}

			function rotateShipPosition(e) {
				if (e.code !== "KeyR") return

				position = position === "horizontal" ? "vertical" : "horizontal"
				removeShipPreview()
				addShipPreview(cell, shipSelected, position)
			}
		})
	})
}

function btnRandomShips() {
	const randomBtn = document.getElementById("random-ships")
	randomBtn.addEventListener("click", () => {
		// clearGameboard()

		setRandomShips()
		styleGameBoard()
		checkAndDisplayStartBtn()

		const allShipCards = document.querySelectorAll(".ship-card")
		allShipCards.forEach((card) => card.classList.add("placed"))

		randomBtn.classList.add("none")
	})

	// function clearGameboard() {
	// 	const { grid } = playerOne.gameboard
	// 	grid.forEach((row) => row.forEach((col) => (col = "Empty")))
	// }

	function setRandomShips() {
		SHIP_NAMES.forEach((shipName) => {
			setShipRandomly(playerOne, shipName)
		})
	}

	function styleGameBoard() {
		playerOne.gameboard.grid.forEach((row, rowIndex) => {
			row.forEach((col, colIndex) => {
				const div = document.querySelector(`#gameboard-one > [data-row="${rowIndex}"][data-col="${colIndex}"]`)

				const isNotEmpty = col !== "Empty"
				div.classList.toggle("ship-placed", isNotEmpty)
			})
		})
	}
}

function checkAndDisplayStartBtn() {
	const allShipsPlaced = gameboardOne.checkAllShipsPlaced()
	if (allShipsPlaced) displayStartBtn()
}

function displayStartBtn() {
	const startBtn = document.getElementById("start-game")
	startBtn.classList.remove("none")
	startBtn.onclick = () => {
		const shipList = document.querySelector(".ship-list")
		shipList.remove()

		const btnSetShipRandomly = document.getElementById("random-ships")
		btnSetShipRandomly.classList.add("none")

		startBtn.classList.add("none")

		// setEnemyShips(gameboardTwo)
		// enableAttackEnemy()
	}
}

// // "START OF THE GAME"
// function enableAttackEnemy() {
// 	const opponentGameboard = document.getElementById("gameboard-two")
// 	opponentGameboard.addEventListener("click", (e) => {
// 		const cell = e.target.closest("div.cell")
// 		const isNotGameboard = cell.classList.contains("coordY") || cell.classList.contains("coordX")

// 		if (isNotGameboard) return

// 		const coordX = cell.dataset.row
// 		const coordY = cell.dataset.col

// 		const gameboardContent = gameboardPlayerTwo[coordX][coordY]
// 		const isAlreadyAttacked = gameboardContent === "Hit" || gameboardContent === "Missed"

// 		if (isAlreadyAttacked) return console.log("You already attacked these coordinates")

// 		playerOne.attack(playerTwo, [coordX, coordY])
// 		cell.classList.add(gameboardPlayerTwo[coordX][coordY].toLowerCase())

// 		// Check gameover for PlayerTwo
// 		if (playerTwo.checkGameOver()) return displayGameOver("Player")

// 		// TODO -> Should show more stuff before the computer attacks the player (eg. animation )
// 		// [...]

// 		setTimeout(computerAttacks, 500)
// 	})
// }

// function computerAttacks(coords = [undefined, undefined]) {
// 	const [_coordX, _coordY] = coords

// 	const coordX = _coordX || getRandomIndex()
// 	const coordY = _coordY || getRandomIndex()

// 	const isHit = gameboardPlayerOne[coordX][coordY] === "Hit"
// 	const isMissed = gameboardPlayerOne[coordX][coordY] === "Missed"
// 	const canAttack = !isHit && !isMissed

// 	if (canAttack) {
// 		playerTwo.attack(playerOne, [coordX, coordY])

// 		const playerOneCellDOM = document.querySelector(`[data-row="${coordX}"][data-col="${coordY}"]`)
// 		playerOneCellDOM.classList.add(gameboardPlayerOne[coordX][coordY].toLowerCase())

// 		if (playerOne.checkGameOver()) return displayGameOver("Computer")
// 	}

// 	if (!canAttack) {
// 		// It first searches if there's a spot that can be attacked in the same row. If not, it searches the first spot in the  gameboard.

// 		const currentRow = gameboardPlayerOne[coordX]
// 		const canAttackCell = (element) => element !== "Hit" && element !== "Missed"

// 		const newCoordY = currentRow.findIndex(canAttackCell)
// 		if (newCoordY !== -1) return computerAttacks([coordX, newCoordY])

// 		for (let i = 0; i < 10; i++) {
// 			const row = gameboardPlayerOne[i]
// 			const colIndex = row.findIndex(canAttackCell)

// 			if (colIndex !== -1) return computerAttacks([i, colIndex])
// 		}
// 	}
// }

// function getRandomIndex() {
// 	return Math.floor(Math.random() * 10)
// }

// function displayGameOver(winner) {
// 	toggleGameContainer()
// 	GameOverDOM(winner)
// 	restartGame()
// }

// function restartGame() {
// 	const restartBtn = document.getElementById("restart-btn")
// 	const gameOverText = document.querySelector(".game-over")

// 	restartBtn.addEventListener("click", () => {
// 		// Check classes of game-container and how to init game

// 		const textContainer = document.querySelector(".text-container")
// 		textContainer.classList.remove("none")

// 		restartBtn.remove()
// 		gameOverText.remove()

// 		const btnSetShipRandomly = document.getElementById("random-ships")
// 		btnSetShipRandomly.classList.remove("none")

// 		removePreviousGameboard()
// 		initGame()
// 	})
// }
