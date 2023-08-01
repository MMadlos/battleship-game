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
* - Click event
* - Store row
* - Store column
- Check coords in the gameboard
- Attack
- Display style
- Check if a ship has been sunk
- Check if gameover
*/

// Gameboard One
// const gameboardOneDOM = document.getElementById("gameboard-one")
// const allRowsDOM = gameboardOneDOM.querySelectorAll(".row:not(.coordY)")
// allRowsDOM.forEach((row) => {
// 	row.addEventListener("click", (e) => {
// 		if (e.target === undefined) return

// 		const rowIndex = row.dataset.row
// 		const colDOM = e.target
// 		const colIndex = colDOM.dataset.col

// 		playerTwo.attack(playerOne, [rowIndex, colIndex])

// 		console.table(gameboardOne.getGameboard())
// 	})
// })
