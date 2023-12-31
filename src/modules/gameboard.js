import { SHIP_NAMES, SHIP } from "./ship"

const BOARD_LIMIT = 9

function GAMEBOARD() {
	const ships = createShips()
	let grid = createGrid()

	const setShip = (shipName, coordinates, shipPosition = "horizontal") => {
		const { length } = ships[shipName]

		const [coordX, coordY] = coordinates
		const isHorizontal = shipPosition === "horizontal"

		const positionCoord = isHorizontal ? coordY : coordX
		const isOutOfBoard = positionCoord + length - 1 > BOARD_LIMIT

		if (isOutOfBoard) return { error: true, message: "outOfBoard" }

		for (let i = positionCoord; i < positionCoord + length; i++) {
			const cellContent = isHorizontal ? grid[coordX][i] : grid[i][coordY]
			if (cellContent !== "Empty") return { error: true, message: "cellNotEmpty" }
		}

		for (let i = positionCoord; i < positionCoord + length; i++) {
			isHorizontal ? (grid[coordX][i] = shipName) : (grid[i][coordY] = shipName)
		}

		ships[shipName].setIsPlaced()

		return true
	}

	function receiveAttack(coordinates) {
		const [coordX, coordY] = coordinates
		const shipName = grid[coordX][coordY]

		const isEmpty = shipName === "Empty"
		grid[coordX][coordY] = isEmpty ? "Missed" : "Hit"

		if (!isEmpty) ships[shipName].hit()

		return isGameOver() ? "GameOver" : grid[coordX][coordY]
	}

	function isGameOver() {
		const allShipSunk = []
		for (const shipName in ships) {
			allShipSunk.push(ships[shipName].getSunk())
		}

		return allShipSunk.every((status) => status === true)
	}

	const clearGameboard = () => {
		for (const shipName in ships) {
			ships[shipName].reset()
		}

		grid = createGrid()
	}

	const checkAllShipsPlaced = () => {
		console.log(ships) // All ships true
		for (const ship in ships) {
			const isShipPlaced = ships[ship].getIsPlaced()
			if (!isShipPlaced) return false
		}
		return true
	}

	const getGrid = () => grid
	const getShips = () => ships

	return { setShip, receiveAttack, clearGameboard, checkAllShipsPlaced, getGrid, getShips, isGameOver }
}

function createGrid() {
	let rows = []

	for (let i = 0; i <= BOARD_LIMIT; i++) {
		let columns = []
		for (let j = 0; j <= BOARD_LIMIT; j++) {
			columns[j] = "Empty"
		}
		rows[i] = columns
	}

	return rows
}

function createShips() {
	const allShips = {}
	SHIP_NAMES.forEach((shipName) => {
		allShips[shipName] = SHIP(shipName)
	})

	return allShips
}

export { GAMEBOARD, BOARD_LIMIT }
