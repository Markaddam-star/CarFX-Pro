
/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - FULL FIXED AI + PLAYER AWARE VERSION
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        // 🚗 vehicle
        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // 🧠 AI STATE
        this.state = "cruise";

        // lanes
        this.lane = 0;
        this.targetLane = 0;

        // movement
        this.speed = 180 + Math.random() * 120;
        this.maxSpeed = 320;
        this.minSpeed = 100;

        this.safeDistance = 140;

        // lane control
        this.laneChangeCooldown = 0;

        this.reset();
    }

    reset(lane = null, y = null) {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        this.lane = lane !== null
            ? lane
            : Math.floor(Math.random() * 3);

        this.targetLane = this.lane;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.x =
            roadX +
            this.lane * laneW +
            (laneW - this.width) / 2;

        this.y =
            y !== null
                ? y
                : (-Math.random() * 800 - this.height);

        this.speed = 180 + Math.random() * 140;
    }

    /**
     * 🧠 MAIN UPDATE (AI + PLAYER AWARE)
     */
    update(dt, cars = [], player = null) {

        this.laneChangeCooldown -= dt;

        const currentLane = Math.round(this.lane);

        const frontCar = this.getFrontCar(cars, currentLane);

        let needOvertake = false;

        // =========================
        // 1. FRONT CAR CHECK
        // =========================

        if (frontCar) {

            const gap = frontCar.y - this.y;

            if (gap < this.safeDistance) {
                needOvertake = true;
            }
        }

        // =========================
        // 2. PLAYER AWARE LOGIC
        // =========================

        if (player) {

            const playerLane = Math.round(player.lane);
            const verticalDist = player.y - this.y;

            const sameLane = playerLane === currentLane;

            if (sameLane && verticalDist > 0 && verticalDist < this.safeDistance) {

                needOvertake = true;
            }
        }

        // =========================
        // 3. LANE CHANGE DECISION
        // =========================

        if (needOvertake && this.laneChangeCooldown <= 0) {

            const leftSafe = this.isLaneSafe(currentLane - 1, cars);
            const rightSafe = this.isLaneSafe(currentLane + 1, cars);

            if (leftSafe && Math.random() > 0.5) {
                this.targetLane = currentLane - 1;
            }
            else if (rightSafe) {
                this.targetLane = currentLane + 1;
            }

            this.laneChangeCooldown = 2.0;
        }

        // =========================
        // 4. SMOOTH LANE MOVEMENT
        // =========================

        this.lane += (this.targetLane - this.lane) * 6 * dt;

        if (Math.abs(this.lane - this.targetLane) < 0.05) {
            this.lane = this.targetLane;
        }

        // =========================
        // 5. UPDATE X POSITION (IMPORTANT FIX)
        // =========================

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        this.x =
            roadX +
            this.lane * laneW +
            (laneW - this.width) / 2;

        // =========================
        // 6. SPEED CONTROL
        // =========================

        if (frontCar && frontCar.y - this.y < this.safeDistance) {

            this.state = "brake";
            this.speed -= 240 * dt;

        } else {

            this.state = "cruise";
            this.speed += 80 * dt;
        }

        this.speed = Math.max(
            this.minSpeed,
            Math.min(this.speed, this.maxSpeed)
        );

        // =========================
        // 7. MOVE
        // =========================

        this.y += this.speed * dt;

        // =========================
        // 8. RESPAWN
        // =========================

        if (this.y > this.canvas.height + 300) {
            this.reset();
        }
    }

    /**
     * 🚗 FRONT CAR DETECTION (FIXED)
     */
    getFrontCar(cars, lane) {

        let closest = null;
        let minDist = Infinity;

        for (const car of cars) {

            if (car === this) continue;

            if (Math.round(car.lane) !== lane) continue;

            const diff = car.y - this.y;

            if (diff > 0 && diff < minDist) {
                minDist = diff;
                closest = car;
            }
        }

        return closest;
    }

    /**
     * 🛣 LANE SAFETY CHECK (FIXED)
     */
    isLaneSafe(lane, cars) {

        if (lane < 0 || lane > 2) return false;

        for (const car of cars) {

            if (car === this) continue;

            if (Math.round(car.lane) !== lane) continue;

            const dist = Math.abs(car.y - this.y);

            if (dist < this.safeDistance * 1.2) {
                return false;
            }
        }

        return true;
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
