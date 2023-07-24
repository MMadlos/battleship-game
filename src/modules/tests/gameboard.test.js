import { Gameboard } from "../gameboard"

describe("Get player's name and initiate gameboard", () => {
	const playerOne = Gameboard("Player 1")
	const gameBoard = playerOne.getGameboard()

	test("Player's name", () => {
		expect(playerOne.getPlayer()).toBe("Player 1")
	})

	test("Gameboard has 10 rows and 10 columns", () => {
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
		expect(gameBoard[0][2]).not.toBe("PatrolBoat")
		expect(gameBoard[0][3]).not.toBe("PatrolBoat")
	})

	test("in vertical position, it should return PatrolBoat when checking coordinates (0, 0) and (1, 0)", () => {
		const playerOne = Gameboard("Player 1")

		playerOne.setShip("PatrolBoat", [1, 0], "vertical")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[1][0]).toBe("PatrolBoat")
		expect(gameBoard[2][0]).toBe("PatrolBoat")
		expect(gameBoard[3][0]).not.toBe("PatrolBoat")
		expect(gameBoard[4][0]).not.toBe("PatrolBoat")
	})
})

describe("It returns the ship name when placing ships in the middle of the gameboard", () => {
	test("in vertical position, it returns 'PatrolBoat' in coordinates  [3, 3] and [4, 3] ", () => {
		const playerOne = Gameboard("Player 1")
		playerOne.setShip("PatrolBoat", [3, 3], "vertical")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[2][3]).not.toBe("PatrolBoat")
		expect(gameBoard[3][3]).toBe("PatrolBoat")
		expect(gameBoard[4][3]).toBe("PatrolBoat")
		expect(gameBoard[5][3]).not.toBe("PatrolBoat")
	})

	test("in horizontal position, it returns 'PatrolBoat' in coordinates  [7, 6] and [7, 8]", () => {
		const playerOne = Gameboard("Player 1")
		playerOne.setShip("PatrolBoat", [7, 6], "horizontal")
		let gameBoard = playerOne.getGameboard()

		expect(gameBoard[7][6]).toBe("PatrolBoat")
		expect(gameBoard[7][7]).toBe("PatrolBoat")
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

describe("Place a ship at specific coordinates", () => {
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

	test("check if a certain type of ship is available or not", () => {
		secondPlayer.setShip("PatrolBoat", [0, 0], "horizontal")
		secondPlayer.setShip("Carrier", [2, 1], "horizontal")

		const availableShips = secondPlayer.getAvailableShips()

		expect(availableShips).toEqual(["Battleship", "Destroyer", "Submarine"])
		expect(availableShips.includes("PatrolBoat")).toBe(false)
		expect(availableShips.includes("Carrier")).toBe(false)
		expect(availableShips.includes("Submarine")).toBe(true)
		expect(availableShips.includes("Battleship")).toBe(true)
	})
})

describe("Get ship coordinates if its been placed and return 'Not placed in gameboard'", () => {
	test("if we get the coordinates of 'PatrolBoat', it will return [0, 0]", () => {
		const secondPlayer = Gameboard("Player 2")
		secondPlayer.setShip("PatrolBoat", [0, 0], "horizontal")
		expect(secondPlayer.getShipCoordinates("PatrolBoat")).toEqual([
			[0, 0],
			[0, 1],
		])
	})

	test("in the middle of the gameboard", () => {
		const secondPlayer = Gameboard("Player 2")
		secondPlayer.setShip("PatrolBoat", [5, 3], "horizontal")
		expect(secondPlayer.getShipCoordinates("PatrolBoat")).toEqual([
			[5, 3],
			[5, 4],
		])
	})

	test("when ship is vertical", () => {
		const secondPlayer = Gameboard("Player 2")
		secondPlayer.setShip("PatrolBoat", [5, 3], "vertical")
		expect(secondPlayer.getShipCoordinates("PatrolBoat")).toEqual([
			[5, 3],
			[6, 3],
		])
	})

	test("if we get the coordinates of 'Submarine', it will return [5, 5]", () => {
		const secondPlayer = Gameboard("Player 2")
		secondPlayer.setShip("Submarine", [5, 5], "vertical")
		expect(secondPlayer.getShipCoordinates("Submarine")).toEqual([
			[5, 5],
			[6, 5],
			[7, 5],
		])
	})

	test("if we get the coordinates of 'Carrier', it will return 'Not placed in gameboard'", () => {
		const secondPlayer = Gameboard("Player 2")

		expect(secondPlayer.getShipCoordinates("Carrier")).toBe("Not placed in gameboard")
	})
})

describe("If a ship is attacked, check if a a ship has been hit or record the coordinates of the missed shot. If a ship has bit hit, it records the hit into the ship object", () => {
	const secondPlayer = Gameboard("Player 2")

	test("The attack didn't hit a ship", () => {
		expect(secondPlayer.receiveAttack([0, 0])).toBe("Missed in [0, 0]")
	})

	test("The attack hit a ship", () => {
		secondPlayer.setShip("PatrolBoat", [0, 0], "horizontal")

		expect(secondPlayer.receiveAttack([0, 0])).toBe(true)
	})

	// test("If a ship has been hit, the ship records it", () => {
	// 	expect(secondPlayer.getShip).toBe(true)
	// })
})
