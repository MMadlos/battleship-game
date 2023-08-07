import "./style.css"
import { Player } from "./modules/player"
import { boardLimit } from "./modules/gameboard"
import { setDefaultShips } from "./modules/defaultShips"
import { shipTypes } from "./modules/ship"

import { renderGameboard, toggleGameContainer, GameOverDOM, removePreviousGameboard, DOM } from "./modules/DOM"

DOM().append()

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

initGame()
addShipsPlayerGameboard()

function addShipsPlayerGameboard() {
	const allShipCards = document.querySelectorAll(".ship-card")
	const playerGrid = document.getElementById("gameboard-one")

	let shipSelected
	let position = "horizontal"

	allShipCards.forEach((card) => {
		card.addEventListener("click", () => {
			shipSelected = card.querySelector(".ship-name").textContent
			DOM().shipList.select(shipSelected)
		})

		document.addEventListener("keydown", (e) => {
			if (e.code === "KeyR") {
				position = position === "horizontal" ? "vertical" : "horizontal"
			}
		})
	})

	// Add visual clue where the ship will be placed and style it accordingly (when is possible, when is not and when is being placed)
	;["mouseover", "mouseout", "click", "keydown"].forEach((mouseEvent) => {
		playerGrid.addEventListener(mouseEvent, (e) => {
			const isNotGameboard = e.target.closest("coordY") || e.target.closest("coordX")

			if (!shipSelected || isNotGameboard) return
			if (mouseEvent === "mouseout") return DOM().shipList.removePreview()

			const cell = e.target.closest(".cell")
			const { row, col } = cell.dataset
			const rowIndex = Number(row)
			const colIndex = Number(col)

			const shipName = shipSelected
			const shipLength = shipTypes[shipName]

			// TODO -> Check what would happen when the player rotates the ship

			if (mouseEvent === "mouseover") {
				if (position === "horizontal") {
					const fitsInGameboardHor = colIndex + shipLength <= boardLimit + 1
					const remainingCellsHor = boardLimit - colIndex + 1
					if (fitsInGameboardHor) DOM().shipList.isPossible(rowIndex, colIndex, shipLength, position)
					if (!fitsInGameboardHor) DOM().shipList.isNotPossible(rowIndex, colIndex, remainingCellsHor, position)
				}

				if (position === "vertical") {
					const fitsInGameboardVer = rowIndex + shipLength <= boardLimit + 1
					const remainingCellsVer = boardLimit - rowIndex + 1

					if (fitsInGameboardVer) DOM().shipList.isPossible(rowIndex, colIndex, shipLength, position)
					if (!fitsInGameboardVer) DOM().shipList.isNotPossible(rowIndex, colIndex, remainingCellsVer, position)
				}
			}

			if (mouseEvent === "click") {
				gameboardOne.setShip(shipSelected, [rowIndex, colIndex], position)
				shipSelected = undefined

				// TODO -> A partir de aquí, sólo si se ha podido añadir el barco
				// setShip() devuelve mensaje si no se ha podido añadir el barco

				DOM().shipList.shipPlaced()

				// Ver si se puede pintar sólo las casillas donde se ha añadido el barco y no todo el gameboard
				removePreviousGameboard()
				renderGameboard(gameboardOneDOM, gameboardPlayerOne)
				renderGameboard(gameboardTwoDOM, gameboardPlayerTwo) // Temporal --> Esconder en esta fase del juego. Debería hacer render después de hacer click en Start Game.

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

function initGame() {
	setVariables()
	// setDefaultShips(gameboardOne, gameboardTwo)
	renderGameboard(gameboardOneDOM, gameboardPlayerOne)
	renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)
}

function startBtnListener() {
	// TODO -> Player can't click in the enemy's grid until it clicks the start game
	const btnContainer = document.querySelector(".btn-container")
	btnContainer.classList.remove("none")

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
