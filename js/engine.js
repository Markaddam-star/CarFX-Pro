update(dt) {

    this.road?.update(dt);
    this.player?.update(dt);

    const SAFE_GAP = 140;

    // Lane wise sorting
    const lanes = [[], [], []];

    for (const car of this.traffic) {
        lanes[car.lane].push(car);
    }

    for (const laneCars of lanes) {

        laneCars.sort((a, b) => a.y - b.y);

        for (let i = 0; i < laneCars.length; i++) {

            const car = laneCars[i];
            const front = laneCars[i + 1];

            car.update(dt);

            if (front) {

                const gap = front.y - (car.y + car.height);

                if (gap < SAFE_GAP) {

                    // Stop overlap
                    car.y = front.y - car.height - SAFE_GAP;

                    // Match speed
                    car.speed = Math.min(car.speed, front.speed);

                }

            }

        }

    }

}
