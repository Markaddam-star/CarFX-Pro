/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.4
 * Smart GTA Traffic Controller
 * ============================================================
 *
 * Based on v2.3
 *
 * Added:
 * - Crash event AI
 * - Panic chain reaction
 * - Emergency braking
 * - Traffic chaos response
 * - Better crash recovery support
 *
 * ============================================================
 */

console.log("🚗 TrafficManager v2.4 START");


class TrafficManager {


    constructor(
        canvas,
        player = null,
        particles = null
    ) {


        this.canvas = canvas;

        this.player = player;

        this.particles = particles;



        // ==============================
        // VEHICLES
        // ==============================

        this.cars = [];

        this.visibleCars = [];

        this.laneCache = [];



        // ==============================
        // ROAD
        // ==============================

        this.laneCount = 3;

        this.maxCars = 10;


        this.baseGap = 340;

        this.minGap = 260;


        this.spawnDistance = 1000;

        this.respawnDistance = 800;


        this.activeRange = 2400;



        // ==============================
        // TRAFFIC DENSITY
        // ==============================

        this.trafficDensity = 1.0;


        this.spawnTimer = 0;


        this.spawnInterval = 1.2;


        this.maxSpawnAttempts = 8;



        // ==============================
        // PERFORMANCE
        // ==============================

        this.viewportPadding = 500;


        this.cacheRefreshTimer = 0;


        this.cacheRefreshRate = 0.15;



        // ==============================
        // CRASH AI
        // ==============================

        this.crashCooldown = 0;


        this.panicRadius = 350;


        this.brakeWaveDistance = 180;



        // ==============================
        // INIT
        // ==============================

        this.buildLaneCache();


        this.spawnInitialCars();



        console.log(
            "🚗 TrafficManager v2.4 Loaded:",
            this.cars.length,
            "cars"
        );

    }






    // =========================================================
    // INITIAL TRAFFIC
    // =========================================================

    spawnInitialCars() {


        this.cars.length = 0;


        for(
            let i = 0;
            i < this.maxCars;
            i++
        ) {


            const car =
            this.createTrafficCar();



            if(!car)
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


        if(!window.TrafficCar)
            return null;



        return new TrafficCar(
            this.canvas
        );

    }
        // =========================================================
    // UPDATE LOOP
    // =========================================================

    update(dt) {


        // crash monitoring

        this.handleCrashDetection();



        // panic traffic update

        this.updatePanicTraffic(dt);



        // refresh lane cache

        this.cacheRefreshTimer -= dt;


        if(
            this.cacheRefreshTimer <= 0
        ) {


            this.cacheRefreshTimer =
            this.cacheRefreshRate;


            this.updateLaneCache();

        }




        // dynamic traffic

        this.updateTrafficDensity(dt);




        // visible cars reset

        this.visibleCars.length = 0;




        // update vehicles

        for(
            const car of this.cars
        ) {



            car.update(
                dt,
                this.cars,
                this.player
            );



            this.handleRespawn(car);



            if(
                car.y >=
                -this.viewportPadding &&

                car.y <=
                this.canvas.height +
                this.viewportPadding
            ) {


                this.visibleCars.push(car);


            }


        }




        // spawning

        this.spawnTimer -= dt;



        if(
            this.spawnTimer <= 0
        ) {


            this.spawnTimer =
            this.spawnInterval;


            this.trySpawnTraffic();


        }



    }







    // =========================================================
    // TRAFFIC DENSITY
    // =========================================================

    updateTrafficDensity(dt) {


        if(!this.player)
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
    // SPAWN TRAFFIC
    // =========================================================

    trySpawnTraffic() {


        if(
            this.cars.length >=
            this.maxCars
        )
            return;



        let attempts = 0;



        while(
            attempts <
            this.maxSpawnAttempts
        ) {



            attempts++;



            const lane =
            this.findSafeSpawnLane();



            const y =
            -this.spawnDistance -
            Math.random() * 500;




            if(
                !this.canSpawnHere(
                    lane,
                    y
                )
            ) {

                continue;

            }




            const car =
            this.createTrafficCar();



            if(!car)
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


        if(
            car.y <=
            this.canvas.height +
            this.respawnDistance
        )
            return;




        const lane =
        this.findSafeSpawnLane();



        const y =
        -this.spawnDistance -
        Math.random()*600;




        car.reset(
            lane,
            y
        );



        // reset crash state

        car.__crashReported =
        false;



    }







    // =========================================================
    // SAFE SPAWN
    // =========================================================

    findSafeSpawnLane() {


        const options = [];



        for(
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {



            if(
                this.isLaneClear(lane)
            ) {

                options.push(lane);

            }


        }




        if(
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






    canSpawnHere(
        lane,
        y
    ) {


        for(
            const car of this.cars
        ) {



            if(
                Math.round(car.lane)
                !== lane
            )
                continue;




            if(
                Math.abs(
                    car.y-y
                )
                <
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


        for(
            const car of this.cars
        ) {


            if(
                Math.round(car.lane)
                !== lane
            )
                continue;



            if(
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


        let bestLane = 0;


        let lowest =
        Infinity;



        for(
            let lane = 0;
            lane < this.laneCount;
            lane++
        ) {



            const count =
            this.laneCache[lane]
            ?.length || 0;




            if(
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



        for(
            let i = 0;
            i < this.laneCount;
            i++
        ) {


            this.laneCache.push([]);


        }


    }





    updateLaneCache() {


        this.buildLaneCache();



        for(
            const car of this.cars
        ) {


            const lane =
            Math.round(car.lane);



            if(
                this.laneCache[lane]
            ) {


                this.laneCache[lane]
                .push(car);


            }


        }


    }







    // =========================================================
    // GTA CRASH EVENT SYSTEM
    // =========================================================

    onCrashEvent(
        source,
        power = 1
    ) {



        if(!source)
            return;




        console.log(
            "💥 Traffic Panic Chain",
            source
        );





        for(
            const car of this.cars
        ) {



            if(
                car === source
            )
                continue;




            const distance =
            Math.abs(
                car.y -
                source.y
            );




            if(
                distance <
                this.panicRadius
            ) {



                car.panic = true;



                car.panicTimer =
                180;




                // emergency braking

                if(
                    distance <
                    this.brakeWaveDistance
                ) {


                    car.brakeForce =
                    70;


                }





                // side escape

                const side =
                car.x -
                source.x;



                if(
                    Math.abs(side)
                    < 70
                ) {



                    car.slideX +=
                    side > 0
                    ? 100
                    : -100;


                }


            }


        }





        if(
            this.particles &&
            this.particles.emit
        ) {


            this.particles.emit(
                source.x,
                source.y,
                "crash"
            );


        }


    }







    handleCrashDetection() {


        for(
            const car of this.cars
        ) {



            if(
                car.crashed &&
                !car.__crashReported
            ) {



                car.__crashReported =
                true;



                this.onCrashEvent(
                    car,
                    1
                );


            }



            if(
                !car.crashed
            ) {


                car.__crashReported =
                false;


            }


        }


    }







    updatePanicTraffic(dt) {


        for(
            const car of this.cars
        ) {



            if(
                !car.panic
            )
                continue;




            if(
                car.speed >
                car.baseSpeed * 1.2
            ) {


                car.speed *=
                0.96;


            }




            // random panic movement

            if(
                Math.random()
                <
                0.005
            ) {



                car.slideX +=
                Math.random()
                >
                0.5
                ?
                50
                :
                -50;


            }


        }


    }






    // =========================================================
    // RENDER
    // =========================================================

    render(ctx) {


        this.cars.sort(
            (a,b)=>
            a.y-b.y
        );



        for(
            const car of this.cars
        ) {



            if(

                car.y <
                -this.viewportPadding ||

                car.y >
                this.canvas.height +
                this.viewportPadding

            )
                continue;




            car.render(ctx);


        }


    }







    // =========================================================
    // DEBUG
    // =========================================================

    getTrafficCount(){

        return this.cars.length;

    }



    getVisibleTrafficCount(){

        return this.visibleCars.length;

    }



    clearTraffic(){


        this.cars.length = 0;


        this.visibleCars.length = 0;


        this.buildLaneCache();


    }



    respawnAll(){


        this.clearTraffic();


        this.spawnInitialCars();


    }


}





window.TrafficManager =
TrafficManager;



console.log(
"✅ TrafficManager v2.4 Loaded Successfully"
);


// =========================
// END FILE
// =========================
