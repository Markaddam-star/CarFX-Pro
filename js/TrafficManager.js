/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js - SMART GTA TRAFFIC SYSTEM v2.0
 * ============================================================
 */

class TrafficManager {

    constructor(canvas, player = null) {

        this.canvas = canvas;
        this.player = player;

        this.cars = [];


        // =========================
        // TRAFFIC SETTINGS
        // =========================

        this.maxCars = 8;

        this.minGap = 360;

        this.spawnDistance = 900;

        this.respawnDistance = 700;


        // =========================
        // PERFORMANCE
        // =========================

        this.activeRange = 2200;

        this.laneCount = 3;

        this.laneCache = [];


        this.buildLaneCache();


        this.spawnInitialCars();


        console.log(
            "🚗 TrafficManager v2.0 Loaded:",
            this.cars.length
        );

    }



    // =========================================================
    // INITIAL SPAWN
    // =========================================================

    spawnInitialCars() {


        for (
            let i = 0;
            i < this.maxCars;
            i++
        ) {


            const car =
                this.createSafeCar();


            if (!car)
                continue;



            const lane =
                this.getBalancedLane();



            const y =
                200 +
                (i * this.minGap);



            car.reset(
                lane,
                y
            );



            this.cars.push(car);

        }


    }





    // =========================================================
    // CREATE CAR
    // =========================================================

    createSafeCar() {


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


        this.updateLaneCache();



        for (const car of this.cars) {


            // skip far away vehicles

            if (
                Math.abs(car.y) >
                this.activeRange
            ) {

                continue;

            }



            car.update(
                dt,
                this.cars,
                this.player
            );



            this.handleRespawn(
                car
            );


        }


    }






    // =========================================================
    // SAFE RESPAWN
    // =========================================================

    handleRespawn(car) {


        if (
            car.y <
            this.canvas.height +
            this.respawnDistance
        ) {

            return;

        }



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


        let options = [];



        for (
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {


            if (
                this.isLaneClear(
                    lane
                )
            ) {

                options.push(
                    lane
                );

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
    // LANE SAFETY CHECK
    // =========================================================

    isLaneClear(lane) {


        for (const car of this.cars) {


            if (
                Math.round(car.lane)
                !== lane
            )
                continue;



            if (
                Math.abs(car.y)
                <
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


        let lowestLane = 0;

        let lowestCount =
            Infinity;



        for (
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {


            const count =
                this.laneCache[lane]
                .length;



            if (
                count <
                lowestCount
            ) {

                lowestCount = count;

                lowestLane = lane;

            }

        }



        return lowestLane;

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

            this.laneCache[i] = [];

        }


    }





    updateLaneCache() {


        this.buildLaneCache();



        for (const car of this.cars) {


            const lane =
                Math.round(
                    car.lane
                );



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


        // nearest first

        this.cars.sort(
            (a, b) =>
            a.y - b.y
        );



        for (const car of this.cars) {


            car.render(
                ctx
            );


        }


    }






    // =========================================================
    // DEBUG SUPPORT
    // =========================================================

    getTrafficCount() {

        return this.cars.length;

    }


}



window.TrafficManager = TrafficManager;


console.log(
    "✅ TrafficManager v2.0 Loaded Successfully"
);
