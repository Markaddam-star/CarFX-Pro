/**
 * ============================================================
 * CarFX Pro Ultimate
 * Traffic Car v1.0
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.width = 58;
        this.height = 110;

        this.colors = [
            "#1e88e5",
            "#43a047",
            "#fb8c00",
            "#8e24aa",
            "#757575",
            "#fdd835"
        ];

        this.reset();

    }

    reset() {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        this.lane = Math.floor(Math.random() * 3);

        this.x =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.y = -Math.random() * 800 - this.height;

        this.speed = 180 + Math.random() * 220;

        this.color =
            this.colors[
                Math.floor(Math.random() * this.colors.length)
            ];

    }

    update(dt) {

        this.y += this.speed * dt;

        if (this.y > this.canvas.height + 150) {
            this.reset();
        }

    }

    render(ctx) {

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,.3)";
        ctx.fillRect(
            this.x + 5,
            this.y + this.height - 10,
            this.width - 10,
            10
        );

        // Wheels
        ctx.fillStyle = "#111";

        ctx.fillRect(this.x - 4, this.y + 18, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + 18, 8, 20);

        ctx.fillRect(this.x - 4, this.y + 75, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + 75, 8, 20);

        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Glass
        ctx.fillStyle = "#8fd3ff";

        ctx.fillRect(
            this.x + 10,
            this.y + 12,
            this.width - 20,
            25
        );

        ctx.fillRect(
            this.x + 10,
            this.y + 78,
            this.width - 20,
            18
        );

    }

}

window.TrafficCar = TrafficCar;
