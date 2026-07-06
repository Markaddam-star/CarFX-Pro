class PoliceCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.x = canvas.width / 2;
        this.y = canvas.height - 200;

        this.speed = 260;
        this.target = null;
    }

    update(dt, player) {

        if (!player) return;

        const dx = player.x - this.x;
        const dy = player.y - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 800) {
            this.target = player;
        }

        if (this.target) {

            this.x += (this.target.x - this.x) * 2 * dt;
            this.y += (this.target.y - this.y) * 2 * dt;
        }
    }

    render(ctx) {

        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, 60, 120);
    }
}

window.PoliceCar = PoliceCar;
