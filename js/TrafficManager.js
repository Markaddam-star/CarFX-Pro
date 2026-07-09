/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.5
 *
 * GTA STYLE TRAFFIC SYSTEM
 *
 * FIX:
 * - Infinite negative Y bug
 * - Player relative spawning
 * - Better traffic visibility
 * - Lane assignment fix
 * - Continuous traffic flow
 * - Crash AI compatible
 *
 * PART 1 / 2
 * ============================================================
 */

console.log(
    "🚗 TrafficManager v2.5 START"
);



class TrafficManager {


    constructor(
        canvas,
        player = null,
        particles = null
    ){


        this.canvas = canvas;

        this.player = player;

        this.particles = particles;



        // =========================
        // VEHICLES
        // =========================


        this.cars = [];

        this.visibleCars = [];



        this.maxCars = 12;



        // =========================
        // ROAD
        // =========================


        this.laneCount = 3;


        this.laneWidth =
            canvas.width / 3;



        this.spawnAhead =
            900;


        this.spawnBehind =
            500;



        this.respawnDistance =
            1400;



        // =========================
        // FLOW
        // =========================


        this.spawnTimer = 0;

        this.spawnInterval = 0.8;



        this.baseSpeed = 2;



        // =========================
        // AI
        // =========================


        this.panicRadius = 350;


        this.brakeWaveDistance = 180;



        this.cacheRefreshTimer = 0;



        this.buildLaneCache();



        this.spawnInitialCars();



        console.log(
            "🚗 TrafficManager v2.5 Loaded:",
            this.cars.length,
            "cars"
        );

    }







    // ========================================================
    // LANE POSITION
    // ========================================================


    getLaneX(lane){


        return (

            lane *
            this.laneWidth

        )
        +
        (
            this.laneWidth / 2
        )
        -
        21;


    }








    // ========================================================
    // CREATE CAR
    // ========================================================


    createTrafficCar(){


        if(!window.TrafficCar)
            return null;



        const car =
            new TrafficCar(
                this.canvas,
                0,
                this.baseSpeed
            );


        return car;


    }








    // ========================================================
    // INITIAL SPAWN
    // ========================================================


    spawnInitialCars(){


        this.cars.length = 0;



        for(
            let i = 0;
            i < this.maxCars;
            i++
        ){


            const car =
                this.createTrafficCar();



            if(!car)
                continue;



            const lane =
                i %
                this.laneCount;



            car.lane =
                lane;



            car.x =
                this.getLaneX(
                    lane
                );



           car.y =
(
    this.player?.y || 500
)
-
500
+
(
    i * 180
);



            car.speed =
                1.5 +
                Math.random()*2;



            this.cars.push(car);


        }



        this.updateLaneCache();


    }









    // ========================================================
    // UPDATE
    // ========================================================


   update(dt){


    if(!this.player){

        return;

    }


        this.visibleCars.length = 0;



        this.cacheRefreshTimer -= dt;



        if(
            this.cacheRefreshTimer <= 0
        ){

            this.cacheRefreshTimer =
                0.2;


            this.updateLaneCache();

        }







        for(
            const car of this.cars
        ){



            car.update(
                dt,
                this.cars,
                this.player
            );





            // KEEP TRAFFIC NEAR PLAYER

            if(
                car.y >
                this.player.y +
                this.respawnDistance
            ){

                this.respawnCar(car);

            }




            if(
                car.y <
                this.player.y -
                1200
            ){

                this.respawnCar(car);

            }






            if(

                car.y >
                this.player.y - 900

                &&

                car.y <
                this.player.y + 900

            ){

                this.visibleCars.push(car);

            }



        }






        this.spawnTimer -= dt;



        if(
            this.spawnTimer <= 0
        ){


            this.spawnTimer =
                this.spawnInterval;


            this.ensureTraffic();


        }


    }









    // ========================================================
    // RESPAWN
    // ========================================================


    respawnCar(car){


        const lane =
            Math.floor(
                Math.random() *
                this.laneCount
            );



        car.reset(
            this.getLaneX(lane),
            this.player.y -
            900 -
            Math.random()*500
        );



        car.lane =
            lane;



        car.speed =
            1.5 +
            Math.random()*2;


    }







    // ========================================================
    // KEEP TRAFFIC COUNT
    // ========================================================


    ensureTraffic(){


        if(
            this.cars.length >=
            this.maxCars
        )
            return;



        const car =
            this.createTrafficCar();



        if(!car)
            return;



        const lane =
            Math.floor(
                Math.random() *
                this.laneCount
            );



        car.lane =
            lane;



        car.x =
            this.getLaneX(
                lane
            );



        car.y =
            this.player.y -
            1000;



        this.cars.push(car);



    }
    /**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.5
 *
 * PART 2 / 2
 * ============================================================
 */



    // ========================================================
    // LANE CACHE
    // ========================================================


    buildLaneCache(){


        this.laneCache = [];


        for(
            let i = 0;
            i < this.laneCount;
            i++
        ){

            this.laneCache.push([]);

        }


    }






    updateLaneCache(){


        this.buildLaneCache();



        for(
            const car of this.cars
        ){


            const lane =
                Math.round(
                    car.lane || 0
                );



            if(
                this.laneCache[lane]
            ){

                this.laneCache[lane]
                .push(car);

            }


        }


    }







    // ========================================================
    // CRASH EVENT AI
    // ========================================================


    onCrashEvent(
        source,
        power = 1
    ){



        if(!source)
            return;



        console.log(
            "💥 Traffic Panic Chain v2.5"
        );



        for(
            const car of this.cars
        ){


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
            ){


                car.panic = true;


                car.panicTimer =
                    180;



                if(
                    distance <
                    this.brakeWaveDistance
                ){

                    car.brakeForce =
                        70;

                }



                const side =
                    car.x -
                    source.x;



                if(
                    Math.abs(side)
                    < 80
                ){

                    car.slideX +=
                    side > 0
                    ? 120
                    : -120;

                }



            }



        }



    }







    // ========================================================
    // CRASH MONITOR
    // ========================================================


    handleCrashDetection(){


        for(
            const car of this.cars
        ){


            if(
                car.crashed &&
                !car.__crashReported
            ){


                car.__crashReported =
                    true;



                this.onCrashEvent(
                    car,
                    1
                );


            }



            if(
                !car.crashed
            ){

                car.__crashReported =
                    false;

            }



        }


    }








    // ========================================================
    // RENDER
    // ========================================================


    render(ctx){



        for(
            const car of this.visibleCars
        ){



            car.render(
                ctx
            );



        }



    }







    // ========================================================
    // DEBUG
    // ========================================================


    getTrafficCount(){


        return this.cars.length;


    }



    getVisibleTrafficCount(){


        return this.visibleCars.length;


    }







    clearTraffic(){


        this.cars.length = 0;


        this.visibleCars.length = 0;


    }






    respawnAll(){


        this.clearTraffic();


        this.spawnInitialCars();


    }



}





window.TrafficManager =
    TrafficManager;



console.log(
    "✅ TrafficManager v2.5 Loaded Successfully"
);
