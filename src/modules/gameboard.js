import { SHIP_LENGTH, SHIP_NAMES, SHIP, Ship, shipTypes } from "./ship"

const BOARD_LIMIT = 9

// TODO --> Crear objetos con el nombre y su función => Ej:
/*
Ej: 
allShips = 	
{
	Carrier: {...},
	Battleship: {...},
	Destroyer: {...},
	...
}
*/

function createShips() {
	const allShips = {}
	SHIP_NAMES.forEach((shipName) => {
		allShips[shipName] = SHIP(shipName)
	})

	return allShips
}

function GAMEBOARD() {
	const grid = setGameboard()
	const ships = createShips()

	// Gameboards should be able to place ships at specific coordinates by calling the ship factory function.
	const setShip = (shipName, coordinates, shipPosition = "horizontal") => {
		const length = ships[shipName]

		const [coordX, coordY] = coordinates
		const isHorizontal = shipPosition === "horizontal"

		const positionCoord = isHorizontal ? coordY : coordX
		const isOutOfBoard = positionCoord + length - 1 > BOARD_LIMIT

		if (isOutOfBoard) return { error: true, message: "outOfBoard" }

		// There has to be 2 loops in order to first check if all cells are empty and then, if true, place the ship.
		for (let i = positionCoord; i < positionCoord + length; i++) {
			const cellContent = isHorizontal ? grid[coordX][i] : grid[i][coordY]
			if (cellContent !== "Empty") return { error: true, message: "cellNotEmpty" }
		}

		for (let i = positionCoord; i < positionCoord + length; i++) {
			isHorizontal ? (grid[coordX][i] = shipName) : (grid[i][coordY] = shipName)
			// const cellContent = isHorizontal ? grid[coordX][i] : grid[i][coordY]
			// cellContent = shipName
		}

		ships[shipName].isPlaced = true

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
			allShipSunk.push(ships[shipName].isSunk)
		}

		return allShipSunk.every((status) => status === true)
	}

	const clearGameboard = () => {
		for (const shipName in ships) {
			ships[shipName].reset()
		}

		grid = setGameboard()
	}

	return { grid, ships, setShip, receiveAttack, clearGameboard }
}

export { GAMEBOARD }

// OLD
export const boardLimit = 9

function createShipsGameboard() {
	const shipsName = Object.keys(shipTypes)
	const _ships = {}
	shipsName.forEach((ship) => {
		_ships[ship] = {
			isAvailable: true,
			isPlaced: false,
			object: undefined,
		}
	})
	return _ships
}

export function Gameboard() {
	let gameboard = setGameboard()
	const SHIPS = createShipsGameboard()

	const availableShips = {
		Carrier: true,
		Battleship: true,
		Destroyer: true,
		Submarine: true,
		PatrolBoat: true,
	}

	const shipsPlaced = {}
	const getShipsPlaced = () => {
		const shipsPlaced = []
		for (const ship of SHIPS) {
			if (ship.isPlaced) shipsPlaced.push(ship)
		}

		return shipsPlaced
	}
	const getGameboard = () => gameboard
	const setShip = (shipType, coordinates, shipPosition = "horizontal") => {
		const ship = Ship(shipType)
		ship.setPosition(shipPosition)

		const [coordX, coordY] = coordinates
		const shipLength = ship.getLength()
		const position = ship.getPosition()
		const isHorizontal = position === "horizontal"

		// Check that the ship won't be outside of the board
		const positionCoord = isHorizontal ? coordY : coordX
		const isOutOfBoard = positionCoord + shipLength - 1 > boardLimit
		if (isOutOfBoard) return { error: true, message: "outOfBoard" }

		// Check if coords are available and place the ship if possible
		// There has to be 2 loops in order to first check if all cells are empty and then, if true, place the ship.

		for (let i = positionCoord; i < positionCoord + shipLength; i++) {
			const cellToCheck = isHorizontal ? gameboard[coordX][i] : gameboard[i][coordY]
			if (cellToCheck !== "Empty") return { error: true, message: "cellNotEmpty" }
		}

		for (let i = positionCoord; i < positionCoord + shipLength; i++) {
			isHorizontal ? (gameboard[coordX][i] = shipType) : (gameboard[i][coordY] = shipType)
		}

		availableShips[shipType] = false
		shipsPlaced[shipType] = ship

		SHIPS[shipType].object = ship
		SHIPS[shipType].isAvailable = false
		SHIPS[shipType].isPlaced = true
		return true
	}

	const getAvailableShips = () => {
		const _ships = []
		for (const [key, value] of Object.entries(availableShips)) {
			if (value) _ships.push(key)
		}

		return _ships
	}

	const getShipCoordinates = (shipType) => {
		const columnIndexes = []
		const rowIndexes = []
		gameboard.forEach((row, index) => {
			// Finds a ship in each index of each row and stores its index
			let shipFound = false
			for (const [index, element] of row.entries()) {
				if (element === shipType) {
					if (!columnIndexes.includes(index)) columnIndexes.push(index)
					shipFound = true
				}
			}

			if (shipFound === true) rowIndexes.push(index)
		})

		const shipNotFound = columnIndexes.length === 0 && rowIndexes.length === 0
		if (shipNotFound) return "Not placed in gameboard"

		const coordinates = []
		const shipVertical = columnIndexes.length > 1
		const shipHorizontal = rowIndexes.length > 1

		if (shipVertical) {
			columnIndexes.forEach((columnIndex) => coordinates.push([rowIndexes[0], columnIndex]))
		}
		if (shipHorizontal) {
			rowIndexes.forEach((rowIndex) => coordinates.push([rowIndex, columnIndexes[0]]))
		}
		return coordinates
	}

	function receiveAttack(coordinates) {
		const [coordX, coordY] = coordinates
		const isThereAShip = gameboard[coordX][coordY] !== "Empty" ? true : false

		if (!isThereAShip) {
			gameboard[coordX][coordY] = "Missed"
			return `Missed in [${coordX}, ${coordY}]`
		}
		if (isThereAShip) {
			const shipName = gameboard[coordX][coordY]
			shipsPlaced[shipName].hit()

			gameboard[coordX][coordY] = "Hit"
			return isThereAShip
		}
	}

	function checkGameOver() {
		const shipStatuses = []

		for (const shipPlaced in shipsPlaced) {
			const isSunk = shipsPlaced[shipPlaced].getIsSunk()
			shipStatuses.push(isSunk)
		}

		const isGameOver = shipStatuses.every((isShipSunk) => isShipSunk === true)
		return isGameOver
	}

	const clearGameboard = () => {
		const shipsPlacedNames = Object.keys(shipsPlaced)
		shipsPlacedNames.forEach((ship) => {
			availableShips[ship] = true
			delete shipsPlaced[ship]
		})

		gameboard = setGameboard()
	}

	return { shipsPlaced, getShipsPlaced, getGameboard, setShip, getShipCoordinates, getAvailableShips, receiveAttack, checkGameOver, clearGameboard }
}

function setGameboard() {
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
