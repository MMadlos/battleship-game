import "./style.css"
import { Player } from "./modules/player"
import { setEnemyShips } from "./modules/defaultShips"

import { toggleGameContainer, GameOverDOM, removePreviousGameboard } from "./modules/DOM"

import { getAndAppendShipList, addStyleToShipElement, styleShipPlaced } from "./modules/DOM/ship-list"
import { getAndAppendGameboard, styleShipPreview, removePreview, styleGameboard } from "./modules/DOM/gameboard"
import { displayErrorMessage } from "./modules/DOM/messages"

// TODO ->
// - Styling
// - Add messages
// - Add images
// - Order code (imports, exports and file structure)
// - Add features (place ships randomly, enable to move a ship that has been already placed, add second "human" player)

// VARIABLES
let playerOne, playerTwo
let gameboardOne, gameboardTwo // Gameboard factories
let gameboardPlayerOne, gameboardPlayerTwo // Gameboard content

initGame()
function initGame() {
	// We'll need to set the variables when the game starts and when we restart the game after a gameover
	playerOne = Player("Player 1")
	playerTwo = Player("Computer")

	gameboardOne = playerOne.gameboard
	gameboardTwo = playerTwo.gameboard
	gameboardPlayerOne = gameboardOne.getGameboard()
	gameboardPlayerTwo = gameboardTwo.getGameboard()

	getAndAppendShipList()
	renderGameboards()
	selectAndPlaceShip()
}

function renderGameboards() {
	const gameContainer = document.querySelector(".game-container")
	const sectionPlayerOne = getAndAppendGameboard(playerOne)
	const sectionPlayerTwo = getAndAppendGameboard(playerTwo)
	gameContainer.append(sectionPlayerOne, sectionPlayerTwo)
}

function selectAndPlaceShip() {
	let shipSelected
	let position = "horizontal"

	// Select ship
	const shipList = document.querySelector(".ship-list")
	shipList.onclick = (e) => {
		const shipCard = e.target.closest(".ship-card:not(.placed)")
		if (!shipCard) return

		addStyleToShipElement(shipCard)
		shipSelected = shipCard.dataset.ship
	}

	// Add visual clue where the ship will be placed and style it accordingly (when is possible, when is not and when is placed)
	const playerGrid = document.getElementById("gameboard-one")
	;["mouseover", "mouseout", "click"].forEach((mouseEvent) => {
		playerGrid.addEventListener(mouseEvent, (e) => {
			// TODO:
			// Add possibility to set all ships randomly
			// Add possibility to remove / move ship placed

			const isNotGameboard = e.target.closest("coordY") || e.target.closest("coordX")
			if (!shipSelected || isNotGameboard) return

			const cell = e.target.closest(".cell")

			document.onkeydown = (e) => {
				if (e.code !== "KeyR") return

				position = position === "horizontal" ? "vertical" : "horizontal"
				removePreview()
				styleShipPreview(cell, shipSelected, position)
			}

			if (mouseEvent === "mouseover") styleShipPreview(cell, shipSelected, position)
			if (mouseEvent === "mouseout") removePreview()
			if (mouseEvent === "click") {
				const { row, col } = cell.dataset
				const coordinates = [Number(row), Number(col)]

				const setShip = gameboardOne.setShip(shipSelected, coordinates, position)
				if (setShip.error) return displayErrorMessage(setShip.message)

				styleShipPlaced()
				styleGameboard(playerOne)
				checkAndDisplayStartBtn()

				shipSelected = undefined
			}
		})
	})
}

function checkAndDisplayStartBtn() {
	const availableShips = Object.keys(gameboardOne.getAvailableShips())
	const areAllShipsPlaced = availableShips.every((element) => element === false)
	if (!areAllShipsPlaced) return

	const btnContainer = document.querySelector(".btn-container")
	btnContainer.classList.remove("none")

	const startBtn = document.getElementById("start-game")
	startBtn.classList.remove("none")

	startBtn.onclick = () => {
		const shipList = document.querySelector(".ship-list")
		shipList.remove()

		startBtn.classList.add("none")

		setEnemyShips(gameboardTwo)
		enableAttackEnemy()
	}
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
	const restartBtn = document.getElementById("restart-btn")
	const gameOverText = document.querySelector(".game-over")

	restartBtn.addEventListener("click", () => {
		// Check classes of game-container and how to init game

		const textContainer = document.querySelector(".text-container")
		textContainer.classList.remove("none")

		restartBtn.remove()
		gameOverText.remove()

		removePreviousGameboard()
		initGame()
	})
}
