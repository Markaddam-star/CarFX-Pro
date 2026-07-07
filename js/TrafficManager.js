/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js - STABLE TRAFFIC SYSTEM v1.0
 * ============================================================
 */

class TrafficManager {

    constructor(canvas, player = null) {

        this.canvas = canvas;
        this.player = player;

        this.cars = [];

        this.maxCars = 8;
        this.minGap = 360;

        this.spawnInitialCars();
    }


    spawnInitialCars() {

        for (let i = 0; i < this.maxCars; i++) {

            const car = new TrafficCar(this.canvas);

            const lane = Math.floor(Math.random() * 3);

            car.reset(
                lane,
                200 + (i * this.minGap)
            );

            this.cars.push(car);
        }

        console.log("🚗 Traffic Spawned:", this.cars.length);
    }


    update(dt) {

        for (const car of this.cars) {

            car.update(
                dt,
                this.cars,
                this.player
            );

        }

    }


    render(ctx) {

        this.cars
            .sort((a, b) => a.y - b.y)
            .forEach(car => {

                car.render(ctx);

            });

    }

}


window.TrafficManager = TrafficManager;
