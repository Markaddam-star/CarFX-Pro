
/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js - FIXED PLAYER-RELATIVE TRAFFIC SYSTEM
 * ============================================================
 */

class TrafficManager {

    constructor(canvas, player = null) {

        this.canvas = canvas;
        this.player = player;

        this.cars = [];

        this.maxCars = 8;
        this.minGap = 260;

        this.spawnInitialCars();
    }

    spawnInitialCars() {

        for (let i = 0; i < this.maxCars; i++) {

            const car = new TrafficCar(this.canvas);

            const lane = Math.floor(Math.random() * 3);

            // spawn relative spacing
            const playerY = this.player?.y || 0;

            car.reset(
                lane,
                playerY - 300 - (i * this.minGap)
            );

            this.cars.push(car);
        }
    }

    update(dt) {

        const player = this.player;
        const playerY = player?.y || 0;

        // =========================
        // 1. UPDATE ALL CARS (AI)
        // =========================

        for (const car of this.cars) {
            car.update(dt, this.cars, player);
        }

        // =========================
        // 2. LANE GROUPING (SAFE)
        // =========================

        const lanes = [[], [], []];

        for (const car of this.cars) {

            if (!car) continue;
            if (car.lane === undefined || car.lane === null) continue;

            const laneIndex = Math.round(car.lane);

            if (laneIndex >= 0 && laneIndex < 3) {
                lanes[laneIndex].push(car);
            }
        }

        // =========================
        // 3. SAFE DISTANCE FIX PER LANE
        // =========================

        for (const laneCars of lanes) {

            laneCars.sort((a, b) => a.y - b.y);

            for (let i = 1; i < laneCars.length; i++) {

                const front = laneCars[i - 1];
                const back = laneCars[i];

                const gap = back.y - (front.y + front.height);

                if (gap < this.minGap) {

                    back.y = front.y + front.height + this.minGap;

                    back.speed = Math.max(back.speed, front.speed);
                }
            }
        }

        // =========================
        // 4. WORLD ANCHORING (IMPORTANT FIX)
        // =========================

        const maxAhead = playerY + 900;
        const maxBehind = playerY - 1200;

        for (const car of this.cars) {

            if (car.y < maxBehind) {
                car.y = maxBehind;
            }

            if (car.y > maxAhead) {
                car.y = maxAhead;
            }
        }
    }

    render(ctx) {

        // draw back to front
        this.cars
            .sort((a, b) => a.y - b.y)
            .forEach(car => car.render(ctx));
    }
}

window.TrafficManager = TrafficManager;
