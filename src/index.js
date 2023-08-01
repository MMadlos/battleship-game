import "./style.css"
import { Player } from "./modules/player"
import { renderGameboard } from "./modules/DOM"

// TODO --> DEFAULT
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

// "START OF THE GAME"

const gameboardOneDOM = document.getElementById("gameboard-one")
const gameboardPlayerOne = gameboardOne.getGameboard()
renderGameboard(gameboardOneDOM, gameboardPlayerOne)

const gameboardTwoDOM = document.getElementById("gameboard-two")
const gameboardPlayerTwo = gameboardTwo.getGameboard()
renderGameboard(gameboardTwoDOM, gameboardPlayerTwo)

// Click cell to attack
/*
* - Click event (Event bubbling)
* - Store row
* - Store column
- Check coords in the gameboard
- Attack
- Display style
- Check if a ship has been sunk
- Check if gameover
*/

const gameboardBoth = document.querySelectorAll(".gameboard")
gameboardBoth.forEach((gameboard) => {
	gameboard.addEventListener("click", (e) => {
		const cell = e.target.closest("div.cell")
		const isCoord = cell.classList.contains("coordY") || cell.classList.contains("coordX")

		if (isCoord) return

		const playerGameboard = cell.parentElement.id
		const coordX = cell.dataset.row
		const coordY = cell.dataset.col
		const coordinates = [coordX, coordY]

		if (playerGameboard === "gameboard-two") {
			const gameboardContent = gameboardPlayerTwo[coordX][coordY]
			const isAlreadyAttacked = gameboardContent === "Hit" || gameboardContent === "Missed"

			if (isAlreadyAttacked) return console.log("You already attacked these coordinates")

			playerOne.attack(playerTwo, coordinates)
			cell.textContent = gameboardPlayerTwo[coordX][coordY]
			cell.classList.add(cell.textContent.toLowerCase())

			// Starting here, it's the computers move
			// TODO -> Should show more stuff before the computer attacks the player (eg. animation )
			// [...]

			const randomCoordX = getRandomIndex()
			const randomCoordY = getRandomIndex()

			const gameboardContentOne = gameboardPlayerOne[randomCoordX][randomCoordY]
			const isAlreadyAttackedOne = gameboardContentOne === "Hit" || gameboardContent === "Missed"

			if (!isAlreadyAttackedOne) {
				playerTwo.attack(playerOne, [randomCoordX, randomCoordY])
				const playerOneCellDOM = document.querySelector(`[data-row="${randomCoordX}"][data-col="${randomCoordY}"]`)
				playerOneCellDOM.textContent = gameboardPlayerOne[randomCoordX][randomCoordY]
				playerOneCellDOM.classList.add(playerOneCellDOM.textContent.toLowerCase())
			}
		}
	})
})

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
