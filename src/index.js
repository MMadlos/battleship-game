import "./style.css"
import { Player } from "./modules/player"
import { boardLimit } from "./modules/gameboard"
import { setEnemyShips } from "./modules/defaultShips"
import { shipTypes } from "./modules/ship"

import { renderGameboard, toggleGameContainer, GameOverDOM, removePreviousGameboard, DOM } from "./modules/DOM"

import { getAndAppendShipList, addStyleToShipElement } from "./modules/DOM/ship-list"
import { getAndAppendGameboard, styleShipPreview, removePreview, styleShipPlaced, styleGameboard } from "./modules/DOM/gameboard"

// DEFAULT
const gameboardOneDOM = document.getElementById("gameboard-one")
const gameboardTwoDOM = document.getElementById("gameboard-two")

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
	addShipsPlayerGameboard()
}

function renderGameboards() {
	const gameContainer = document.querySelector(".game-container")
	const sectionPlayerOne = getAndAppendGameboard(playerOne)
	const sectionPlayerTwo = getAndAppendGameboard(playerTwo)
	gameContainer.append(sectionPlayerOne, sectionPlayerTwo)
}

let shipSelected
let position = "horizontal"
selectShipToPlace()

function selectShipToPlace() {
	const shipList = document.querySelector(".ship-list")
	shipList.onclick = (e) => {
		const shipCard = e.target.closest(".ship-card")
		if (!shipCard) return

		addStyleToShipElement(shipCard, "select")

		document.onkeydown = (e) => {
			if (e.code !== "KeyR") return
			position = position === "horizontal" ? "vertical" : "horizontal"
		}

		shipSelected = shipCard.dataset.ship
	}
}

// Add visual clue where the ship will be placed and style it accordingly (when is possible, when is not and when is being placed)

function addShipsPlayerGameboard() {
	const playerGrid = document.getElementById("gameboard-one")
	;["mouseover", "mouseout", "click"].forEach((mouseEvent) => {
		playerGrid.addEventListener(mouseEvent, (e) => {
			// TODO -> Sistema para mover el barco de nuevo o para eliminarlo.
			// TODO -> Para que cuando pulse R se vuelva a ejecutar este código, debería hacer un event listener keydown + función

			const isNotGameboard = e.target.closest("coordY") || e.target.closest("coordX")
			if (!shipSelected || isNotGameboard) return

			const cell = e.target.closest(".cell")
			const { row, col } = cell.dataset
			const rowIndex = Number(row)
			const colIndex = Number(col)

			if (mouseEvent === "mouseover") styleShipPreview(cell, shipSelected, position)
			if (mouseEvent === "mouseout") removePreview()
			if (mouseEvent === "click") {
				gameboardOne.setShip(shipSelected, [rowIndex, colIndex], position)
				shipSelected = undefined

				// TODO -> A partir de aquí, sólo si se ha podido añadir el barco
				// setShip() devuelve mensaje si no se ha podido añadir el barco

				styleShipPlaced()
				styleGameboard(playerOne)

				// Display start game btn after all ships are placed
				const availableShips = gameboardOne.getAvailableShips()
				if (availableShips.length === 0) startBtnListener()
			}
		})
	})

	// Add styles
	// Add possibility to set all ships randomly
	// Add possibility to remove ship placed
}

function startBtnListener() {
	const btnContainer = document.querySelector(".btn-container")
	btnContainer.classList.remove("none")

	const startBtn = document.getElementById("start-game")
	startBtn.addEventListener("click", () => {
		const shipContainer = document.querySelector(".ship-list")
		shipContainer.classList.add("none")
		startBtn.remove()
		setEnemyShips(gameboardTwo)
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
		restartBtn.remove()
		gameOverText.remove()

		textContainer.classList.remove("none")

		removePreviousGameboard()
		initGame()
	})
}
