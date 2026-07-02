class TrafficCar {

    constructor(canvas) {
        this.canvas = canvas;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.lane = 0;

        this.reset();
    }

    reset(lane = null, y = null) {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        // lane select
        this.lane = lane !== null
            ? lane
            : Math.floor(Math.random() * 3);

        // new random vehicle
        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // 🚗 X position locked to road lane
        this.x =
            roadX +
            this.lane * laneW +
            (laneW - this.width) / 2;

        // 🌍 WORLD Y POSITION (IMPORTANT FIX)
        this.y =
            y !== null
                ? y
                : (-Math.random() * 800 - this.height);

        // speed
        this.speed = 180 + Math.random() * 220;
    }

    update(dt) {

        // move DOWN in WORLD space
        this.y += this.speed * dt;

        // respawn when out of screen
        if (this.y > this.canvas.height + 250) {
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
