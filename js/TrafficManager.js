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

            // stagger spawn positions
            car.reset(lane, -(i * this.minGap));

            this.cars.push(car);
        }
    }

    update(dt) {

        // update all cars
        for (const car of this.cars) {
        car.update(dt, this.cars);       
        }

        // lane grouping for safe spacing
        const lanes = [[], [], []];

        for (const car of this.cars) {
            lanes[car.lane].push(car);
        }

        // enforce safe distance per lane
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
    }

    render(ctx) {

        // 🔥 CRITICAL FIX: draw from back to front
        this.cars
            .sort((a, b) => a.y - b.y)
            .forEach(car => car.render(ctx));
    }
}

window.TrafficManager = TrafficManager;
