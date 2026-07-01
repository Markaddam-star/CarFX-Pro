
/**
 * ============================================================
 * CarFX Pro Ultimate
 * Traffic Manager v1.0
 * ============================================================
 */

class TrafficManager {

    constructor(canvas) {

        this.canvas = canvas;
        this.cars = [];

        this.maxCars = 8;
        this.minGap = 220;

        this.spawnInitialCars();

    }

    spawnInitialCars() {

        for (let i = 0; i < this.maxCars; i++) {

            const car = new TrafficCar(this.canvas);

            car.y = -(i * this.minGap);

            this.cars.push(car);

        }

    }

    update(dt) {

        // Sort cars lane-wise
        const lanes = [[], [], []];

        for (const car of this.cars) {
            lanes[car.lane].push(car);
        }

        for (const laneCars of lanes) {

            laneCars.sort((a, b) => a.y - b.y);

            for (let i = 0; i < laneCars.length; i++) {

                const car = laneCars[i];
                const front = laneCars[i + 1];

                car.update(dt);

                if (!front) continue;

                const gap = front.y - (car.y + car.height);

                if (gap < this.minGap) {

                    car.y = front.y - car.height - this.minGap;
                    car.speed = Math.min(car.speed, front.speed);

                }

            }

        }

    }

    render(ctx) {

        for (const car of this.cars) {
            car.render(ctx);
        }

    }

}

window.TrafficManager = TrafficManager;
