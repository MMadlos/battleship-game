import { Player } from "../player"

/* 
From T.O.P.
* - Players can take turns playing the game by attacking the enemy Gameboard. 
- The game is played against the computer, so make the ‘computer’ capable of making random plays. The AI does not have to be smart, but it should know whether or not a given move is legal. (i.e. it shouldn’t shoot the same coordinate twice).
*/

const player = Player("Player")
const computer = Player("Computer")

const playerGameboard = player.gameboard
const computerGameboard = computer.gameboard

playerGameboard.setShip("PatrolBoat", [0, 0])
computerGameboard.setShip("PatrolBoat", [8, 8], "vertical")

describe("Players can take turns playing the game by attacking the enemy Gameboard", () => {
	test("If player attack, it's computer turn", () => {
		player.attack(computer, [0, 0])
		expect(computer.isTurn()).toBe(true)
		expect(player.isTurn()).toBe(false)
	})
	test("If computer attack, it's player's turn", () => {
		computer.attack(player)
		expect(player.isTurn()).toBe(true)
		expect(computer.isTurn()).toBe(false)
	})
})

describe("When attacking an enemy's board, it will show in the enemy's gameboard if it hit a ship or it's missed", () => {
	test("If a ship it's hit, the enemy board will show 'Hit' ", () => {
		player.attack(computer, [8, 8])
		expect(computer.getGameboard()[8][8]).toBe("Hit")
	})
	test("If there isn't a ship, the enemy board will show 'Missed' ", () => {
		player.attack(computer, [5, 5])
		expect(computer.getGameboard()[5][5]).toBe("Missed")
	})
})
