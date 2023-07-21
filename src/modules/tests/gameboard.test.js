import { Gameboard } from "../gameboard"

describe("it contains functions to get who's player gameboard is and to get the gameboard", () => {
	const playerOne = Gameboard("Player 1")
	const gameBoard = playerOne.getGameboard()

	test("it returns player's name when using getPlayer()", () => {
		expect(playerOne.getPlayer()).toBe("Player 1")
	})

	test("If gameboard is set, it will contain 10 rows and 10 columns", () => {
		expect(gameBoard.length).toBe(10)
		expect(gameBoard[0].length).toBe(10)
		expect(gameBoard[4].length).toBe(10)
		expect(gameBoard[5].length).toBe(10)
	})
})

describe("It returns the ship name when placing it at the begining of the gameboard (0,0)", () => {
	test("in horizontal position should return 'PatrolBoat' in coordinates (0, 0) and (0, 1) ", () => {
		const playerOne = Gameboard("Player 1")
		playerOne.setShip("PatrolBoat", [0, 0], "horizontal")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[0][0]).toBe("PatrolBoat")
		expect(gameBoard[0][1]).toBe("PatrolBoat")
	})

	test("in vertical position, it should return PatrolBoat when checking coordinates (0, 0) and (1, 0)", () => {
		const playerOne = Gameboard("Player 1")

		playerOne.setShip("PatrolBoat", [1, 0], "vertical")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[1][0]).toBe("PatrolBoat")
		expect(gameBoard[2][0]).toBe("PatrolBoat")
	})
})

describe("It returns the ship name when placing ships in the middle of the gameboard", () => {
	test("in vertical position, it returns 'PatrolBoat' in coordinates  [3, 3] and [4, 3] ", () => {
		const playerOne = Gameboard("Player 1")
		playerOne.setShip("PatrolBoat", [3, 3], "vertical")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[3][3]).toBe("PatrolBoat")
		expect(gameBoard[4][3]).toBe("PatrolBoat")
	})

	test("in horizontal position, it returns 'PatrolBoat' in coordinates  [7, 6] and [7, 8]", () => {
		const playerOne = Gameboard("Player 1")
		playerOne.setShip("PatrolBoat", [7, 6], "horizontal")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[7][6]).toBe("PatrolBoat")
		expect(gameBoard[7][8]).toBe("PatrolBoat")
	})
})

describe("It returns a message when placing a ship out of the scope of the gameboard", () => {
	test("horizontal limit", () => {
		const playerOne = Gameboard("Player 1")

		let horizontalLimit = playerOne.setShip("PatrolBoat", [0, 9], "horizontal")
		expect(horizontalLimit).toBe("It can't be placed")

		horizontalLimit = playerOne.setShip("Carrier", [0, 5], "horizontal")
		expect(horizontalLimit).toBe("It can't be placed")
	})

	test("vertical limit", () => {
		const playerOne = Gameboard("Player 1")

		let verticalLimit = playerOne.setShip("PatrolBoat", [9, 0], "vertical")
		expect(verticalLimit).toBe("It can't be placed")

		verticalLimit = playerOne.setShip("Carrier", [6, 5], "horizontal")
		expect(verticalLimit).toBe("It can't be placed")
	})
})

describe("setShip() should only be able to set once each type of ship", () => {
	const secondPlayer = Gameboard("Player 2")

	test("if no ship has been placed, getAvailableShips() should display all ship names", () => {
		const allShips = ["Carrier", "Battleship", "Destroyer", "Submarine", "PatrolBoat"]

		expect(secondPlayer.getAvailableShips()).toEqual(allShips)
	})

	test("if 'Carrier' and 'PatrolBoat' hast been place, it should not display them when getAvailableShips is called", () => {
		secondPlayer.setShip("Carrier", [0, 0], "horizontal")
		secondPlayer.setShip("PatrolBoat", [3, 0], "vertical")

		const availableShips = ["Battleship", "Destroyer", "Submarine"]
		expect(secondPlayer.getAvailableShips()).toEqual(availableShips)
	})

	test("if a ship has been placed already, it should return 'It's already placed'", () => {
		secondPlayer.setShip("PatrolBoat", [0, 0], "horizontal")
		expect(secondPlayer.setShip("PatrolBoat", [0, 0], "horizontal")).toBe("It's already placed in the gameboard")
	})
})
