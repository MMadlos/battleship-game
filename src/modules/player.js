import { GAMEBOARD } from "./gameboard"

export function PLAYER(name) {
	const gameboard = GAMEBOARD()
	const attack = (enemy, coordinates) => {
		const enemyGameboard = enemy.gameboard
		enemyGameboard.receiveAttack(coordinates)
	}

	return { name, gameboard, attack }
}
