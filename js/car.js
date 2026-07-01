class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.width = 64;
        this.height = 120;

        this.lane = 1;

        // 🎮 GTA STYLE SPRITE
        this.image = new Image();
        this.image.src = "assets/cars/player.png";

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
        // future: steering, nitro, drift
    }

    render(ctx) {

        // 🌫️ shadow (GTA depth)
        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.fillRect(
            this.x + 6,
            this.y + this.height - 12,
            this.width - 12,
            12
        );

        // 🚗 SPRITE MODE
        if (this.image && this.image.complete) {

            ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );

            return;
        }

        // fallback (if image not loaded)
        ctx.fillStyle = "#d40000";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "#fff6a5";
        ctx.fillRect(this.x + 8, this.y + 2, 12, 6);
        ctx.fillRect(this.x + this.width - 20, this.y + 2, 12, 6);
    }
}

window.PlayerCar = PlayerCar;
