import "./style.css"
import { Player } from "./modules/player"
import { createGameboard } from "./modules/DOM"

/* Instructions from The Odin Project:

* - The game loop should set up a new game by creating Players and Gameboards. For now just populate each Gameboard with predetermined coordinates. You can implement a system for allowing players to place their ships later.

* - You should display both the player’s boards and render them using information from the Gameboard class

- You need methods to render the gameboards and to take user input for attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.

[...]

*/

const playerOne = Player("Player 1")
const playerTwo = Player("Computer")

createGameboard()

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

displayGameboardContent(gameboardOne.getGameboard())
displayGameboardContent(gameboardTwo.getGameboard())

function displayGameboardContent(playerGameboard) {
	const playerBoard = playerGameboard === gameboardOne.getGameboard() ? "gameboard-one" : "gameboard-two"

	// Recorrer el objeto y guardar el índice de la fila y el índice de la columna
	playerGameboard.forEach((row, rowIndex) => {
		row.forEach((col, colIndex) => {
			const cell = document.querySelector(`#${playerBoard} > [data-row="${rowIndex}"] > [data-col="${colIndex}"]`)
			cell.textContent = col

			if (col !== "Empty") cell.classList.add("ship-placed")
		})
	})
}

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
