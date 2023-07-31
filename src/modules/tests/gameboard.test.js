import { Gameboard } from "../gameboard"

let gameboard
beforeEach(() => {
	return (gameboard = Gameboard())
})

describe("It renders a board of 10 rows and 10 columns", () => {
	test("row length and column length are 10", () => {
		expect(gameboard.getGameboard().length).toBe(10)
		expect(gameboard.getGameboard()[0].length).toBe(10)
		expect(gameboard.getGameboard()[3].length).toBe(10)
		expect(gameboard.getGameboard()[9].length).toBe(10)
	})
	test("each index has a string === 'Empty'", () => {
		const arrayEmpty = []
		for (let i = 0; i < 10; i++) {
			arrayEmpty[i] = "Empty"
		}

		expect(gameboard.getGameboard()[0]).toEqual(arrayEmpty)
		expect(gameboard.getGameboard()[0][9]).toBe("Empty")
		expect(gameboard.getGameboard()[3][3]).toBe("Empty")
		expect(gameboard.getGameboard()[9][0]).toBe("Empty")
	})
})

/* From T.O.P. -> Gameboards should be able to place ships at specific coordinates by calling the ship factory function. */

describe("It should place ships at specific coordinates", () => {
	test("Ship in horizontal", () => {
		gameboard.setShip("PatrolBoat", [0, 0], "horizontal")

		expect(gameboard.getGameboard()[0][0]).toBe("PatrolBoat")
		expect(gameboard.getGameboard()[1][0]).toBe("Empty")
		expect(gameboard.getGameboard()[0][1]).toBe("PatrolBoat")
		expect(gameboard.getGameboard()[0][2]).not.toBe("PatrolBoat")
		expect(gameboard.getGameboard()[0][3]).not.toBe("PatrolBoat")
	})
	test("Ship in vertical", () => {
		gameboard.setShip("Carrier", [1, 0], "vertical")

		expect(gameboard.getGameboard()[1][0]).toBe("Carrier")
		expect(gameboard.getGameboard()[2][0]).toBe("Carrier")
		expect(gameboard.getGameboard()[3][0]).toBe("Carrier")
		expect(gameboard.getGameboard()[4][0]).toBe("Carrier")
		expect(gameboard.getGameboard()[5][0]).toBe("Carrier")
		expect(gameboard.getGameboard()[6][0]).not.toBe("Carrier")
		expect(gameboard.getGameboard()[0][0]).not.toBe("Carrier")
		expect(gameboard.getGameboard()[2][1]).not.toBe("Carrier")
		expect(gameboard.getGameboard()[5][1]).not.toBe("Carrier")
	})
	test("Ship at the edge of the boardgame", () => {
		gameboard.setShip("Submarine", [3, 7], "horizontal")

		expect(gameboard.getGameboard()[3][7]).toBe("Submarine")
		expect(gameboard.getGameboard()[3][8]).toBe("Submarine")
		expect(gameboard.getGameboard()[3][9]).toBe("Submarine")
		expect(gameboard.getGameboard()[3][6]).not.toBe("Submarine")
		expect(gameboard.getGameboard()[4][9]).not.toBe("Submarine")
		expect(gameboard.getGameboard()[2][9]).not.toBe("Submarine")
	})
})

describe("Placing part of the ship outside the gameboard", () => {
	test("horizontal limit", () => {
		expect(gameboard.setShip("Submarine", [3, 8], "horizontal")).toBe(console.log("Sumbarine can't be placed at [3, 8]"))
	})
	test("vertical limit", () => {
		expect(gameboard.setShip("Submarine", [8, 0], "vertical")).toBe(console.log("Sumbarine can't be placed at [8, 0]"))
	})
})

describe("When trying to put a ship on coordinates where there's already a ship", () => {
	test("Should return message", () => {
		gameboard.setShip("Carrier", [0, 0], "horizontal")

		expect(gameboard.setShip("PatrolBoat", [0, 0], "horizontal")).toBe(console.log("PatrolBoat can't be placed at [0, 0]"))
		expect(gameboard.setShip("PatrolBoat", [4, 0], "horizontal")).toBe(console.log("PatrolBoat can't be placed at [4, 0]"))
		expect(gameboard.setShip("PatrolBoat", [3, 0], "horizontal")).toBe(console.log("PatrolBoat can't be placed at [3, 0]"))
	})
})

describe("Trying to put a ship that has been already placed", () => {
	test("Should return message", () => {
		gameboard.setShip("Carrier", [0, 0], "horizontal")

		expect(gameboard.setShip("Carrier", [5, 0], "horizontal")).toBe(console.log(`It's already placed in the gameboard`))
	})
})

describe("Get available ships and get coordinates from a ship already placed", () => {
	test("Get all ships by default", () => {
		expect(gameboard.getAvailableShips()).toEqual(["Carrier", "Battleship", "Destroyer", "Submarine", "PatrolBoat"])
	})

	test("To not get ship already placed", () => {
		gameboard.setShip("Carrier", [0, 0], "horizontal")

		expect(gameboard.getAvailableShips()).toEqual(["Battleship", "Destroyer", "Submarine", "PatrolBoat"])

		gameboard.setShip("Battleship", [3, 0], "horizontal")
		expect(gameboard.getAvailableShips()).toEqual(["Destroyer", "Submarine", "PatrolBoat"])
	})

	test("Get coordinates from placed ships", () => {
		gameboard.setShip("Carrier", [0, 0], "horizontal")
		gameboard.setShip("Battleship", [3, 0], "horizontal")
		gameboard.setShip("PatrolBoat", [8, 8], "vertical")

		const carrierCoord = gameboard.getShipCoordinates("Carrier")
		const battleshipCoord = gameboard.getShipCoordinates("Battleship")
		const patrolboatCoord = gameboard.getShipCoordinates("PatrolBoat")

		expect(carrierCoord).toEqual([
			[0, 0],
			[0, 1],
			[0, 2],
			[0, 3],
			[0, 4],
		])
		expect(battleshipCoord).toEqual([
			[3, 0],
			[3, 1],
			[3, 2],
			[3, 3],
		])
		expect(patrolboatCoord).toEqual([
			[8, 8],
			[9, 8],
		])
	})

	test("If trying to get coordinates of a ship not placed, return 'Not placed'", () => {
		expect(gameboard.getShipCoordinates("Battleship")).toBe("Not placed in gameboard")
	})
})

/* From T.O.P. -> Gameboards should have a receiveAttack function that takes a pair of coordinates, determines whether or not the attack hit a ship and then sends the ‘hit’ function to the correct ship, or records the coordinates of the missed shot. */

describe("If a gameboard is attacked, check if the coordinates is empty or is there a ship. If there's a ship, ship will get a hit and will check if it's sunk. If there isn't a ship, it records the coordinates of the missed shot", () => {
	test("The attack didn't hit a ship", () => {
		expect(gameboard.receiveAttack([0, 0])).toBe("Missed in [0, 0]")
		expect(gameboard.getGameboard()[0][0]).toBe("Missed")
	})
	test("The attack hit a ship", () => {
		gameboard.setShip("Carrier", [0, 0], "horizontal")
		gameboard.receiveAttack([0, 0])

		expect(gameboard.getGameboard()[0][0]).toBe("Hit")
		expect(gameboard.shipsPlaced["Carrier"].getHits()).toBe(1)
		expect(gameboard.shipsPlaced.Carrier.getIsSunk()).toBe(false)
		expect(gameboard.checkGameOver()).toBe("It's not over yet")
	})

	test("All ships are sunk -> Game Over", () => {
		gameboard.setShip("PatrolBoat", [0, 0], "horizontal")
		gameboard.receiveAttack([0, 0])
		gameboard.receiveAttack([0, 1])

		expect(gameboard.checkGameOver()).toBe("Game over")
	})

	test("Not all the ships are sunk", () => {
		gameboard.setShip("PatrolBoat", [0, 0], "horizontal")
		gameboard.receiveAttack([0, 0])
		gameboard.receiveAttack([0, 1])

		gameboard.setShip("Submarine", [2, 0], "vertical")
		gameboard.receiveAttack([2, 0])

		const shipsPlaced = gameboard.getShipsPlaced()
		const { PatrolBoat, Submarine } = shipsPlaced

		expect(PatrolBoat.getIsSunk()).toBe(true)
		expect(Submarine.getIsSunk()).toBe(false)
		expect(gameboard.checkGameOver()).toBe("It's not over yet")
	})
})
