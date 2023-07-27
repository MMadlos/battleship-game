import "./style.css"
import { Player } from "./modules/player"
import { createGameboard } from "./modules/DOM"

/* Instructions from The Odin Project:

- The game loop should set up a new game by creating Players and Gameboards. For now just populate each Gameboard with predetermined coordinates. You can implement a system for allowing players to place their ships later.

- You should display both the player’s boards and render them using information from the Gameboard class

- You need methods to render the gameboards and to take user input for attacking. For attacks, let the user click on a coordinate in the enemy Gameboard.

[...]

*/

const playerOne = Player("Player 1")
const playerTwo = Player("Computer")

createGameboard()
