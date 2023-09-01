const messages = {
	outOfBoard: "Ship is being placed out of the grid",
	cellNotEmpty: "There is another ship in these coordinates",
}

export function displayErrorMessage(errorMessage) {
	const isErrorDisplayed = document.querySelector(".text-container.errorMsg")
	const app = document.querySelector("#app")

	const textContainer = document.createElement("div")
	const icon = document.createElement("i")
	const textP = document.createElement("p")

	textContainer.classList.add("text-container", "errorMsg")
	icon.classList.add("fa-solid", "fa-circle-exclamation")
	textP.textContent = messages[errorMessage]

	if (!isErrorDisplayed) {
		app.append(textContainer)
		textContainer.append(icon, textP)
	}

	if (isErrorDisplayed) {
		const textError = document.querySelector(".errorMsg > p")
		textError.textContent = messages[errorMessage]
	}

	return app
}

export function removeErrorMessage() {
	const errorMessage = document.querySelector(".errorMsg")
	if (errorMessage) errorMessage.remove()
}
