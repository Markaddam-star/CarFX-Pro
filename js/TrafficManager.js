/**
 * ============================================================
 * CarFX Pro Ultimate
 * Traffic Manager v2.0
 * ============================================================
 */

class TrafficManager {

    constructor(canvas, player) {

        this.canvas = canvas;
        this.player = player;

        this.cars = [];

        this.maxCars = 8;
        this.minGap = 220;

        this.spawnInitialCars();

    }

    spawnInitialCars() {

        for (let i = 0; i < this.maxCars; i++) {

            const car = new TrafficCar(this.canvas);

            car.y = -(i * this.minGap);

            // Don't spawn in player's lane too close
            if (
                this.player &&
                car.lane === this.player.lane
            ) {
                car.y -= this.minGap;
            }

            this.cars.push(car);

        }

    }

    update(dt) {

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

                // Prevent overlap with front traffic
                if (front) {

                    const gap =
                        front.y - (car.y + car.height);

                    if (gap < this.minGap) {

                        car.y =
                            front.y -
                            car.height -
                            this.minGap;

                        car.speed = Math.min(
                            car.speed,
                            front.speed
                        );

                    }

                }

                // Prevent overlap with player
                if (
                    this.player &&
                    car.lane === this.player.lane
                ) {

                    const gap =
                        this.player.y -
                        (car.y + car.height);

                    if (
                        gap > 0 &&
                        gap < this.minGap
                    ) {

                        car.y =
                            this.player.y -
                            car.height -
                            this.minGap;

                    }

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
