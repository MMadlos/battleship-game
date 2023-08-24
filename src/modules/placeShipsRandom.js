import { SHIP_LENGTH, SHIP_NAMES } from "./ship"
import { BOARD_LIMIT } from "./gameboard"

export function setRandomShips(player) {
	SHIP_NAMES.forEach((shipName) => {
		setShipRandomly(player, shipName)
	})
}

// If the ship is being placed and there is already a ship in those coordinates, it has to check the next coordinates available
function setShipRandomly(player, shipName) {
	const { coordinates, position } = getRandomCoord(shipName)
	const setShip = player.gameboard.setShip(shipName, coordinates, position)

	// When there is already a ship placed, it will check for an empty row or column (depending on the ship's position) and it will generate a new random index to place it.
	if (setShip.error) {
		const grid = player.gameboard.getGrid()
		const maxIndex = BOARD_LIMIT - SHIP_LENGTH[shipName]
		const randomIndex = getRandomBetween(0, maxIndex)
		let newCoordinates

		const cellEmpty = (cell) => cell === "Empty"

		if (position === "vertical") {
			for (let i = 0; i < grid.length; i++) {
				const col = []

				for (let j = 0; j < grid.length; j++) {
					col.push(grid[j][i])
				}

				if (col.every(cellEmpty)) {
					newCoordinates = [randomIndex, i]
					break
				}
			}
		}

		if (position === "horizontal") {
			const rows = []
			grid.forEach((row) => rows.push(row))

			rows.forEach((row, rowIndex) => {
				newCoordinates = [rowIndex, randomIndex]
				if (row.every(cellEmpty)) return
			})
		}

		player.gameboard.setShip(shipName, newCoordinates, position)
	}
}

function getRandomCoord(shipName) {
	const maxIndex = BOARD_LIMIT - SHIP_LENGTH[shipName]

	const position = RandomPosition()
	const randomIndex = getRandomBetween(0, BOARD_LIMIT)
	const randomRestrictedIndex = getRandomBetween(0, maxIndex)
	const isHorizontal = position === "horizontal"

	const coordX = isHorizontal ? randomIndex : randomRestrictedIndex
	const coordY = isHorizontal ? randomRestrictedIndex : randomIndex

	const coordinates = [coordX, coordY]

	return { position, coordinates }
}

export function getRandomBetween(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function RandomPosition() {
	const positions = ["horizontal", "vertical"]
	const randomIndex = getRandomBetween(0, 1)
	return positions[randomIndex]
}
