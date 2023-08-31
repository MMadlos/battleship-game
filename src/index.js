import "./style.css"

import { PLAYER } from "./modules/player"
import { setRandomShips, getRandomBetween } from "./modules/placeShipsRandom"
import { setEnemyShips } from "./modules/defaultShips"

import { appendInstructions, hideInstructions, showInstructions, appendAttackInstructions, hideAttackInstructions } from "./modules/DOM/instructions"
import { appendShipList, shipCardStyle } from "./modules/DOM/ship-list"
import { displayGrid, addShipPreview, removeShipPreview, addShipToGrid, toggleGameContainer, removePreviousGameboard } from "./modules/DOM/gameboard"
import { displayErrorMessage, removeErrorMessage } from "./modules/DOM/messages"
import { GameOverDOM } from "./modules/DOM/GameOver"
import { BOARD_LIMIT } from "./modules/gameboard"

const playerOne = PLAYER("Player 1")
const playerTwo = PLAYER("Computer")
const gameboardOne = playerOne.gameboard
const gameboardTwo = playerTwo.gameboard

initGame()

function initGame() {
	appendInstructions()
	appendShipList()

	displayGrid(playerOne)
	displayGrid(playerTwo)
	appendStartBtn()

	selectAndPlaceShip()
	btnRandomShips()
}

function appendStartBtn() {
	// UI
	const startBtn = document.createElement("button")
	startBtn.id = "start-game"
	startBtn.textContent = "Start game"
	startBtn.className = "disabled"

	// APEND
	const sectionTwo = document.querySelector("#gameboard-two").parentElement
	sectionTwo.append(startBtn)
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
		styleGameBoard()
		checkAndDisplayStartBtn()

		const allShipCards = document.querySelectorAll(".ship-card")
		allShipCards.forEach((card) => card.classList.add("placed"))
	})

	function styleGameBoard() {
		const grid = gameboardOne.getGrid()
		grid.forEach((row, rowIndex) => {
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
	startBtn.classList.remove("disabled")
	startBtn.onclick = () => {
		hideInstructions()
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
	hideAttackInstructions()
	GameOverDOM(winner)
	restartGame()
}

function restartGame() {
	const restartBtn = document.getElementById("restart-btn")
	const gameOverText = document.querySelector(".game-over")

	restartBtn.addEventListener("click", () => {
		showInstructions()

		restartBtn.remove()
		gameOverText.remove()

		gameboardOne.clearGameboard()
		gameboardTwo.clearGameboard()

		toggleGameContainer()
	})
}
