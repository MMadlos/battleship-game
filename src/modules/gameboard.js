import { Ship } from "./ship"

export function Gameboard(player) {
	// Ship names -> size
	/* 
    - Carrier: 5
    - Battleship: 4
    - Destroyer: 3
    - Submarine: 3
    - Patrol Boat: 2

    */

	let playerName = player
	let gameboard = setGameboard()
	const availableShips = {
		Carrier: true,
		Battleship: true,
		Destroyer: true,
		Submarine: true,
		PatrolBoat: true,
	}

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
			for (let i = coordY; i <= coordX + shipLength; i++) {
				gameboard[coordX][i] = shipType
			}
		}

		if (position === "vertical") {
			for (let i = coordX; i <= coordY + shipLength; i++) {
				gameboard[i][coordY] = shipType
			}
		}

		availableShips[shipType] = false
	}

	const getAvailableShips = () => {
		const _ships = []
		for (const [key, value] of Object.entries(availableShips)) {
			if (value) _ships.push(key)
		}

		return _ships
	}

	const getShipCoordinates = (shipType) => {
		// Buscar en gameboard[i][j] si existe el tipo de barco
		// Buscar la posición
	}

	return { getPlayer, getGameboard, setShip, getShipCoordinates, getAvailableShips }
}

function setGameboard() {
	const rows = new Array()
	rows.length = 10

	for (let i = 0; i < rows.length; i++) {
		const columns = new Array()
		columns.length = 10

		rows[i] = columns
	}

	return rows
}

/*
gameboard = [
    [0] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [1] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [2] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [3] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [4] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [5] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [6] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [7] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [8] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    [9] -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
]

*/
