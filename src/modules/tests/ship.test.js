import { Ship } from "../ship"
const ship = Ship("Submarine")

describe("Ship is an object that include their length, number of times they've been hit and wether or not they've been sunk", () => {
	test("it returns its name", () => {
		expect(ship.shipName).toBe("Submarine")
	})

	test("it returns its length", () => {
		expect(ship.getLength()).toBe(3)
	})

	test("it returns hits", () => {
		expect(ship.getHits()).toBe(0)
	})

	test("it returns false when checking if it is sunk", () => {
		expect(ship.getIsSunk()).toBe(false)
	})
})

describe("If the ship receives hits and it gets to the same number of length, the ship sinks", () => {
	test("if it gets hit, the hitsReceived will increase", () => {
		ship.hit()
		expect(ship.getHits()).toBe(1)

		ship.hit()
		expect(ship.getHits()).toBe(2)
		expect(ship.getIsSunk()).toBe(false)

		ship.hit()
		expect(ship.getHits()).toBe(3)
		expect(ship.getIsSunk()).toBe(true)
	})
})

describe("Ships can be placed horizontally or vertically", () => {
	test("default position is 'horizontal", () => {
		expect(ship.getPosition()).toBe("horizontal")
	})
	test("after toggleing position, it change its position", () => {
		ship.togglePosition()
		expect(ship.getPosition()).toBe("vertical")

		ship.togglePosition()
		expect(ship.getPosition()).toBe("horizontal")
	})
})
