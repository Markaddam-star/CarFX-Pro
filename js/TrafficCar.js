class TrafficCar {

    constructor(canvas) {
        this.canvas = canvas;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.lane = Math.floor(Math.random() * 3);

        this.reset();
    }

    reset(lane = null, y = null) {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        this.lane = lane !== null ? lane : Math.floor(Math.random() * 3);

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.x = roadX + this.lane * laneW + (laneW - this.width) / 2;

        this.y = y ?? (-Math.random() * 800 - this.height);

        this.speed = 180 + Math.random() * 220;
    }

    update(dt) {
        this.y += this.speed * dt;

        if (this.y > this.canvas.height + 200) {
            this.reset();
        }
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

window.TrafficCar = TrafficCar;
