import { Ship } from "./ship"

test("is object", () => {
	expect(typeof Ship(3)).toBe("object")
})
test("should return its properties if we call them", () => {
	expect(Ship(3).length).toBe(3)
	expect(Ship(3).hitsReceived).toBe(0)
	expect(Ship(3).isShipSunk).toBe(false)
})

test("if we call the hit() method, it increases the hitsReceived property from Ship()", () => {
	expect(Ship(3).hit()).toBe(1)
})

describe("It should contain a checkIsSunk() that transform isSunk property into false when the number of hits are equal to its length", () => {
	const ship = Ship(3)

	test("it contains checkIsSunk() function", () => {
		expect(typeof ship.checkIsSunk).toBe("function")
	})
	test("if hitsReceived are not equal to Ship length, it should return false", () => {
		expect(ship.checkIsSunk()).toBe(false)
	})
	test("if hitsReceived is equal to ship length, it should return true", () => {
		ship.hit()
		ship.hit()
		ship.hit()

		expect(ship.checkIsSunk()).toBe(true)
	})
})
