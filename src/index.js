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

// Gameboard One
const gameboardOneDOM = document.getElementById("gameboard-one")
const gameboardTwoDOM = document.getElementById("gameboard-two")

const gameboardPlayerOne = gameboardOne.getGameboard()
const gameboardPlayerTwo = gameboardTwo.getGameboard()

// Crear div y recuperar índice de fila e índice de columna
for (let i = 0; i <= 10; i++) {
	const div = document.createElement("div")
	div.textContent = i
	div.classList.add("cell", "coordY")
	gameboardOneDOM.append(div)
}

gameboardPlayerOne.forEach((row, rowIndex) => {
	row.forEach((col, colIndex) => {
		if (colIndex === 0) {
			const div = document.createElement("div")
			gameboardOneDOM.append(div)
			div.textContent = rowIndex + 1
			div.classList.add("cell", "coordX")
		}

		const div = document.createElement("div")
		div.textContent = col
		div.dataset.row = rowIndex
		div.dataset.col = colIndex
		div.classList.add("cell")
		if (col !== "Empty") div.classList.add("ship-placed")

		gameboardOneDOM.append(div)
	})
})

for (let i = 0; i <= 10; i++) {
	const div = document.createElement("div")
	div.textContent = i
	div.classList.add("cell", "coordY")
	gameboardTwoDOM.append(div)
}

gameboardPlayerTwo.forEach((row, rowIndex) => {
	row.forEach((col, colIndex) => {
		if (colIndex === 0) {
			const div = document.createElement("div")
			gameboardTwoDOM.append(div)
			div.textContent = rowIndex + 1
			div.classList.add("cell", "coordX")
		}

		const div = document.createElement("div")
		div.textContent = col
		div.dataset.row = rowIndex
		div.dataset.col = colIndex
		div.classList.add("cell")
		if (col !== "Empty") div.classList.add("ship-placed")

		gameboardTwoDOM.append(div)
	})
})

// OLD
// renderGameboard()

// displayGameboardContent(gameboardOne.getGameboard())
// displayGameboardContent(gameboardTwo.getGameboard())

// function displayGameboardContent(playerGameboard) {
// 	const playerBoard = playerGameboard === gameboardOne.getGameboard() ? "gameboard-one" : "gameboard-two"

// 	// Recorrer el objeto y guardar el índice de la fila y el índice de la columna
// 	playerGameboard.forEach((row, rowIndex) => {
// 		row.forEach((col, colIndex) => {
// 			const cell = document.querySelector(`#${playerBoard} > [data-row="${rowIndex}"] > [data-col="${colIndex}"]`)
// 			cell.textContent = col

// 			if (col !== "Empty") cell.classList.add("ship-placed")
// 		})
// 	})
// }

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
