# Asteroids game as lab3

## Repository
- **GitHub Repository:** [web2-lab3](https://github.com/LovreMitrovic/web2-lab3)

## Live Application
- **URL:** [https://web2-lab3-gaod.onrender.com/](https://web2-lab3-gaod.onrender.com/)

## Implemented Functionalities
The web application has successfully implemented all the specified mandatory functionalities and some optional ones:

- Display of the game in a canvas covering the entire window with a border.
- Animated background with randomly generated stars.
- Generation of asteroids with random positions and speeds outside the screen at the beginning and during the game.
- Acceptance of parameters: initial number of asteroids, maximum number of asteroids, and interval after which a new asteroid is generated.
- Player control using arrow keys.
- Collision detection.
- Collision sound.
- Measurement and display of time.
- Saving time using the Web Storage API.
- Display of the leaderboard.

## Instructions
Upon visiting the page:
- Enter parameters in text fields. If a parameter is not provided, default values will be used.
- If a parameter is invalid, an error message will be displayed.
- Clicking on "Start" initiates the game.
- Player control is achieved using arrow keys, allowing movement to the edge of the canvas.
- A collision triggers the display of the leaderboard.
- Clicking on "Clear Leaderboard" allows clearing the storage and leaderboard.
- Clicking on "Play Again" redirects the user to the page where they can enter parameters again.
