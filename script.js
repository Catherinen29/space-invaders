console.log('Take off')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Animation Frame ID
let animationId = null

// Start game
const playgame = document.getElementById('playgame')
const endgame = document.getElementById('endgame')
let gameactive = false

let playerLevel = 1

playgame.addEventListener('click', () => {
    // Only run the display function if the game is inactive
    if (!gameactive) {
        gameactive = true
        display()
        console.log('LETS PLAY')
        // If guard clause is not included, the whole loop is triggered every
        // time the playgame button or space bar are pressed & as such, 
        // the invader grid speeds up.

        // Create a new ship at start of game
        ship = new Ship(250, 570)
    }
})

endgame.addEventListener('click', () => {
    if (gameactive == true){
        gameactive = false
        console.log('RESET')
        // window.cancelAnimationFrame(animationId)
        resetGame()
    }
})


// Ship
let ship = null
class Ship {
    constructor(shipX, shipY) {
        this.shipX = shipX
        this.shipY = shipY
        this.shipColor = 'red'
    }

    draw() {
        ctx.fillStyle = this.shipColor
        ctx.fillRect(this.shipX, this.shipY, 100, 20)
    }

    update() {
        this.draw()
    }

}


const explodeButton = document.getElementById('explode')
explodeButton.addEventListener('click', () => {
    // In order:

    // Pause invader grid position
    grids[0].xSpeed = 0
    grids[0].ySpeed = 0


    // Explode ship
    explode()

    // Hide ship at explosion
    ship = null

    // Reset game after 2 seconds
    setTimeout(() => {
        resetGame()
    }, 2000)

    
})
let particles = []

// Ship particles
class shipParticle {
    constructor(x, y, radius, dx, dy) {
        this.x = x
        this.y = y
        this.radius = radius
        // speed: dx & dy
        this.dx = dx
        this.dy = dy
        this.alpha = 1
    }

    draw() {
        // Saves the current state 
        ctx.save()
        // Specifies the transparency
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = 'orange'

        // Begins or resets the path for the arc
        ctx.beginPath()

        // Draw the particle/circle:
        // Create a curve (x, y, start angle, end angle, direction of rotation (false = clockwise))
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 5, false)
        ctx.fill()

        ctx.closePath()

        // Return to the original state
        ctx.restore()
    }

    update() {
        this.draw()
        // Decrease the value/transparency of the particle
        this.alpha -= 0.05
        this.x += this.dx
        this.y += this.dy
    }

}

function explode() {
    
    // ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)

    // Create up to 500 particles with random positioning and 
    // random sizing
    for (i = 0; i <= 500; i++) {
        let dx = Math.random() * 35 - 15
        let dy = Math.random() * 35 - 15
        let radius = Math.random() * 10
        let particle = new shipParticle(ship.shipX + 50, ship.shipY + 30, radius, dx, dy)

        particles.push(particle)
    }
 
    function animateExplosion() {
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)

        particles.forEach((particle, i) => {
            // If transparency is <= 0, remove from particles array
            if (particle.alpha <= 0) {
                particles.splice(i, 1)
            } else {
                particle.update()
            }
        })

        // Animate while particles array > 0
        if (particles.length > 0) {
            requestAnimationFrame(animateExplosion)
        }
    }

    animateExplosion()

    // setTimeout(() => {
    //     particles = []
    //     ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    // }, 5000)
}


 
// Bullets
let bullet = null
let bulletArray = []

class Bullet {
    constructor(xpos, ypos) {
        this.xpos = xpos
        this.ypos = ypos

        this.width = 10
        this.height = 20
        this.color = 'yellow'
        console.log('CREATED')
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.xpos, this.ypos, this.width, this.height)
        // console.log('x: ', this.xpos, 'y: ', this.ypos, 'width: ', this.width, 'height: ', this.height)
    }

    // Update the position of the bullet on the y-axis on each frame
    update() {
        if (this.ypos > 0) {
            this.ypos -= 8
            this.draw()
        } 
        // Remove bullet from array when it leaves the canvas.
        else if (this.ypos < 0) {
            bulletArray.shift()
            // console.log('bulletArray', bulletArray)
        }
        // TO-DO: conditional draw if bullet hits alien.
    }
}



// Invaders

class Invader {
    constructor(xpos, ypos, x, y, direction = 1) {
        this.xpos = xpos
        this.ypos = ypos
        
        // Position of invader within grid
        this.x = x
        this.y = y

// ************
        this.width = 50
        this.height = 50
        // change back to 20
        this.color = 'green'
        this.alive = true
        // this.borderColor = 'pink'
        // this.direction = direction
        // this.speed = 1

        console.log('invader created')

        console.log('invader column', x + 1)
        console.log('invader row', y + 1)
    }
    
    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.xpos, this.ypos, this.width, this.height, this.borderColor)
        // console.log('x: ', this.xpos, 'y: ', this.ypos, 'width: ', this.width, 'height: ', this.height)
    }

    update() {
        // this.xpos += this.speed * this.direction
        this.draw()
    
    }
}

let invader = new Invader(40, 300)

class invaderGrid {
    constructor() {
        this.xpos = 0
        this.ypos = 0

        // Control the direction of movement & speed
        this.xSpeed = playerLevel + 1
        this.ySpeed = 0

        this.invaders = []

        // Set the number of columns in the grid (x)
        this.columns = 5
        // Set the number of rows in the grid (y)
        this.rows = 3

        this.width = this.columns * 20
        this.height = (this.rows * 20) + 40

        // Create a new invader for each column and each row
        for (let x = 0; x < this.columns; x++) {
            for (let y = 0; y < this.rows; y++) {
            // ***************
            this.invaders.push(new Invader(x * 60, y * 60, x, y))
            // change back to * 30
            }
        }
    }
    
    
    update() {
        // From each load, add the speed to the xpos on each frame
        this.xpos += this.xSpeed
        
        // debugger

        // Each time the grid hits the side of the canvas
        if ((this.xpos + this.width + 40) >= canvas.width || this.xpos <= 0) {
            // console.log('this.xpos', this.xpos)
        // Reverse the direction of the movement
            this.xSpeed = -this.xSpeed 
        // Increase the ypos only on the frame which hits the side of the canvas
            this.ySpeed = 30
        } else {
        // During frames where the grid does not hit the edge of the canvas,
        // keep the speed at 0

            this.ySpeed = 0
        }


        // if bottom of grid hits certain height, explode ship
        if (this.invaders[this.invaders.length - 1].ypos >= canvas.height - 400) {
            // grids = []
            ship.shipColor = 'orange'
            explode()
            resetGame()
        }
        

    // Update the invader positions on each frame
        this.invaders.forEach((invader) => {
            invader.xpos += this.xSpeed;
            
            invader.ypos += this.ySpeed
        })

    }
}

let grids = [new invaderGrid()]



// Detect collision between bullet and invader
function collisionDetection() {

    // Loop through invaders 
    for (let i = 0; i < grids[0].invaders.length; i++) {
        // Loop through bullets
        for (let b = 0; b < bulletArray.length; b++) {
            if (grids[0].invaders[i].alive = true && 

                grids[0].invaders[i].xpos < bulletArray[b].xpos && 
                grids[0].invaders[i].xpos + 50 > bulletArray[b].xpos && 
                grids[0].invaders[i].ypos < bulletArray[b].ypos && 
                grids[0].invaders[i].ypos + 50 > bulletArray[b].ypos 
                ) {
                    // COLLISION   
                    console.log('HIT')
                    grids[0].invaders[i].color = 'pink'
                    
                    // Change status of invader
                    grids[0].invaders[i].alive = false

                    // remove bullet from array
            } else {
                // NO COLLISION
                
            }
        }
    }
}


// Re-set the game
function resetGame() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)

    gameactive = false

    // Reset bullets
    bullet = null
    bulletArray = []

    // Clear current ship
    ship = null

    // Reset the starting point of the grid
    grids[0].xpos = 0;
    grids[0].ypos = 0;

    // Set the direction of movement of the grid
    grids[0].xSpeed = playerLevel + 1;
    grids[0].ySpeed = 0;
    
    // Clear grid
    grids[0].invaders = [];

    // Create new grid
    const columns = 5;
    const rows = 3;

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            grids[0].invaders.push(new Invader(x * 30, y * 30));
        }
    }

    console.log('GAME OVER')
}



// Animation

function display() {
    
    // Clear the canvas on each frame
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    
    // Re-draw the ship on each frame
    if (ship) {
        ship.update()
    }

    // Draw a bullet each time the space bar is pressed
    if (bulletArray.length >= 1) {
        bulletArray.forEach(bullet => {
            bullet.update()
        });
    }


    // If the game is active
    if (gameactive) {
        
    // Display the grid of invaders
    grids.forEach(grid => {
        grid.update()
        grid.invaders.forEach(invader => { 
            invader.update()
        })
    })

    collisionDetection()

    // Continue the loop 
    animationId = window.requestAnimationFrame(display)
    }
}



// Arrow events
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': 
            if (ship.shipX >= 10) {
                ship.shipX -= 10
            }
        break;

        case 'ArrowRight':
            if (ship.shipX <= 490){
                ship.shipX += 10
        }
        break;

        case ' ':
            // Add an element to the bulletArray each time the space bar is pressed.
            bulletArray.push(new Bullet(ship.shipX + 40, ship.shipY - 20))
            // debugger
        break;

        case 'ArrowUp':
            console.log('UP',)
        break;
    }
})
