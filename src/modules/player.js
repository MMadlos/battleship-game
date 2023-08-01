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
		const isEnemyComputer = enemy.getName() === "Computer"
		const enemyGameboard = enemy.gameboard

		enemyGameboard.receiveAttack(coordinates)

		turnToPlay = false
		enemy.setTurnToPlay()
	}

	const checkGameOver = () => gameboard.checkGameOver()

	return { gameboard, setTurnToPlay, getName, isTurn, getGameboard, attack, checkGameOver }
}

function getRandomIndex() {
	return Math.floor(Math.random() * 10)
}
