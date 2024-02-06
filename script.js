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
        // If guard clause is not included, the invader grid speeds up if 
        // the playgame button or space bar are pressed
    }
})

endgame.addEventListener('click', () => {
    // if (gameactive == true){
        gameactive = false
        console.log('GAMEOVER',)
        // window.cancelAnimationFrame(animationId)
        resetGame()
    // }
})


// Ship
ctx.fillStyle = 'red'
let shipX = 250
let shipY = 570
ctx.fillRect(shipX, shipY, 100, 20) // x, y coords on canvas, width, height

// Bullets
let bullet = null
let bulletArray = []


class Bullet {
    constructor(xpos, ypos) {
        this.xpos = xpos
        this.ypos = ypos

        this.width = 20
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
    constructor(xpos, ypos, direction = 1) {
        this.xpos = xpos
        this.ypos = ypos
        

        this.width = 20
        this.height = 20
        this.color = 'green'
        this.borderColor = 'pink'
        // this.direction = direction
        // this.speed = 1

        console.log('invader created',)
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
        const columns = 5
        // Set the number of rows in the grid (y)
        const rows = 3

        this.width = columns * 20
        this.height = (rows * 20) + 40

        // Create a new invader for each column and each row
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
            this.invaders.push(new Invader(x * 30, y * 30))
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


        
        // ********************************

        // TO-DO
        // if bottom of grid hits canvas height, explode ship
        if (this.invaders[this.invaders.length - 1].ypos >= canvas.height - 400) {
            // grids = []
            ctx.fillStyle = 'orange'
            gameactive = false
            resetGame()
        }
        
        // *********************************




    // Update the invader positions on each frame
        this.invaders.forEach((invader) => {
            invader.xpos += this.xSpeed;
            
            invader.ypos += this.ySpeed
        })

    }
}

let grids = [new invaderGrid()]


// Re-set the game
function resetGame() {

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)

    // Reset bullets
    bullet = null
    bulletArray = []

    // Reset ship position
    ctx.fillStyle = 'red'
    shipX = 250
    shipY = 570
    ctx.fillRect(shipX, shipY, 100, 20)


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

}


// Animation

function display() {
    
    // Clear the canvas on each frame
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    
    // Re-draw the ship on each frame
    ctx.fillStyle = 'red'
    ctx.fillRect(shipX, 570, 100, 20)

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

    // Continue the loop 
    animationId = window.requestAnimationFrame(display)
    }
}



// Arrow events
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': 
            if (shipX >= 10) {
                shipX -= 10
            }
        break;

        case 'ArrowRight':
            if (shipX <= 490){
            shipX += 10
        }
        break;

        case ' ':
            // Add an element to the bulletArray each time the space bar is pressed.
            bulletArray.push(new Bullet(shipX + 40, shipY - 20))
            // debugger
        break;

        case 'ArrowUp':
            console.log('UP',)
        break;
    }
})
