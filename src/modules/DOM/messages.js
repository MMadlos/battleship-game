const messages = {
	outOfBoard: "Ship is being placed out of the grid",
	cellNotEmpty: "There is another ship in these coordinates",
}

export function placingMsg(shipResult) {
	const { message } = shipResult

	const outOfBoard = message === "Out of board"
	const cellNotEmpty = message === "Not empty"

	if (outOfBoard) return console.log(messages.outOfBoard)
	if (cellNotEmpty) return console.log(messages.cellNotEmpty)
}
