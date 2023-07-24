import { Ship } from "./ship"

const shipNames = ["Carrier", "Battleship", "Destroyer", "Submarine", "PatrolBoat"]

export function Gameboard(player) {
	let playerName = player
	let gameboard = setGameboard()
	const availableShips = {
		Carrier: true,
		Battleship: true,
		Destroyer: true,
		Submarine: true,
		PatrolBoat: true,
	}

	const shipsPlaced = {}

	const getPlayer = () => playerName
	const getGameboard = () => gameboard
	const setShip = (shipType, coordinates, shipPosition = "horizontal") => {
		if (!availableShips[shipType]) return `It's already placed in the gameboard`

		const ship = Ship(shipType)
		ship.togglePosition(shipPosition)

		const [coordX, coordY] = coordinates
		const shipLength = ship.getLength()
		const boardLimit = 9
		if ((coordX || coordY) + shipLength > boardLimit) return "It can't be placed"

		const position = ship.getPosition()
		if (position === "horizontal") {
			for (let i = coordY; i < coordY + shipLength; i++) {
				gameboard[coordX][i] = shipType
			}
		}

		if (position === "vertical") {
			for (let i = coordX; i < coordX + shipLength; i++) {
				gameboard[i][coordY] = shipType
			}
		}

		availableShips[shipType] = false
		shipsPlaced[shipType] = ship
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
		const isThereAShip = typeof gameboard[coordX][coordY] === "string" ? true : false

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
		// Comprobar que todos los barcos están hundidos
		const shipCounter = shipNames.length
		let shipSunkCounter = 0

		shipNames.forEach((shipName) => {
			const isShipSunk = shipsPlaced[shipName].getIsSunk()
			if (isShipSunk) shipSunkCounter++
		})

		return shipCounter === shipSunkCounter ? "Game over" : "It's not over yet"
	}

	return { shipsPlaced, getPlayer, getGameboard, setShip, getShipCoordinates, getAvailableShips, receiveAttack, checkGameOver }
}

function setGameboard() {
	const rows = new Array()
	rows.length = 10

	for (let i = 0; i < rows.length; i++) {
		const columns = new Array()
		columns.length = 10

		for (let j = 0; i < 10; j++) {
			columns[j] = "Empty"
		}

		rows[i] = columns
	}

	return rows
}
