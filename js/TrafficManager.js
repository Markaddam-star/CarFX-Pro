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

        // =========================
        // 1. UPDATE ALL CARS (AI)
        // =========================
        for (const car of this.cars) {
            car.update(dt, this.cars);
        }

        // =========================
        // 2. LANE GROUPING (FIXED)
        // =========================

        const lanes = [[], [], []];

        for (const car of this.cars) {

            // IMPORTANT FIX: always normalize lane index
            const laneIndex = Math.round(car.lane);

            if (laneIndex >= 0 && laneIndex < 3) {
                lanes[laneIndex].push(car);
            }
        }

        // =========================
        // 3. SAFE DISTANCE ENFORCEMENT
        // =========================

        for (const laneCars of lanes) {

            // sort front to back
            laneCars.sort((a, b) => a.y - b.y);

            for (let i = 1; i < laneCars.length; i++) {

                const front = laneCars[i - 1];
                const back = laneCars[i];

                const gap = back.y - (front.y + front.height);

                if (gap < this.minGap) {

                    // push back car safely
                    back.y = front.y + front.height + this.minGap;

                    // match speed smoothly
                    back.speed = Math.max(back.speed, front.speed);
                }
            }
        }
    }

    render(ctx) {

        // =========================
        // 4. DRAW BACK TO FRONT
        // =========================
        this.cars
            .sort((a, b) => a.y - b.y)
            .forEach(car => car.render(ctx));
    }
}

window.TrafficManager = TrafficManager;
