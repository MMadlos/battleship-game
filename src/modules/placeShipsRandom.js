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

export function getRandomCoord(shipName) {
	const maxIndex = BOARD_LIMIT - shipLengths[shipName]

	const position = RandomPosition()
	const randomIndex = getRandomBetween(0, BOARD_LIMIT)
	const randomRestrictedIndex = getRandomBetween(0, maxIndex)

	const coordX = position === "horizontal" ? randomIndex : randomRestrictedIndex
	const coordY = position === "horizontal" ? randomRestrictedIndex : randomIndex

	const randomCoord = [coordX, coordY]

	return randomCoord
}
