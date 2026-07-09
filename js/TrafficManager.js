/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.6
 *
 * GTA STYLE SMART TRAFFIC SYSTEM
 *
 * PART 1 / 3
 *
 * Features:
 * - Smart spawning
 * - Player relative traffic
 * - Lane management
 * - TrafficCar v2.6 compatible
 * ============================================================
 */


console.log(
    "🚗 TrafficManager v2.6 START"
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



    this.maxCars = 16;



    // =========================
    // ROAD
    // =========================


    this.laneCount = 3;



    const roadWidth =
        Math.min(
            500,
            canvas.width * 0.5
        );



    this.roadX =
        (
            canvas.width -
            roadWidth
        ) / 2;



    this.laneWidth =
        roadWidth /
        this.laneCount;



    // =========================
    // DISTANCE
    // =========================


    this.spawnAhead = 1200;

    this.spawnBehind = 700;


    this.respawnDistance =
        1800;



    // =========================
    // FLOW
    // =========================


    this.spawnTimer = 0;


    this.spawnInterval =
        0.6;



    this.baseSpeed =
        2.2;



    // =========================
    // AI
    // =========================


    this.laneCache = [];


    this.cacheRefreshTimer =
        0;



    this.buildLaneCache();



    this.spawnInitialCars();



    console.log(
        "🚗 TrafficManager v2.6 Loaded:",
        this.cars.length,
        "cars"
    );


}






// ========================================================
// LANE POSITION
// ========================================================


getLaneX(lane){


    return (
        this.roadX +
        lane *
        this.laneWidth +
        this.laneWidth / 2
    )
    -
    21;


}
    
// ========================================================
// CREATE TRAFFIC CAR
// ========================================================


createTrafficCar(){


    if(
        !window.TrafficCar
    )
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



        if(
            !car
        )
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
                this.player?.y ||
                500
            )
            -
            900 +
            (
                i *
                220
            );



        car.speed =
            1.5 +
            Math.random()*2;



        car.targetSpeed =
            car.speed;



        // lane target

        car.managerLaneX =
            car.x;



        this.cars.push(
            car
        );



    }



    this.updateLaneCache();



}









// ========================================================
// UPDATE
// ========================================================


update(dt){



    if(
        !this.player
    )
        return;



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



        // PLAYER SPEED SYNC

        const playerSpeed =
            this.player.speed || 0;



        if(
            playerSpeed > 0
        ){


            car.targetSpeed +=
                playerSpeed *
                0.003;


        }





        car.update(
            dt,
            this.cars,
            this.player
        );






        // KEEP TRAFFIC RANGE


        if(
            car.y >
            this.player.y +
            this.respawnDistance
        ){


            this.respawnCar(
                car
            );


        }





        if(
            car.y <
            this.player.y -
            1400
        ){


            this.respawnCar(
                car
            );


        }






        // VISIBLE CACHE


        if(
            car.y >
            this.player.y - 1000
            &&
            car.y <
            this.player.y + 1000
        ){


            this.visibleCars.push(
                car
            );


        }



    }







    // AUTO SPAWN


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
// RESPAWN CAR
// ========================================================


respawnCar(car){



    const lane =
        this.findBestLane();



    car.lane =
        lane;



    car.x =
        this.getLaneX(
            lane
        );



    car.managerLaneX =
        car.x;



    car.reset(
        car.x,
        this.player.y -
        1100 -
        Math.random()*500
    );



}









// ========================================================
// SMART TRAFFIC SPAWN
// ========================================================


ensureTraffic(){


    if(
        this.cars.length >=
        this.maxCars
    )
        return;



    const car =
        this.createTrafficCar();



    if(
        !car
    )
        return;




    const lane =
        this.findBestLane();



    car.lane =
        lane;



    car.x =
        this.getLaneX(
            lane
        );



    car.managerLaneX =
        car.x;



    car.y =
        this.player.y -
        this.spawnAhead;



    car.speed =
        1.5 +
        Math.random()*2;



    this.cars.push(
        car
    );



}









// ========================================================
// FIND SAFE LANE
// ========================================================


findBestLane(){


    let bestLane = 0;


    let bestScore =
        Infinity;



    for(
        let lane = 0;
        lane < this.laneCount;
        lane++
    ){


        let score = 0;



        const list =
            this.laneCache[lane] ||
            [];



        for(
            const car of list
        ){


            score +=
                Math.abs(
                    car.y -
                    this.player.y
                );


        }




        if(
            score <
            bestScore
        ){


            bestScore =
                score;


            bestLane =
                lane;


        }



    }



    return bestLane;


}









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


        this.laneCache.push(
            []
        );


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
            .push(
                car
            );


        }


    }


}









// ========================================================
// CRASH EVENT
// ========================================================


onCrashEvent(
    source,
    power = 1
){



    if(
        !source
    )
        return;



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
            distance < 350
        ){


            car.panic =
                true;


            car.panicTimer =
                120;



            car.brakeForce =
                50 * power;



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
    "✅ TrafficManager v2.6 Loaded Successfully"
);
