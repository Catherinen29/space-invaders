console.log('Take off')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

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
        this.direction = direction
        this.speed = 1

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

        this.xSpeed = 1
        this.ySpeed = 0

        this.invaders = []

        // Set the number of columns in the grid (x)
        const columns = 5
        // Set the number of rows in the grid (y)
        const rows = 3

        this.width = columns * 20

        // Create a new invader for each column and each row
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
            this.invaders.push(new Invader(x * 30, y * 30))
            }
        }
    }
    
    
    update() {
        this.xpos += this.xSpeed

        if ((this.xpos + this.width + 40) >= canvas.width || this.xpos <= 0) {
            console.log('canvas.width', canvas.width)
            console.log('this.xpos', this.xpos)
            console.log('this.width', this.width)
            console.log('this.xspeed', this.xSpeed)
            this.xSpeed = -this.xSpeed 
        }

        this.invaders.forEach((invader) => {
            invader.xpos += this.xSpeed;
        })

    }
}

let grids = [new invaderGrid()]

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

    // invadersArr.forEach(invader => invader.update())
    grids.forEach(grid => {
        grid.update()
        grid.invaders.forEach(invader => {
            invader.update()
        })
    })

    window.requestAnimationFrame(display)
}
window.requestAnimationFrame(display)

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
        break;

    }
})
