import { Player } from "../player"

test("Player is a function", () => {
	expect(typeof Player).toBe("function")
})

describe("Initiate a new player", () => {
	const firstPlayer = Player("Player 1")
	const secondPlayer = Player("Computer")

	test("Get player's name", () => {
		expect(firstPlayer.getName()).toBe("Player 1")
	})
	test("Is player's turn", () => {
		expect(firstPlayer.setTurnToPlay()).toBe(true)
	})
	test.skip("It's not player's turn after attacking the enemy board", () => {
		firstPlayer.attack("Computer", [0, 0])

		expect(firstPlayer.getPlayerTurn()).toBe(false)
	})
})
