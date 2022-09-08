'use strict';

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    subtract(other) {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    add(other) {
        return new Vector2(this.x + other.x, this.y + other.y);
    }

    multiplyScalar(scalar) {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    normalized() {
        const magnitude = this.magnitude();
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }
}

const onMouseMove = (event) => {
    const point = new Vector2(event.pageX, event.pageY);
    drawBuilding(point);
};

const onTouch = (event) => {
    const point = new Vector2(event?.touches[0]?.pageX, event?.touches[0]?.pageY);
    drawBuilding(point);
}

function drawBuilding(mousePoint) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    const midBase = new Vector2(canvas.width / 2, canvas.height);
    const buildingHalfWidth = 100;
    const buildingBaseHeight = 75;
    const topHeight = 75;
    const buildingHeight = 300;
    const numWindows = 10;
    const windowWidth = buildingHalfWidth * 0.75;
    const windowSectionHeight = buildingHeight / numWindows;

    ctx.fillStyle = '#6B747C';
    const clampedMouse = new Vector2(mousePoint.x, Math.min(mousePoint.y, midBase.y - buildingHeight * 1))
    let buildingDir = clampedMouse.subtract(midBase).normalized();
    let sideDir = new Vector2(-buildingDir.y, buildingDir.x);


    let topPoint = midBase.add(buildingDir.multiplyScalar(buildingHeight));
    let topLeft = topPoint.subtract(sideDir.multiplyScalar(buildingHalfWidth));
    let bottomLeft = new Vector2(midBase.x - buildingHalfWidth, midBase.y);
    let bottomRight = new Vector2(midBase.x + buildingHalfWidth, midBase.y);
    let topRight = topPoint.add(sideDir.multiplyScalar(buildingHalfWidth));
    let tipPoint = midBase.add(buildingDir.multiplyScalar(buildingHeight + topHeight));

    ctx.beginPath();
    ctx.moveTo(bottomLeft.x, bottomLeft.y);
    ctx.lineTo(topLeft.x, topLeft.y);
    ctx.lineTo(tipPoint.x, tipPoint.y);
    ctx.lineTo(topRight.x, topRight.y);
    ctx.lineTo(bottomRight.x, bottomRight.y);
    ctx.closePath();
    ctx.fill();

    for (let floor = 0; floor < numWindows; floor++) {
        let floorTop = midBase.add(buildingDir.multiplyScalar(windowSectionHeight * floor));
        drawWindow(ctx, floorTop.subtract(sideDir.multiplyScalar(windowWidth - 20)), sideDir, buildingDir, windowWidth - 20, windowSectionHeight - 15);
        drawWindow(ctx, floorTop.add(sideDir.multiplyScalar(10)), sideDir, buildingDir, windowWidth - 20, windowSectionHeight - 15);
    }
}

function drawWindow(ctx, topLeft, perpDirection, upDirection, width, height) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(topLeft.x, topLeft.y);
    let topRight = topLeft.add(perpDirection.multiplyScalar(width));
    ctx.lineTo(topRight.x, topRight.y);
    let bottomRight = topRight.add(upDirection.multiplyScalar(-height));
    ctx.lineTo(bottomRight.x, bottomRight.y);
    let bottomLeft = bottomRight.add(perpDirection.multiplyScalar(-width));
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.closePath();
    ctx.fill();
}

window.onload = function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    drawBuilding(new Vector2(window.innerWidth/2, 0))
    let instructions = document.querySelector('#instructions');
    if (screen.orientation !== undefined) {
        // Quick hack to check for desktop
        instructions.textContent = "We've determined you're on a desktop browser. Move the mouse around to check out this needlessly interactive bending cityscape.";
    } else {
        // Quick hack to check for mobile
        instructions.textContent = "We've determined you're on a mobile browser. Tap and drag to check out this needlessly interactive bending cityscape.";
    }
}

window.addEventListener('mousemove', onMouseMove);
window.addEventListener('touchstart', onTouch);
window.addEventListener('touchmove', onTouch);