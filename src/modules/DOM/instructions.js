import { appendShipList } from "./ship-list"

const textSection = document.querySelector(".text-section")

const instructionsText = {
	icon: `<i class="fa-solid fa-arrow-pointer"></i>`,
	paraMain: `<p>Place ships manually</p>`,
	paraOne: `<p>- Select a ship and click on your grid to place it</p>`,
	paraTwo: `<p>- Press “R” while placing the ship in the grid to rotate it</p>`,
}

// Containers
const instructionsContainer = document.createElement("div")
const instructionsContent = document.createElement("div")
const manualContainer = document.createElement("div")
const shipList = document.createElement("div")

instructionsContainer.className = "instructions-container"
instructionsContent.className = "instructions-content"
manualContainer.className = "manual-container"
shipList.className = "ship-list"

textSection.append(instructionsContainer)
instructionsContainer.append(instructionsContent, shipList)
instructionsContent.append(manualContainer)

export function appendInstructions() {
	addText()
	addRandomBtn()
	appendShipList()
}

const addText = () => {
	const { icon, paraMain, paraOne, paraTwo } = instructionsText

	const manualText = document.createElement("div")
	manualText.className = "manual-text"
	manualText.innerHTML = icon + paraMain

	const manualDetails = document.createElement("div")
	manualDetails.className = "manual-details"
	manualDetails.innerHTML = paraOne + paraTwo

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

export function removeInstructions() {
	instructionsContainer.remove()
}

export function showInstructions() {
	const textSection = document.querySelector(".text-section")
	textSection.append(instructionsContainer)
}

export function appendAttackInstructions() {
	const attackInstructionsContainer = document.createElement("div")
	attackInstructionsContainer.className = "attack-instructions"

	const mainContainer = document.createElement("div")
	const icon = document.createElement("i")
	icon.classList.add("fa-solid", "fa-bullseye")
	const mainP = document.createElement("p")

	const firstP = document.createElement("p")
	const secondP = document.createElement("p")
	const thirdP = document.createElement("p")

	mainP.textContent = "Attack your enemy"
	firstP.textContent = "Click on one cell of the enemy's grid to attack the area."
	secondP.textContent = "- Green: you hit a ship."
	thirdP.textContent = "- Red: you missed the shot"

	textSection.append(attackInstructionsContainer)
	attackInstructionsContainer.append(mainContainer, firstP, secondP, thirdP)
	mainContainer.append(icon, mainP)
}

export function removeAttackInstructions() {
	const attackInstructions = document.querySelector(".attack-instructions")
	attackInstructions.remove()
}

export function showAttackInstructions() {
	const attackInstructions = document.querySelector(".attack-instructions")
	attackInstructions.classList.remove("none")
}

function iconClose() {
	const container = document.createElement("div")
	const firstLine = document.createElement("div")
	const secondLine = document.createElement("div")

	container.className = "close-icon"
	firstLine.className = "first-line"
	secondLine.className = "second-line"

	container.append(firstLine, secondLine)
	return container
}
