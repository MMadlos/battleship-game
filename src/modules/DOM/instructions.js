const textSection = document.querySelector(".text-section")

const instructionsText = {
	icon: `<i class="fa-solid fa-arrow-pointer"></i>`,
	paraMain: `<p>Place ships manually</p>`,
	paraOne: `<p>- Select a ship and click on your grid to place it</p>`,
	paraTwo: `<p>- Press “R” while placing the ship in the grid to rotate it</p>`,
}

// CONTAINERS
const instructionsContainer = document.createElement("div")
const instructionsContent = document.createElement("div")
const manualContainer = document.createElement("div")

instructionsContainer.className = "instructions-container"
instructionsContent.className = "instructions-content"
manualContainer.className = "manual-container"

const addText = () => {
	const { icon, paraMain, paraOne, paraTwo } = instructionsText

	// MANUAL TEXT
	const manualText = document.createElement("div")
	manualText.className = "manual-text"
	manualText.innerHTML = icon + paraMain

	// MANUAL DETAILS
	const manualDetails = document.createElement("div")
	manualDetails.className = "manual-details"
	manualDetails.innerHTML = paraOne + paraTwo

	//SHIPLIST CONTAINER
	const shipList = document.createElement("div")
	shipList.className = "ship-list"

	// APEND
	textSection.append(instructionsContainer)
	instructionsContainer.append(instructionsContent, shipList)
	instructionsContent.append(manualContainer)
	manualContainer.append(manualText, manualDetails)
}

const addRandomBtn = () => {
	const instructionsContent = document.querySelector(".instructions-content")
	const randomBtn = document.createElement("button")
	const btnIcon = `<i class="fa-solid fa-shuffle"></i>`
	const span = `<span>Place ships randomly</span>`

	randomBtn.id = "random-ships"
	randomBtn.innerHTML = btnIcon + span

	instructionsContent.append(randomBtn)
}

export function appendInstructions() {
	addText()
	addRandomBtn()
}

export function hideInstructions() {
	instructionsContainer.classList.add("none")
}

export function showInstructions() {
	instructionsContainer.classList.remove("none")
}
