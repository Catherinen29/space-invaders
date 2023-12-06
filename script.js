console.log('Take off')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Ship
ctx.fillStyle = 'red'
let shipX = 250
let shipY = 570
ctx.fillRect(shipX, shipY, 100, 20) // x, y coords on canvas, width, height

class Bullet {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.width = 20
        this.height = 20
        this.color = 'yellow'
        console.log('CREATED')
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let bullet = new Bullet(shipX + 40, 550);

// Animation
function display() {
    // Clear the canvas on each frame
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    
    // Re-draw the ship on each frame
    ctx.fillStyle = 'red'
    ctx.fillRect(shipX, 570, 100, 20)

    if (bullet) {
        bullet.draw()
    }
    window.requestAnimationFrame(display)
}
window.requestAnimationFrame(display)

// Arrow events
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': 
            if (shipX >= 10) {
                shipX -= 10
                // console.log('shipX left', shipX)
            }
        break;

        case 'ArrowRight':
            if (shipX <= 490){
            shipX += 10
            // console.log('shipX right', shipX)
        }
        break;
    }

})