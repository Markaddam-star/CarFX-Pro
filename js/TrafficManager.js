console.log("🚗 TrafficManager v2.3 START");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.3
 * Smart GTA Traffic Controller
 * ============================================================
 */

class TrafficManager {

    constructor(
        canvas,
        player = null,
        particles = null
    ) {

        this.canvas = canvas;
        this.player = player;
        this.particles = particles;

        // =====================================
        // TRAFFIC STORAGE
        // =====================================

        this.cars = [];

        this.visibleCars = [];

        this.laneCache = [];

        // =====================================
        // ROAD SETTINGS
        // =====================================

        this.laneCount = 3;

        this.maxCars = 10;

        this.baseGap = 340;

        this.minGap = 260;

        this.spawnDistance = 1000;

        this.respawnDistance = 800;

        this.activeRange = 2400;

        // =====================================
        // DYNAMIC TRAFFIC
        // =====================================

        this.trafficDensity = 1.0;

        this.spawnTimer = 0;

        this.spawnInterval = 1.2;

        this.maxSpawnAttempts = 8;

        // =====================================
        // PERFORMANCE
        // =====================================

        this.viewportPadding = 500;

        this.cacheRefreshTimer = 0;

        this.cacheRefreshRate = 0.15;

        this.renderSortTimer = 0;

        // =====================================
        // INITIALIZE
        // =====================================

        this.buildLaneCache();

        this.spawnInitialCars();

        console.log(
            "🚗 TrafficManager v2.3 Loaded:",
            this.cars.length,
            "cars"
        );

    }

    // =========================================================
    // INITIAL TRAFFIC
    // =========================================================

    spawnInitialCars() {

        this.cars.length = 0;

        for (
            let i = 0;
            i < this.maxCars;
            i++
        ) {

            const car =
                this.createTrafficCar();

            if (!car)
                continue;

            const lane =
                this.getBalancedLane();

            const y =
                200 +
                (
                    i *
                    this.baseGap
                );

            car.reset(
                lane,
                y
            );

            this.cars.push(car);

        }

        this.updateLaneCache();

    }

    // =========================================================
    // CREATE VEHICLE
    // =========================================================

    createTrafficCar() {

        if (!window.TrafficCar)
            return null;

        return new TrafficCar(
            this.canvas
        );

    }
        // =========================================================
    // UPDATE
    // =========================================================

    update(dt) {

        // refresh lane cache

        this.cacheRefreshTimer -= dt;

        if (
            this.cacheRefreshTimer <= 0
        ) {

            this.cacheRefreshTimer =
                this.cacheRefreshRate;

            this.updateLaneCache();

        }


        // update density

        this.updateTrafficDensity(dt);


        // active vehicles

        this.visibleCars.length = 0;


        for (const car of this.cars) {

    car.update(
        dt,
        this.cars,
        this.player
    );

    this.handleRespawn(car);

    if (
        car.y >= -this.viewportPadding &&
        car.y <= this.canvas.height + this.viewportPadding
    ) {

        this.visibleCars.push(car);

    }

}


        this.spawnTimer -= dt;

        if (
            this.spawnTimer <= 0
        ) {

            this.spawnTimer =
                this.spawnInterval;

            this.trySpawnTraffic();

        }

    }



    // =========================================================
    // DYNAMIC TRAFFIC
    // =========================================================

    updateTrafficDensity(dt) {

        if (!this.player)
            return;

        const ratio =
            this.player.speed /
            this.player.maxSpeed;

        this.trafficDensity =
            0.8 +
            ratio * 0.4;

        this.maxCars =
            Math.round(
                8 +
                this.trafficDensity * 4
            );

    }



    // =========================================================
    // SPAWN NEW TRAFFIC
    // =========================================================

    trySpawnTraffic() {

        if (
            this.cars.length >=
            this.maxCars
        )
            return;

        let attempts = 0;

        while (
            attempts <
            this.maxSpawnAttempts
        ) {

            attempts++;

            const lane =
                this.findSafeSpawnLane();

            const y =
                -this.spawnDistance -
                Math.random() * 500;

            if (
                !this.canSpawnHere(
                    lane,
                    y
                )
            ) {

                continue;

            }

            const car =
                this.createTrafficCar();

            if (!car)
                return;

            car.reset(
                lane,
                y
            );

            this.cars.push(car);

            return;

        }

    }



    // =========================================================
    // RESPAWN
    // =========================================================

    handleRespawn(car) {

        if (

            car.y <=
            this.canvas.height +
            this.respawnDistance

        )
            return;

        const lane =
            this.findSafeSpawnLane();

        const y =
            -this.spawnDistance -
            Math.random() * 600;

        car.reset(
            lane,
            y
        );

    }
        // =========================================================
    // SAFE SPAWN LANE
    // =========================================================

    findSafeSpawnLane() {

        const options = [];

        for (
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {

            if (
                this.isLaneClear(lane)
            ) {

                options.push(lane);

            }

        }

        if (
            options.length === 0
        ) {

            return this.getBalancedLane();

        }

        return options[
            Math.floor(
                Math.random() *
                options.length
            )
        ];

    }



    // =========================================================
    // SPAWN VALIDATION
    // =========================================================

    canSpawnHere(
        lane,
        y
    ) {

        for (const car of this.cars) {

            if (
                Math.round(car.lane) !== lane
            )
                continue;

            if (
                Math.abs(
                    car.y - y
                ) <
                this.baseGap
            ) {

                return false;

            }

        }

        return true;

    }



    // =========================================================
    // LANE SAFETY
    // =========================================================

    isLaneClear(lane) {

        for (const car of this.cars) {

            if (
                Math.round(car.lane) !== lane
            )
                continue;

            if (
                Math.abs(car.y) <
                this.minGap
            ) {

                return false;

            }

        }

        return true;

    }



    // =========================================================
    // BALANCED LANE
    // =========================================================

    getBalancedLane() {

        let bestLane = 0;

        let lowest = Infinity;

        for (
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {

            const count =
                this.laneCache[lane]
                ?.length || 0;

            if (
                count < lowest
            ) {

                lowest = count;

                bestLane = lane;

            }

        }

        return bestLane;

    }



    // =========================================================
    // LANE CACHE
    // =========================================================

    buildLaneCache() {

        this.laneCache = [];

        for (
            let i = 0;
            i < this.laneCount;
            i++
        ) {

            this.laneCache.push([]);

        }

    }



    updateLaneCache() {

        this.buildLaneCache();

        for (const car of this.cars) {

            const lane =
                Math.round(car.lane);

            if (
                this.laneCache[lane]
            ) {

                this.laneCache[lane]
                    .push(car);

            }

        }

    }
        // =========================================================
    // RENDER
    // =========================================================

    render(ctx) {

        // draw far vehicles first

        this.cars.sort(
            (a, b) => a.y - b.y
        );

        for (const car of this.cars) {

            // viewport culling

            if (

                car.y < -this.viewportPadding ||

                car.y >
                this.canvas.height +
                this.viewportPadding

            ) {

                continue;

            }

            car.render(ctx);

        }

    }



    // =========================================================
    // DEBUG
    // =========================================================

    getTrafficCount() {

        return this.cars.length;

    }



    getVisibleTrafficCount() {

        return this.visibleCars.length;

    }



    getLaneTraffic(lane) {

        return this.laneCache[lane]
            ? this.laneCache[lane].length
            : 0;

    }



    clearTraffic() {

        this.cars.length = 0;

        this.visibleCars.length = 0;

        this.buildLaneCache();

    }



    respawnAll() {

        this.clearTraffic();

        this.spawnInitialCars();

    }

}



window.TrafficManager =
    TrafficManager;


console.log(
    "✅ TrafficManager v2.3 Loaded Successfully"
);


// =========================
// ✅ END OF FILE
// =========================
