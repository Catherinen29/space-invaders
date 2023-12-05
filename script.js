console.log('Take off')

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// Ship
ctx.fillStyle = 'red'

let shipX = 250
ctx.fillRect(shipX, 570, 100, 20) // x, y coords on canvas, width, height

// Animation
function display() {
    // Clear the canvas on each frame
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
    
    // Re-draw the ship on each frame
    ctx.fillStyle = 'red'
    ctx.fillRect(shipX, 570, 100, 20)

    window.requestAnimationFrame(display)
}
window.requestAnimationFrame(display)

// Arrow events
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': 
            if (shipX >= 20) {
                shipX -= 30
            }
        break;

        case 'ArrowRight':
            if (shipX <= 480){
            shipX += 30
        }
    }

})