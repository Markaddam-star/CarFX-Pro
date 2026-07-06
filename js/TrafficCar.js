/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - AI Version
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        // 🚗 vehicle data
        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // 🧠 AI STATE
        this.state = "cruise";

        this.lane = 0;

        // speed control
        this.speed = 180 + Math.random() * 120;
        this.maxSpeed = 320;
        this.minSpeed = 100;

        this.safeDistance = 140;

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

        // new vehicle each spawn
        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // position
        this.x =
            roadX +
            this.lane * laneW +
            (laneW - this.width) / 2;

        this.y =
            y !== null
                ? y
                : (-Math.random() * 800 - this.height);

        // speed reset
        this.speed = 180 + Math.random() * 140;
    }

    /**
     * 🧠 MAIN AI UPDATE
     */
    update(dt, cars = []) {

        const frontCar = this.getFrontCar(cars);

        // =========================
        // AI DECISION SYSTEM
        // =========================

        if (frontCar) {

            const gap = frontCar.y - this.y;

            // too close → brake
            if (gap < this.safeDistance) {

                this.state = "brake";

                this.speed -= 260 * dt;

            } 
            // safe distance → follow
            else if (gap < this.safeDistance * 2) {

                this.state = "follow";

                this.speed += 40 * dt;

            } 
            // free road → cruise
            else {

                this.state = "cruise";

                this.speed += 80 * dt;
            }

        } else {

            this.state = "cruise";

            this.speed += 100 * dt;
        }

        // =========================
        // SPEED CLAMP
        // =========================

        this.speed = Math.max(
            this.minSpeed,
            Math.min(this.speed, this.maxSpeed)
        );

        // =========================
        // MOVE
        // =========================

        this.y += this.speed * dt;

        // =========================
        // RESPAWN SYSTEM
        // =========================

        if (this.y > this.canvas.height + 300) {
            this.reset();
        }
    }

    /**
     * 🚗 FIND FRONT CAR IN SAME LANE
     */
    getFrontCar(cars) {

        let closest = null;
        let minDist = Infinity;

        for (const car of cars) {

            if (car === this) continue;

            if (car.lane !== this.lane) continue;

            const diff = car.y - this.y;

            if (diff > 0 && diff < minDist) {
                minDist = diff;
                closest = car;
            }
        }

        return closest;
    }

    /**
     * 🎨 RENDER
     */
    render(ctx) {

        CarRenderer.draw(ctx, {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.vehicle.color,
            state: this.state
        });
    }
}

window.TrafficCar = TrafficCar;
