export function setEnemyShips(gameboard) {
	const defaultShips = [
		["Carrier", [0, 0]],
		["Battleship", [1, 0]],
		["Destroyer", [2, 0]],
		["Submarine", [3, 0]],
		["PatrolBoat", [4, 0]],
	]

	defaultShips.forEach((ship) => {
		gameboard.setShip(ship[0], ship[1], ship[2])
	})
}

function getRandomIndexes() {}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
