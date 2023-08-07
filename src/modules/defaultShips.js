export function setEnemyShips(gameboard) {
	const defaultShips = [
		["Carrier", [5, 8], "vertical"],
		["Battleship", [4, 0]],
		["Destroyer", [3, 3], "vertical"],
		["Submarine", [0, 7], "vertical"],
		["PatrolBoat", [9, 4]],
	]

	defaultShips.forEach((ship) => {
		gameboard.setShip(ship[0], ship[1], ship[2])
	})
}

function getRandomIndexes() {}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
