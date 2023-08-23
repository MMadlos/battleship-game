import "./style.css"

import { PLAYER } from "./modules/player"
import { displayShipList } from "./modules/DOM/ship-list"
import { displayGrid } from "./modules/DOM/gameboard"

import { addShipSelected, addShipPlaced } from "./modules/DOM/ship-list"
import { addShipPreview, removeShipPreview, addShipToGrid } from "./modules/DOM/gameboard"
import { displayErrorMessage, removeErrorMessage } from "./modules/DOM/messages"

// import { setEnemyShips } from "./modules/defaultShips"
// import { toggleGameContainer, GameOverDOM, removePreviousGameboard } from "./modules/DOM/GameOver"
// import { getAndAppendShipList, addStyleToShipElement, styleShipPlaced } from "./modules/DOM/ship-list"
// import { getAndAppendGameboard, styleShipPreview, removePreview, styleGameboard } from "./modules/DOM/gameboard"
// import { setShipRandomly } from "./modules/placeShipsRandom"

// VARIABLES
let playerOne, playerTwo
let gameboardOne, gameboardTwo // Gameboard factories
let gridOne, gridTwo // Gameboard content

initGame()
function initGame() {
	setVariables()
	displayShipList()
	displayGrid(playerOne)
	displayGrid(playerTwo)
	selectAndPlaceShip()
	// setShipsRandomly()
}

function setVariables() {
	playerOne = PLAYER("Player 1")
	playerTwo = PLAYER("Computer")

	gameboardOne = playerOne.gameboard
	gameboardTwo = playerTwo.gameboard

	gridOne = gameboardOne.grid
	gridTwo = gameboardTwo.grid
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
			// TODO:
			// Add possibility to set all ships randomly
			// Add possibility to remove / move ship placed

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

				removeErrorMessage()
				addShipPlaced()
				addShipToGrid()
				checkAndDisplayStartBtn()

				shipSelected = undefined
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

// function setShipsRandomly() {
// 	const randomBtn = document.getElementById("random-ships")
// 	randomBtn.addEventListener("click", () => {
// 		clearGameboard()
// 		setRandomShips()
// 		styleGameboard(playerOne)
// 		checkAndDisplayStartBtn()

// 		const allShipCards = document.querySelectorAll(".ship-card")
// 		allShipCards.forEach((card) => card.classList.add("placed"))
// 	})

// 	function clearGameboard() {
// 		playerOne.gameboard.clearGameboard()
// 		removePreviousGameboard()
// 		renderGameboards()
// 	}

// 	function setRandomShips() {
// 		const shipNames = Object.keys(shipTypes)
// 		shipNames.forEach((shipName) => {
// 			setShipRandomly(playerOne, shipName)
// 		})
// 	}
// }

function checkAndDisplayStartBtn() {
	// TODO -> Revisar
	const availableShips = Object.keys(gameboardOne.getAvailableShips())
	const areAllShipsPlaced = availableShips.every((element) => element === false)

	if (!areAllShipsPlaced) return

	const startBtn = document.getElementById("start-game")
	startBtn.classList.toggle("none", !areAllShipsPlaced)

	startBtn.onclick = () => {
		const shipList = document.querySelector(".ship-list")
		shipList.remove()

		const btnSetShipRandomly = document.getElementById("random-ships")
		btnSetShipRandomly.classList.add("none")
		startBtn.classList.add("none")

		setEnemyShips(gameboardTwo)
		enableAttackEnemy()
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
