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
		hitsReceived++

		if (hitsReceived === length) isSunk = true
	}

	const reset = () => {
		isPlaced = false
		hitsReceived = 0
		isSunk = false
	}

	return { length, isPlaced, hitsReceived, isSunk, hit, reset }
}

export { SHIP_LENGTH, SHIP_NAMES, SHIP }

// OLD
export const shipTypes = {
	Carrier: 5,
	Battleship: 4,
	Destroyer: 3,
	Submarine: 3,
	PatrolBoat: 2,
}

export function Ship(shipType) {
	const length = shipTypes[shipType]
	let hitsReceived = 0
	let isSunk = false
	let position = "horizontal"
	let shipName = shipType

	function hit() {
		hitsReceived = hitsReceived + 1
		isSunk = length === hitsReceived ? true : false
	}

	function getIsSunk() {
		return isSunk
	}

	const getShipType = () => shipType
	const getLength = () => length
	const getPosition = () => position
	const setPosition = (newPosition) => (position = newPosition)
	const getHits = () => hitsReceived

	return {
		shipName,
		hit,
		getShipType,
		getLength,
		getIsSunk,
		getPosition,
		setPosition,
		getHits,
	}
}
