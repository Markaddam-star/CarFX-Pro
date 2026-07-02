class PlayerCar {

    constructor(canvas) {
        this.canvas = canvas;

        this.vehicle = VehicleFactory.player();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.lane = 1;

        this.resize();
    }

    resize() {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        this.x = roadX + this.lane * laneW + (laneW - this.width) / 2;
        this.y = this.canvas.height - this.height - 30;
    }

    update(dt) {}

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
