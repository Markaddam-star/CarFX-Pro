/**
 * ============================================================
 * CarFX Pro Ultimate
 * Player Car v2.0
 * ============================================================
 */

class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.width = 64;
        this.height = 120;

        // Player starts in center lane
        this.lane = 1;

        this.resize();

    }

    resize() {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        this.x =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.y =
            this.canvas.height -
            this.height -
            40;

    }

    update(dt) {

        // Future:
        // Steering
        // Nitro
        // Drift

    }

    render(ctx) {

        // Shadow
        ctx.fillStyle = "rgba(0,0,0,.35)";
        ctx.fillRect(
            this.x + 6,
            this.y + this.height - 10,
            this.width - 12,
            14
        );

        // Wheels
        ctx.fillStyle = "#111";

        ctx.fillRect(this.x - 4, this.y + 18, 8, 22);
        ctx.fillRect(this.x + this.width - 4, this.y + 18, 8, 22);

        ctx.fillRect(this.x - 4, this.y + 80, 8, 22);
        ctx.fillRect(this.x + this.width - 4, this.y + 80, 8, 22);

        // Body
        ctx.fillStyle = "#d40000";
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        // Roof
        ctx.fillStyle = "#ff2d2d";
        ctx.fillRect(
            this.x + 8,
            this.y + 18,
            this.width - 16,
            this.height - 36
        );

        // Front Glass
        ctx.fillStyle = "#7fd8ff";
        ctx.fillRect(
            this.x + 12,
            this.y + 12,
            this.width - 24,
            26
        );

        // Rear Glass
        ctx.fillRect(
            this.x + 12,
            this.y + 82,
            this.width - 24,
            20
        );

        // Headlights
        ctx.fillStyle = "#fff6a5";
        ctx.fillRect(this.x + 8, this.y + 2, 12, 6);
        ctx.fillRect(this.x + this.width - 20, this.y + 2, 12, 6);

        // Tail lights
        ctx.fillStyle = "#ff4040";
        ctx.fillRect(this.x + 8, this.y + this.height - 8, 12, 6);
        ctx.fillRect(this.x + this.width - 20, this.y + this.height - 8, 12, 6);

    }

}

window.PlayerCar = PlayerCar;
