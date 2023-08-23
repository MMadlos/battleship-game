const SHIP_LENGTH = {
	Carrier: 5,
	Battleship: 4,
	Destroyer: 3,
	Submarine: 3,
	PatrolBoat: 2,
}

const SHIP_NAMES = Object.keys(SHIP_LENGTH)

function SHIP(shipName) {
	const length = SHIP_LENGTH[shipName]

	let isPlaced = false
	let hitsReceived = 0
	let isSunk = false

	const hit = () => {
		hitsReceived = hitsReceived + 1
		if (hitsReceived === length) isSunk = true
	}

	const reset = () => {
		isPlaced = false
		hitsReceived = 0
		isSunk = false
	}

	function getSunk() {
		return isSunk
	}

	return { length, isPlaced, hitsReceived, isSunk, hit, reset, getSunk }
}

export { SHIP_LENGTH, SHIP_NAMES, SHIP }
