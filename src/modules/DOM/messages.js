const messages = {
	outOfBoard: "Ship is being placed out of the grid",
	cellNotEmpty: "There is another ship in these coordinates",
}

export function displayErrorMessage(errorMessage) {
	const isErrorDisplayed = document.querySelector(".text-container.errorMsg")
	const textSection = document.querySelector(".text-section")

	if (!isErrorDisplayed) {
		const textContainer = document.createElement("div")
		const textP = document.createElement("p")

		textContainer.classList.add("text-container", "errorMsg")

		textP.textContent = messages[errorMessage]

		textSection.append(textContainer)
		textContainer.append(textP)
	}

	if (isErrorDisplayed) {
		const textError = document.querySelector(".errorMsg")
		textError.textContent = messages[errorMessage]
	}

	return textSection
}
