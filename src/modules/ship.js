export function Ship(lengthNum) {
	const length = lengthNum
	let hitsReceived = 0
	let isShipSunk = false

	function hit() {
		return (hitsReceived += 1)
	}

	function checkIsSunk() {
		isShipSunk = hitsReceived === length ? true : false
		return isShipSunk
	}

	return {
		length,
		hitsReceived,
		isShipSunk,
		hit,
		checkIsSunk,
	}
}
