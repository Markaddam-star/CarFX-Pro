class TrafficManager {

    constructor(canvas, player) {

        this.canvas = canvas;
        this.player = player;

        this.cars = [];

        this.maxCars = 8;
        this.minGap = 260;

        this.spawnInitialCars();

        this.canvas._trafficManager = this;
    }

    spawnInitialCars() {

        for (let i = 0; i < this.maxCars; i++) {

            const car = new TrafficCar(this.canvas, this);

            const lane = this.getSafeLane();

            car.reset(lane, -(i * this.minGap));

            this.cars.push(car);
        }
    }

    getSafeLane() {

        const count = [0, 0, 0];

        for (const c of this.cars) {
            count[c.lane]++;
        }

        const available = [0, 1, 2].filter(l =>
            !this.player || l !== this.player.lane
        );

        let best = available[0];

        for (const l of available) {
            if (count[l] < count[best]) {
                best = l;
            }
        }

        return best;
    }

    update(dt) {

        for (const car of this.cars) {
            car.update(dt);
        }

        const lanes = [[], [], []];

        for (const car of this.cars) {
            lanes[car.lane].push(car);
        }

        for (const laneCars of lanes) {

            laneCars.sort((a, b) => a.y - b.y);

            for (let i = 1; i < laneCars.length; i++) {

                const front = laneCars[i - 1];
                const back = laneCars[i];

                const gap = back.y - (front.y + front.height);

                if (gap < this.minGap) {

                    back.y = front.y + front.height + this.minGap;

                    if (back.speed < front.speed) {
                        back.speed = front.speed;
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
