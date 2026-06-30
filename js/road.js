
class Road {

    constructor(canvas) {
        this.canvas = canvas;

        this.laneOffset = 0;
        this.speed = 350;

        this.resize();
    }

    resize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.roadWidth = Math.min(500, this.width * 0.5);
        this.x = (this.width - this.roadWidth) / 2;
    }

    update(dt) {
        this.laneOffset += this.speed * dt;

        if (this.laneOffset >= 80) {
            this.laneOffset = 0;
        }
    }

    render(ctx) {

        // Grass / Background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, this.width, this.height);

        // Road
        ctx.fillStyle = "#2b2b2b";
        ctx.fillRect(this.x, 0, this.roadWidth, this.height);

        // Lane Lines
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 6;

        const lane1 = this.x + this.roadWidth / 3;
        const lane2 = this.x + (this.roadWidth / 3) * 2;

        this.drawLane(ctx, lane1);
        this.drawLane(ctx, lane2);
    }

    drawLane(ctx, x) {

        for (let y = -80 + this.laneOffset; y < this.height; y += 80) {

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();

        }

    }

}
