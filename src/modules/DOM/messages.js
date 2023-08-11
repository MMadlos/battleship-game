const messages = {
	outOfBoard: "Ship is being placed out of the grid",
	cellNotEmpty: "There is another ship in these coordinates",
}

export function displayErrorMessage(errorMessage) {
	return console.log(messages[errorMessage])
}
