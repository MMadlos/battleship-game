import { GAMEBOARD } from "./gameboard"

export function PLAYER(name) {
	const gameboard = GAMEBOARD()
	const attack = (enemy, coordinates) => {
		return enemy.gameboard.receiveAttack(coordinates)
	}

	return { name, gameboard, attack }
}
