const shipTypes = {
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

	function hit() {
		return (hitsReceived += 1)
	}

	function getIsSunk() {
		isSunk = hitsReceived === length ? true : false
		return isSunk
	}

	const getShipType = () => shipType
	const getLength = () => length
	const getPosition = () => position
	const togglePosition = (newPosition) => (position = newPosition)

	return {
		hitsReceived,
		isSunk,
		hit,
		getShipType,
		getLength,
		getIsSunk,
		getPosition,
		togglePosition,
	}
}
