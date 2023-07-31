import { Gameboard } from "./gameboard"

export function Player(name) {
	const playerName = name
	const gameboard = Gameboard(playerName)
	let turnToPlay

	const getName = () => playerName
	const setTurnToPlay = () => (turnToPlay = true)
	const isTurn = () => turnToPlay
	const getGameboard = () => gameboard.getGameboard()

	const attack = (enemy, coordinates) => {
		const enemyName = enemy.getName()
		const enemyGameboard = enemy.gameboard

		if (enemyName === "Computer") enemyGameboard.receiveAttack(coordinates)
		if (enemyName !== "Computer") {
			// MAKE COMPUTER RANDOM MOVES
			/*
			* IDEA
			Empezar por la fila: mirar un número random del 0 al 9
			Mirar si esa fila contiene espacios "Empty"
			Seleccionar uno de esos espacios

			TODO --> Si la fila no tiene ningún espacio "Empty", seleccionar la siguiente fila y el siguiente espacio empty
			*/

			const coordX = getRandomIndex()
			const coordY = getRandomIndex()

			// Check what's in those coordinates
			const boardContent = enemy.getGameboard()[coordX][coordY]

			if (boardContent === "Empty") enemy.gameboard.receiveAttack([coordX, coordY])
			if (boardContent !== "Empty") {
				const rowElements = enemyGameboard[coordX]
				const emptyColumnIndex = rowElements.indexOf("Empty")
				if (emptyColumnIndex === -1) console.log("REVISAR LÓGICA")
				if (emptyColumnIndex !== 1) enemy[gameboard].receiveAttack([coordX, emptyColumnIndex])
			}
		}

		turnToPlay = false
		enemy.setTurnToPlay()
	}

	const checkGameOver = () => gameboard.checkGameOver()

	return { gameboard, setTurnToPlay, getName, isTurn, getGameboard, attack, checkGameOver }
}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
