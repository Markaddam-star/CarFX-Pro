class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.player();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.lane = 1;

        this.speed = 0;
        this.maxSpeed = 0;

        this.resize();
    }

    resize() {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        // ✅ FIX: always recalc correct position on resize
        this.x =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.y =
            this.canvas.height -
            this.height -
            30;
    }

    update(dt) {
        // reserved for controls
    }

    render(ctx) {

        CarRenderer.draw(ctx, {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.vehicle.color
        });
    }
}

window.PlayerCar = PlayerCar;
