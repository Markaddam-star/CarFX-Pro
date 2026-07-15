/**
 * ============================================================
 * CarFX Pro Ultimate
 *
 * TrafficManager.js v3.1
 *
 * GTA WORLD TRAFFIC STREAMING SYSTEM
 *
 * RESPONSIBILITY:
 *
 * ✔ Vehicle Pool
 * ✔ Spawn System
 * ✔ Respawn System
 * ✔ World Streaming
 * ✔ Density Control
 * ✔ Lane Cache
 * ✔ Visible Sorting
 * ✔ Crash Hooks
 *
 * DOES NOT:
 *
 * ✘ AI Logic
 * ✘ Speed Control
 * ✘ Lane Decisions
 * ✘ Braking
 * ✘ Physics
 *
 * Compatible:
 *
 * ✔ Engine v2.5
 * ✔ PlayerCar v2.2
 * ✔ TrafficCar v3.1
 * ✔ CollisionManager v3.1
 *
 * ============================================================
 */


console.log(
    "🚗 TrafficManager v3.1 CLEAN START"
);



class TrafficManager {



constructor(
    canvas,
    player = null,
    particles = null
){


    this.canvas =
        canvas;


    this.ctx =
        canvas.getContext(
            "2d"
        );



    this.player =
        player;



    this.particles =
        particles;



    // =====================================
    // STATE
    // =====================================

    this.enabled =
        true;



    // =====================================
    // VEHICLE STORAGE
    // =====================================

    this.cars = [];


    this.visibleCars = [];



    // =====================================
    // ROAD CONFIG
    // =====================================

    this.laneCount =
        3;



    this.roadWidth =
        0;


    this.roadX =
        0;


    this.laneWidth =
        0;



    this.updateRoadMetrics();




    // =====================================
    // STREAMING RANGE
    // =====================================

    this.spawnAhead =
        1400;


    this.spawnBehind =
        200;



    this.visibleDistance =
        500;



    this.removeDistance =
        1200;




    // =====================================
    // TRAFFIC DENSITY
    // =====================================

    this.maxCars =
       8;



    this.spawnInterval =
        1.2;



    this.spawnTimer =
        0;



    // =====================================
    // SAFE SPAWN
    // =====================================

    this.safeSpawnDistance =
        700;




    // =====================================
    // LANE CACHE
    // =====================================

    this.laneCars = [];



    for(
        let i = 0;
        i < this.laneCount;
        i++
    ){

        this.laneCars.push([]);

    }



    this.cacheTimer =
        0;


    this.cacheRate =
        0.20;




    // =====================================
    // CREATE INITIAL WORLD
    // =====================================

    this.createInitialTraffic();



    console.log(
        "🚗 TrafficManager v3.1 READY",
        this.cars.length
    );


}






// ============================================================
// ROAD METRICS
// ============================================================


updateRoadMetrics(){


   const width =
    Math.min(
        520,
        this.canvas.width * 0.52
    );


    this.roadWidth =
        width;



    this.roadX =
        (
            this.canvas.width -
            width
        ) / 2;



    this.laneWidth =
        width /
        this.laneCount;


}





// ============================================================
// LANE POSITION
// ============================================================


getLaneX(lane){

    return (
        this.roadX +
        (lane + 0.5) *
        this.laneWidth
    );

}


// ============================================================
// BALANCED LANE SELECTOR
// ============================================================

getBalancedLane(){

    let min =
        Infinity;


    let candidates = [];


    for(
        let i=0;
        i<this.laneCount;
        i++
    ){

        const count =
            this.laneCars[i].length;


        if(count < min){

            min=count;
            candidates=[
                i
            ];

        }
        else if(
            count===min
        ){

            candidates.push(i);

        }

    }


    return candidates[
        Math.floor(
            Math.random() *
            candidates.length
        )
    ];

}




// ============================================================
// CREATE CAR
// ============================================================


createCar(){

    if(
        typeof TrafficCar !== "function"
    ){

        console.warn(
            "⚠️ TrafficCar missing"
        );

        return null;

    }


    const car =
        new TrafficCar(
            this.canvas,
            0,
            this.laneCount
        );


    return car;

}






// ============================================================
// INITIAL TRAFFIC
// ============================================================


createInitialTraffic(){

    this.cars.length = 0;


    const startCars = 3;


    for(
        let i = 0;
        i < startCars;
        i++
    ){

        const car =
            this.spawnTrafficCar();

        if(car)
            this.cars.push(car);

    }


    this.rebuildLaneCache();

}

// ============================================================
// UPDATE TRAFFIC WORLD
// ============================================================

update(dt){


    if(!this.enabled)
        return;



    if(!this.player)
        return;



    const playerY =
        this.player.y;



    // =====================================
    // UPDATE ALL TRAFFIC VEHICLES
    // TrafficCar controls AI
    // =====================================

    for(
        let i = this.cars.length - 1;
        i >= 0;
        i--
    ){


        const car =
            this.cars[i];

// =====================================
// TRAFFIC LANE SAFETY CLAMP
// =====================================

car.lane = Math.max(
    0,
    Math.min(
        this.laneCount - 1,
        Number.isFinite(car.lane)
        ? Math.floor(car.lane)
        : 0
    )
);

        if(!car){

            this.cars.splice(
                i,
                1
            );

            continue;

        }




        if(
            car.update
        ){

            car.update(dt);

        }




        // remove destroyed cars

        if(
            car.destroyed ||
            car.remove
        ){

            this.removeCar(i);

            continue;

        }





        // =================================
        // WORLD STREAM CLEANUP
        // =================================

        const distance =
            Math.abs(
                car.y -
                playerY
            );



        if(
            distance >
            this.removeDistance
        ){

            this.removeCar(i);

        }


    }





    // =====================================
    // KEEP TRAFFIC COUNT
    // =====================================

    this.maintainTraffic();





    // =====================================
    // UPDATE LANE CACHE
    // =====================================

    this.cacheTimer += dt;



    if(
        this.cacheTimer >=
        this.cacheRate
    ){

        this.rebuildLaneCache();

        this.cacheTimer = 0;

    }



}





// ============================================================
// MAINTAIN POPULATION
// ============================================================

maintainTraffic(){


    while(
        this.cars.length <
        this.maxCars
    ){


        const car =
            this.spawnTrafficCar();



        if(!car)
            break;



        this.cars.push(car);



    }


}





// ============================================================
// SPAWN TRAFFIC CAR
// ============================================================

spawnTrafficCar(){

    if(
        typeof TrafficCar !== "function"
    )
        return null;


    const playerY =
        this.player ?
        this.player.y :
        0;


const direction =
    Math.random() > 0.5 ? 1 : -1;


const offset =
    direction *
    (
        this.safeSpawnDistance +
        Math.random() *
        (
            this.spawnAhead -
            this.safeSpawnDistance
        )
    );



    // ============================
    // LANE SELECT
    // ============================

    const lane =
        this.getBalancedLane();



    // ============================
    // POSITION
    // ============================

    const y =
        playerY +
        offset;



    const x =
        this.getLaneX(
            lane
        );



    // ============================
    // CREATE CAR
    // ============================

    const car =
        new TrafficCar(
            this.canvas,
            x,
            this.laneCount
        );


    if(!car)
        return null;



    // ============================
    // FINAL LANE LOCK
    // ============================

    const safeLane =
    Math.max(
        0,
        Math.min(
            this.laneCount - 1,
            Number(lane)
        )
    );


    car.lane =
        safeLane;


    car.targetLane =
        safeLane;



    // ============================
    // POSITION FROM LANE
    // ============================

    const finalLaneX =
    this.getLaneX(
        safeLane
    );


car.x =
finalLaneX - car.width / 2;


    car.baseX =
        finalLaneX;


    car.targetX =
        finalLaneX;


    car.y =
        y;



    // ============================
    // ROAD DATA
    // ============================

    car.roadX =
        this.roadX;


    car.roadWidth =
        this.roadWidth;


    car.laneWidth =
        this.laneWidth;



    car.manager =
        this;



    return car;

}

// ============================================================
// REMOVE VEHICLE
// ============================================================

removeCar(index){


    const car =
        this.cars[index];



    if(!car)
        return;




    if(
        car.destroy
    ){

        car.destroy();

    }




    this.cars.splice(
        index,
        1
    );


}





// ============================================================
// LANE CACHE BUILDER
// ============================================================

rebuildLaneCache(){


    for(
        let i = 0;
        i < this.laneCount;
        i++
    ){

        this.laneCars[i].length = 0;

    }





    for(
        const car of this.cars
    ){


        if(
            !car ||
            car.destroyed ||
            car.crashed
        )
            continue;




        let lane =
Number.isFinite(car.lane)
?
Math.round(car.lane)
:
0;


lane =
Math.max(
    0,
    Math.min(
        this.laneCount - 1,
        lane
    )
);


        lane =
        Math.max(
            0,
            Math.min(
                this.laneCount - 1,
                lane
            )
        );



        this.laneCars[lane].push(
            car
        );


    }



}





// ============================================================
// GET ALL ACTIVE CARS
// ============================================================

getCars(){

    return this.cars;

}
// ============================================================
// BUILD VISIBLE VEHICLES
// ============================================================

updateVisibleCars(){


    this.visibleCars.length = 0;



    if(!this.player)
        return;



    const playerY =
        this.player.y;



    for(
        const car of this.cars
    ){


        if(
            !car ||
            car.destroyed
        )
            continue;



        const distance =
            Math.abs(
                car.y -
                playerY
            );



        if(
            distance <=
            this.visibleDistance
        ){

            this.visibleCars.push(
                car
            );

        }


    }



}






// ============================================================
// RENDER TRAFFIC
// ============================================================

render(ctx){


    if(!this.enabled)
        return;



    if(!ctx)
        return;



    this.updateVisibleCars();




    // FAR TO NEAR DEPTH ORDER

    this.visibleCars.sort(
        (a,b)=>{

            return a.y - b.y;

        }
    );





   for(
 const car of this.visibleCars
){

    if(
        !car ||
        car.destroyed
    )
        continue;


    car.lane = Math.max(
        0,
        Math.min(
            this.laneCount - 1,
            Number.isFinite(car.lane)
            ? Math.floor(car.lane)
            : 0
        )
    );


    if(car.render){
        car.render(ctx);
    }

}



}






// ============================================================
// RESIZE
// ============================================================

resize(canvas){

    if(!canvas)
        return;


    this.canvas = canvas;


    this.ctx =
        canvas.getContext(
            "2d"
        );


    this.updateRoadMetrics();



    // ============================
    // RECALCULATE TRAFFIC LANES
    // ============================

    for(
        const car of this.cars
    ){

        if(!car)
            continue;

if(
 Number.isInteger(car.lane) &&
 car.lane >=0 &&
 car.lane < this.laneCount
)

        {

            const newX =
                this.getLaneX(
                    car.lane
                );


            car.x =
                newX;


            car.baseX =
                newX;


            car.targetX =
                newX;

        }


        car.roadX =
            this.roadX;


        car.roadWidth =
            this.roadWidth;


        car.laneWidth =
            this.laneWidth;

    }


}

// ============================================================
// CLEAR ALL TRAFFIC
// ============================================================

clear(){


    for(
        const car of this.cars
    ){


        if(
            car &&
            car.destroy
        ){

            car.destroy();

        }


    }



    this.cars.length = 0;



    this.visibleCars.length = 0;



    this.rebuildLaneCache();



}






// ============================================================
// ENABLE / DISABLE
// ============================================================

setEnabled(
    state
){


    this.enabled =
        state;


}






// ============================================================
// CRASH EVENT RECEIVER
// CollisionManager ONLY REPORTS
// ============================================================

onCrashEvent(
    carA,
    carB
){


    console.log(
        "💥 Traffic crash event",
        carA,
        carB
    );



    /*
        Future:

        - Wanted System
        - Camera Shake
        - Statistics
        - Police Trigger

    */


}






// ============================================================
// DEBUG
// ============================================================

debug(){


    return {


        totalCars:
            this.cars.length,


        visibleCars:
            this.visibleCars.length,


        laneUsage:
            this.laneCars.map(
                lane =>
                lane.length
            ),


        enabled:
            this.enabled


    };


}





// ============================================================
// END
// ============================================================

}



window.TrafficManager =
    TrafficManager;



console.log(
    "🚗 TrafficManager v3.1 CLEAN FINAL LOADED"
);
