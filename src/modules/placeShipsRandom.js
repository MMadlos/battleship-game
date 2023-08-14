// *AÑADIR BARCOS ALEATORIAMENTE
/*
Place ships randomly
- Tener en cuenta la longitud de cada barco
- Tener en cuenta que cambian los parámetros (coordX o coordY) en función de la orientación del barco (horizontal / vertical)
- Añadir de más grande a más pequeño (Carrier y Battleship)
- Incrustar Destroyer, Submarine y PatrolBoat 
	- Random coord
	- Revisar longitud de "Empty" en esa fila
	- Ver si coincide con su longitud
	- Añadir si coincide

Notas
1 -> Carrier (length: 5)
	Posibilidades: del 0 al 5 -> A partir del 5 ya estaría outOfBoard

2 -> Battleship (length: 4)
	Posibilidades: del 0 al 6
*/

// STEPS
// Generar parámetros aleatorios
// --> Random num between 2 nums:
function getRandomBetween(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is exclusive and the minimum is inclusive
}

// --> Posición: Horizontal / Vertical
function RandomPosition() {
	const positions = ["horizontal", "vertical"]
	const randomIndex = getRandomBetween(0, 1)
	return positions[randomIndex]
}

const shipLengths = {
	Carrier: 5,
	Battleship: 4,
	Destroyer: 3,
	Submarine: 3,
	PatrolBoat: 2,
}
const BOARD_LIMIT = 9

function getRandomCoord(shipName) {
	const maxIndex = BOARD_LIMIT - shipLengths[shipName]

	const position = RandomPosition()
	const randomIndex = getRandomBetween(0, BOARD_LIMIT)
	const randomRestrictedIndex = getRandomBetween(0, maxIndex)

	const coordX = position === "horizontal" ? randomIndex : randomRestrictedIndex
	const coordY = position === "horizontal" ? randomRestrictedIndex : randomIndex

	const coordinates = [coordX, coordY]

	return { position, coordinates }
}

// If the ship is being placed and there is already a ship in those coordinates, it has to check the next coordinates available
export function setShipRandomly(player, shipName) {
	// TODO -> Remove everything in case it clicks the setShipRandomly btn again.

	const { coordinates, position } = getRandomCoord(shipName)
	const setShip = player.gameboard.setShip(shipName, coordinates, position)

	// When there is already a ship placed, it will check for an empty row or column (depending on the ship's position) and it will generate a new random index to place it.
	if (setShip.error) {
		const gameboard = player.getGameboard()
		const maxIndex = BOARD_LIMIT - shipLengths[shipName]
		const randomIndex = getRandomBetween(0, maxIndex)
		let newCoordinates

		const cellEmpty = (cell) => cell === "Empty"

		if (position === "vertical") {
			for (let i = 0; i < gameboard.length; i++) {
				const col = []

				for (let j = 0; j < gameboard.length; j++) {
					col.push(gameboard[j][i])
				}

				if (col.every(cellEmpty)) {
					newCoordinates = [randomIndex, i]
					break
				}
			}
		}

		if (position === "horizontal") {
			const rows = []
			gameboard.forEach((row) => rows.push(row))

			rows.forEach((row, rowIndex) => {
				newCoordinates = [rowIndex, randomIndex]
				if (row.every(cellEmpty)) return
			})
		}

		player.gameboard.setShip(shipName, newCoordinates, position)
	}
}