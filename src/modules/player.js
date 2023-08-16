import { Gameboard, GAMEBOARD } from "./gameboard"

export function PLAYER(name) {
	const playerGameboard = GAMEBOARD()
	const { gameboard } = playerGameboard
	const attack = (enemy, coordinates) => {
		const enemyGameboard = enemy.gameboard
		enemyGameboard.receiveAttack(coordinates)
	}

	return { name, gameboard, attack }
}

export function Player(name) {
	const playerName = name
	const gameboard = Gameboard(playerName)
	let turnToPlay

	const getName = () => playerName
	const setTurnToPlay = () => (turnToPlay = true)
	const isTurn = () => turnToPlay
	const getGameboard = () => gameboard.getGameboard()

	const attack = (enemy, coordinates) => {
		const enemyGameboard = enemy.gameboard
		enemyGameboard.receiveAttack(coordinates)

		turnToPlay = false
		enemy.setTurnToPlay()
	}

	const checkGameOver = () => gameboard.checkGameOver()

	return { gameboard, setTurnToPlay, getName, isTurn, getGameboard, attack, checkGameOver }
}
