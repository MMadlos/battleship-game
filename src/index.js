import "./style.css"

import { PLAYER } from "./modules/player"
import { setRandomShips, getRandomBetween } from "./modules/placeShipsRandom"
import { setEnemyShips } from "./modules/defaultShips"

import { appendInstructions, removeInstructions, appendAttackInstructions, removeAttackInstructions, showInstructions } from "./modules/DOM/instructions"
import { shipCardStyle, resetShipList } from "./modules/DOM/ship-list"
import {
	displayGrid,
	addShipPreview,
	removeShipPreview,
	addShipToGrid,
	toggleGameContainer,
	removeGameboards,
	removePreviousGameboard,
	appendStartBtn,
} from "./modules/DOM/gameboard"
import { displayErrorMessage, removeErrorMessage } from "./modules/DOM/messages"
import { GameOverDOM } from "./modules/DOM/GameOver"
import { BOARD_LIMIT } from "./modules/gameboard"

const playerOne = PLAYER("Player 1")
const playerTwo = PLAYER("Computer")
const gameboardOne = playerOne.gameboard
const gameboardTwo = playerTwo.gameboard

// TODO - Check the flow of how elements are created.
// At some points, they are appended then hidden. Some are removed and added again. Todo: unify system so they are not duplicated.

// Idea: start with appendUI() then use hide() or show(). If so, they have to return to the initial state. For example: ship cards. Maybe use a reset() button / fn

initGame()

function initGame() {
	appendInstructions()

	displayGrid(playerOne)
	displayGrid(playerTwo)
	appendStartBtn()

	selectAndPlaceShip()
	btnRandomShips()
}

function selectAndPlaceShip() {
	let shipSelected
	let position = "horizontal"

	const shipList = document.querySelectorAll(".ship-card")
	shipList.forEach((card) => {
		card.onclick = () => {
			if (card.classList.contains("placed")) return

			shipCardStyle("selected", card)
			shipSelected = card.dataset.ship
		}
	})

	const playerGrid = document.getElementById("gameboard-one")
	;["mouseover", "mouseout", "click"].forEach((mouseEvent) => {
		playerGrid.addEventListener(mouseEvent, (e) => {
			const isNotGameboard = e.target.closest("coordY") || e.target.closest("coordX")
			if (!shipSelected || isNotGameboard) return

			const cell = e.target.closest(".cell")

			if (mouseEvent === "mouseover") {
				document.onkeydown = rotateShipPosition
				addShipPreview(cell, shipSelected, position)
			}
			if (mouseEvent === "mouseout") removeShipPreview()
			if (mouseEvent === "click") {
				const { row, col } = cell.dataset
				const coordinates = [Number(row), Number(col)]
				const setShip = gameboardOne.setShip(shipSelected, coordinates, position)

				if (setShip.error) return displayErrorMessage(setShip.message)

				shipSelected = undefined
				removeErrorMessage()
				shipCardStyle("placed")
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
		gameboardOne.clearGameboard()
		setRandomShips(playerOne)
		styleGameBoard(gameboardOne)
		checkAndDisplayStartBtn()

		const allShipCards = document.querySelectorAll(".ship-card")
		allShipCards.forEach((card) => card.classList.add("placed"))
	})
}

function styleGameBoard(playerGameboard) {
	const grid = playerGameboard.getGrid()

	const gameboardID = playerGameboard === gameboardOne ? "#gameboard-one" : "#gameboard-two"

	grid.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const div = document.querySelector(`${gameboardID} > [data-row="${rowIndex}"][data-col="${colIndex}"]`)

			if (div.classList.contains("missed")) div.classList.remove("missed")
			if (div.classList.contains("hit")) div.classList.remove("hit")

			const isNotEmpty = col !== "Empty"
			div.classList.toggle("ship-placed", isNotEmpty)
		})
	})
}

function checkAndDisplayStartBtn() {
	const allShipsPlaced = gameboardOne.checkAllShipsPlaced()
	if (allShipsPlaced) displayStartBtn()
}

function displayStartBtn() {
	const startBtn = document.getElementById("start-game")
	startBtn.classList.remove("disabled")
	startBtn.onclick = () => {
		removeInstructions()
		appendAttackInstructions()

		setEnemyShips(gameboardTwo)
		enableAttackEnemy()

		startBtn.remove()

		const gridTwo = document.getElementById("gameboard-two")
		gridTwo.classList.remove("opacity-20")

		const gridTwoText = document.querySelector(".grid-title.opacity-20")
		gridTwoText.classList.remove("opacity-20")
	}
}

function enableAttackEnemy() {
	const opponentGameboard = document.getElementById("gameboard-two")
	opponentGameboard.addEventListener("click", (e) => {
		const cell = e.target.closest("div.cell")
		const isNotGameboard = cell.classList.contains("coordY") || cell.classList.contains("coordX")

		if (isNotGameboard) return

		const coordX = cell.dataset.row
		const coordY = cell.dataset.col

		const gridTwo = gameboardTwo.getGrid()
		const gameboardContent = gridTwo[coordX][coordY]
		const isAlreadyAttacked = gameboardContent === "Hit" || gameboardContent === "Missed"

		if (isAlreadyAttacked) return console.log("You already attacked these coordinates")

		const coordinates = [Number(coordX), Number(coordY)]

		const attack = playerOne.attack(playerTwo, coordinates)
		cell.classList.add(gridTwo[coordX][coordY].toLowerCase())

		// Check gameover for PlayerTwo
		if (attack === "GameOver") {
			displayGameOver("Player")
			return
		}

		// TODO -> Should show more stuff before the computer attacks the player (eg. animation )
		// [...]

		setTimeout(computerAttacks, 500)
	})
}

function computerAttacks(coords = [undefined, undefined]) {
	const [_coordX, _coordY] = coords

	const coordX = _coordX || getRandomBetween(0, BOARD_LIMIT)
	const coordY = _coordY || getRandomBetween(0, BOARD_LIMIT)

	const gridOne = gameboardOne.getGrid()

	const isHit = gridOne[coordX][coordY] === "Hit"
	const isMissed = gridOne[coordX][coordY] === "Missed"
	const canAttack = !isHit && !isMissed

	if (canAttack) {
		playerTwo.attack(playerOne, [coordX, coordY])

		const playerOneCellDOM = document.querySelector(`[data-row="${coordX}"][data-col="${coordY}"]`)
		playerOneCellDOM.classList.add(gridOne[coordX][coordY].toLowerCase())

		if (gameboardOne.isGameOver()) return displayGameOver("Computer")
	}

	if (!canAttack) {
		// It first searches if there's a spot that can be attacked in the same row. If not, it searches the first spot in the  gameboard.

		const currentRow = gridOne[coordX]
		const canAttackCell = (element) => element !== "Hit" && element !== "Missed"

		const newCoordY = currentRow.findIndex(canAttackCell)
		if (newCoordY !== -1) return computerAttacks([coordX, newCoordY])

		for (let i = 0; i < 10; i++) {
			const row = gridOne[i]
			const colIndex = row.findIndex(canAttackCell)

			if (colIndex !== -1) return computerAttacks([i, colIndex])
		}
	}
}

function displayGameOver(winner) {
	toggleGameContainer()
	removeAttackInstructions()
	GameOverDOM(winner)
	restartGame()
}

function restartGame() {
	const restartBtn = document.getElementById("restart-btn")
	const gameOverText = document.querySelector(".game-over")

	restartBtn.addEventListener("click", () => {
		restartBtn.remove()
		gameOverText.remove()
		removeGameboards()

		gameboardOne.clearGameboard()
		gameboardTwo.clearGameboard()

		showInstructions()
		resetShipList()
		toggleGameContainer()
		displayGrid(playerOne)
		displayGrid(playerTwo)
		selectAndPlaceShip()
		appendStartBtn()
	})
}
