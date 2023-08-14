import { Ship } from "./ship"

export const boardLimit = 9

export function Gameboard() {
	let gameboard = setGameboard()

	const availableShips = {
		Carrier: true,
		Battleship: true,
		Destroyer: true,
		Submarine: true,
		PatrolBoat: true,
	}

	const shipsPlaced = {}
	const getShipsPlaced = () => shipsPlaced
	const getGameboard = () => gameboard
	const setShip = (shipType, coordinates, shipPosition = "horizontal") => {
		const ship = Ship(shipType)
		ship.setPosition(shipPosition)

		const [coordX, coordY] = coordinates
		const shipLength = ship.getLength()
		const position = ship.getPosition()

		// Check that the ship won't be outside of the board
		const positionCoord = position === "horizontal" ? coordY : coordX
		const isOutOfBoard = positionCoord + shipLength - 1 > boardLimit
		if (isOutOfBoard) return { error: true, message: "outOfBoard" }

		// Check if coords are available and place the ship if possible
		// Checkes are different loops. If not, it messes with the styles. It has to check firt if all cells are empty and then place the shipType in the gameboard.

		if (position === "horizontal") {
			for (let i = coordY; i < coordY + shipLength; i++) {
				const isEmpty = gameboard[coordX][i] === "Empty"
				if (!isEmpty) return { error: true, message: "cellNotEmpty" }
			}

			for (let i = coordY; i < coordY + shipLength; i++) {
				gameboard[coordX][i] = shipType
			}
		}

		if (position === "vertical") {
			for (let i = coordX; i < coordX + shipLength; i++) {
				const isEmpty = gameboard[i][coordY] === "Empty"
				if (!isEmpty) return { error: true, message: "cellNotEmpty" }
			}

			for (let i = coordX; i < coordX + shipLength; i++) {
				gameboard[i][coordY] = shipType
			}
		}

		availableShips[shipType] = false
		shipsPlaced[shipType] = ship
		return true
	}

	const clearGameboard = () => {
		// Crea objeto Ship() y lo añade a "shipsPlaced"
		// Añade en las coordenadas el nombre del barco
		// Cambia los ships disponibles a false

		//* Borrar todos los objetos en shipsPlaced
		//* Crear de nuevo el gameboard
		// Cambiar los ships disponibles a true

		const shipsPlacedNames = Object.keys(shipsPlaced)
		shipsPlacedNames.forEach((ship) => {
			availableShips[ship] = true
			delete shipsPlaced[ship]
		})

		gameboard = setGameboard()
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

		const areNotAllSunk = shipStatuses.some((status) => status === false)

		return areNotAllSunk ? false : true
	}

	return { shipsPlaced, getShipsPlaced, getGameboard, setShip, getShipCoordinates, getAvailableShips, receiveAttack, checkGameOver, clearGameboard }
}

function setGameboard() {
	let rows = []

	for (let i = 0; i < 10; i++) {
		let columns = []
		for (let j = 0; j < 10; j++) {
			columns[j] = "Empty"
		}
		rows[i] = columns
	}

	return rows
}
