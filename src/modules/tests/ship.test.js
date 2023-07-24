import { Ship } from "../ship"
const ship = Ship("Submarine")

test("should return its properties if we call them", () => {
	expect(ship.getLength()).toBe(3)
	expect(ship.hitsReceived).toBe(0)
	expect(ship.isSunk).toBe(false)
})

test("if we call the hit() method, it increases the hitsReceived property from Ship()", () => {
	ship.hit()
	expect(ship.getHits()).toBe(1)
})

describe("It should contain a getIsSunk() that transform isSunk property into false when the number of hits are equal to its length", () => {
	test("it contains getIsSunk() function", () => {
		expect(typeof ship.getIsSunk).toBe("function")
	})

	test("if hitsReceived are not equal to Ship length, it should return false", () => {
		expect(ship.getIsSunk()).toBe(false)
	})

	test("if hitsReceived is equal to ship length, it should return true", () => {
		ship.hit()
		ship.hit()

		expect(ship.getIsSunk()).toBe(true)
	})
})

test("it change position when calling changePosition() to vertical", () => {
	expect(ship.getPosition()).toBe("horizontal")

	ship.togglePosition("vertical")
	expect(ship.getPosition()).toBe("vertical")
})
