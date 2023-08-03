export function setDefaultShips(gameboardOne, gameboardTwo) {
	getRandomIndexes()
	const defaultShipsOne = [
		["Carrier", [0, 5], "vertical"],
		["Battleship", [0, 0]],
		["Destroyer", [2, 0]],
		["Submarine", [5, 6]],
		["PatrolBoat", [9, 4]],
	]

	const defaultShipsTwo = [
		["Carrier", [5, 8], "vertical"],
		["Battleship", [4, 0]],
		["Destroyer", [3, 3]],
		["Submarine", [0, 7]],
		["PatrolBoat", [9, 4]],
	]

	defaultShipsOne.forEach((ship) => {
		gameboardOne.setShip(ship[0], ship[1], ship[2])
	})

	defaultShipsTwo.forEach((ship) => {
		gameboardTwo.setShip(ship[0], ship[1], ship[2])
	})
}

function getRandomIndexes() {}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
