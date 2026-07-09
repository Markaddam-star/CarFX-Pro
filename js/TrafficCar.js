/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v2.9
 *
 * GTA STYLE TRAFFIC VEHICLE AI
 *
 * BASE:
 * - TrafficCar v2.8 Stable Physics
 *
 * NEW:
 * - Smooth lane switching
 * - Lane 1 -> 2 -> 3 movement
 * - Natural traffic weaving
 * - No teleport lane jump
 *
 * ============================================================
 */


console.log(
    "🚗 TrafficCar v2.9 START"
);



class TrafficCar {


constructor(
    canvas,
    lane = 0,
    speed = 2
){


    this.canvas =
        canvas;



    // =========================
    // POSITION
    // =========================


    this.x =
        lane;


    this.y =
        -150;



    // =========================
    // SIZE
    // =========================


    this.width =
        42;


    this.height =
        82;



    // =========================
    // MOVEMENT
    // =========================


    this.baseSpeed =
        speed || 2;


    this.speed =
        this.baseSpeed;


    this.targetSpeed =
        this.speed;



    this.slideX =
        0;


    this.slideVelocity =
        0;



    // =========================
    // ROTATION
    // =========================


    this.angle =
        0;


    this.rotationSpeed =
        0;



    // =========================
    // LANE SYSTEM
    // =========================


    this.lane =
        lane;


    this.targetLane =
        lane;



    this.managerLaneX =
        null;



    this.isChangingLane =
        false;



    this.laneChangeSpeed =
        0.035;



    this.laneChangeTimer =
        120 +
        Math.random()*240;



    // =========================
    // AI STATE
    // =========================


    this.state =
        "cruise";


    this.followDistance =
        160;



    this.brakeForce =
        0;



    this.panic =
        false;


    this.panicTimer =
        0;



    // =========================
    // DAMAGE
    // =========================


    this.health =
        100;


    this.damage =
        false;


    this.destroyed =
        false;


    this.crashed =
        false;



    this.recovering =
        false;



    // =========================
    // EFFECTS
    // =========================


    this.smokeTimer =
        0;


    this.brakeLights =
        false;



    // =========================
    // STYLE
    // =========================


    this.driverType =
        this.randomDriver();


    this.color =
        this.randomColor();



    this.vehicleType =
        this.randomVehicleType();



    this.__crashReported =
        false;



}
   
// ============================================================
// DRIVER PERSONALITY
// ============================================================

randomDriver(){

    const types = [
        "normal",
        "aggressive",
        "careful",
        "panic"
    ];

    return types[
        Math.floor(
            Math.random() *
            types.length
        )
    ];

}


// ============================================================
// RANDOM COLOR
// ============================================================

randomColor(){

    const colors = [
        "#ff3030",
        "#3080ff",
        "#ffffff",
        "#222222",
        "#ffd000",
        "#00cc88"
    ];

    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];

}


// ============================================================
// RANDOM VEHICLE TYPE
// ============================================================

randomVehicleType(){

    const types = [
        "sedan",
        "sports",
        "suv",
        "van",
        "pickup",
        "taxi",
        "hatchback"
    ];

    return types[
        Math.floor(
            Math.random() *
            types.length
        )
    ];

}


// ============================================================
// UPDATE LOOP
// ============================================================


update(
    dt,
    traffic = [],
    player = null
){


    if(
        this.destroyed
    )
        return;



    this.updatePanic(dt);



    if(
        this.crashed
    ){

        this.updateCrash(dt);

    }
    else{


        this.drive(
            traffic,
            player
        );


    }



    // =========================
    // SMOOTH MOVEMENT
    // =========================


    this.y +=
        this.speed;



    this.x +=
        this.slideX;



    this.slideX *=
        0.94;



    this.angle +=
        this.rotationSpeed;



    this.rotationSpeed *=
        0.96;



    // NEW
    // smooth lane shifting

    this.updateLaneChange();



    this.randomLaneDecision();



    this.keepStable();



}






// ============================================================
// DRIVE AI
// ============================================================


drive(
    traffic,
    player
){



    let targetSpeed =
        this.baseSpeed;



    if(
        this.damage
    )
        targetSpeed *= 0.65;



    if(
        this.panic
    )
        targetSpeed *= 1.25;



    if(
        this.brakeForce > 0
    ){


        targetSpeed *= 0.35;


        this.brakeForce -= 1;


        this.brakeLights =
            true;


    }
    else{


        this.brakeLights =
            false;


    }




    this.speed +=
    (
        targetSpeed -
        this.speed
    )
    *
    0.04;




    this.checkTraffic(
        traffic
    );



    if(player){

        this.avoidPlayer(
            player
        );

    }



}







// ============================================================
// TRAFFIC CHECK
// ============================================================


checkTraffic(cars){


    for(
        const car of cars
    ){


        if(
            car === this
        )
            continue;



        if(
            car.lane !== this.lane
        )
            continue;



        const dx =
            Math.abs(
                this.x -
                car.x
            );



        const dy =
            car.y -
            this.y;



        if(
            dy > 0 &&
            dy < this.followDistance &&
            dx < this.width
        ){


            this.brakeForce =
                20;


            this.state =
                "brake";


            // try lane change

            this.tryLaneChange();


        }


    }


}







// ============================================================
// RANDOM LANE CHANGE
// ============================================================

randomLaneDecision(){


    this.laneChangeTimer--;



    if(
        this.laneChangeTimer <= 0 &&
        !this.isChangingLane
    ){


        // only some drivers change lane

        let chance =
            Math.random();



        if(
            chance < 0.25
        ){

            this.tryLaneChange();

        }



        this.laneChangeTimer =
            300 +
            Math.random()*500;


    }


}







// ============================================================
// SELECT SAFE NEW LANE
// ============================================================

tryLaneChange(){


    let possibleLanes = [
        0,
        1,
        2
    ];


    possibleLanes =
        possibleLanes.filter(
            lane =>
            lane !== this.lane
        );



    // shuffle lanes

    possibleLanes.sort(
        () => Math.random() - 0.5
    );



    for(
        const newLane of possibleLanes
    ){


        if(
            this.isLaneSafe(newLane)
        ){

            this.targetLane =
                newLane;
this.state =
    "changing_lane";

            this.isChangingLane =
                true;


            return;

        }

    }


}




// ============================================================
// CHECK LANE SAFETY
// ============================================================

isLaneSafe(targetLane){


    if(
        !window.carFX ||
        !window.carFX.trafficManager
    )
        return true;



    const cars =
        window.carFX.trafficManager.visibleCars;



    for(
        const car of cars
    ){


        if(
            car === this
        )
            continue;



        if(
            car.lane !== targetLane
        )
            continue;



        const distance =
            Math.abs(
                car.y - this.y
            );



        if(
            distance < 220
        ){

            return false;

        }


    }



    return true;

}


// ============================================================
// SMOOTH LANE MOVEMENT
// ============================================================


updateLaneChange(){


    if(
        !this.isChangingLane
    )
        return;



    const roadWidth =
        Math.min(
            500,
            this.canvas.width * 0.5
        );



    const roadX =
    (
        this.canvas.width -
        roadWidth
    ) / 2;



    const laneWidth =
        roadWidth / 3;



    const targetX =
        roadX +
        (
            this.targetLane *
            laneWidth
        )
        +
        laneWidth/2
        -
        this.width/2;



    this.x +=
    (
        targetX -
        this.x
    )
    *
    this.laneChangeSpeed;




    if(
        Math.abs(
            targetX -
            this.x
        )
        < 2
    ){


        this.x =
            targetX;


        this.lane =
            this.targetLane;


        this.isChangingLane =
            false;


    }



}
// ============================================================
// PLAYER AVOIDANCE
// ============================================================


avoidPlayer(player){


    const dx =
        this.x -
        player.x;


    const dy =
        this.y -
        player.y;



    if(
        Math.abs(dx) < 60 &&
        Math.abs(dy) < 120
    ){


        this.panic =
            true;



        if(dx > 0)
            this.slideVelocity += 2;

        else
            this.slideVelocity -= 2;


    }



    this.slideX +=
        this.slideVelocity *
        0.1;



    this.slideVelocity *=
        0.9;



}







// ============================================================
// PANIC SYSTEM
// ============================================================


updatePanic(dt){


    if(
        this.panicTimer > 0
    ){

        this.panicTimer -= dt;

    }
    else{

        this.panic = false;

    }


}







// ============================================================
// RESET
// ============================================================


reset(
    lane,
    y
){


    this.x =
        lane;


    this.y =
        y;



    this.speed =
        this.baseSpeed;



    this.angle =
        0;



    this.rotationSpeed =
        0;



    this.slideX =
        0;



    this.slideVelocity =
        0;



    this.health =
        100;



    this.damage =
        false;



    this.destroyed =
        false;



    this.crashed =
        false;



    this.recovering =
        false;



    this.panic =
        false;



    this.panicTimer =
        0;



    this.brakeForce =
        0;



    this.brakeLights =
        false;



    this.isChangingLane =
        false;



    this.targetLane =
        lane;



}







// ============================================================
// CRASH
// ============================================================


crash(
    power = 1
){


    if(
        this.crashed
    )
        return;



    this.crashed =
        true;



    this.damage =
        true;



    this.health -=
        power * 40;



    this.speed *=
        0.25;



    this.rotationSpeed =
    (
        Math.random() > 0.5
        ? 1
        : -1
    )
    *
    (
        0.05 *
        power
    );



    this.slideX =
    (
        Math.random() > 0.5
        ? 1
        : -1
    )
    *
    (
        120 *
        power
    );



    this.panic =
        true;



    this.panicTimer =
        180;



}







// ============================================================
// CRASH UPDATE
// ============================================================


updateCrash(dt){


    this.speed *=
        0.97;



    this.slideX *=
        0.95;



    if(
        Math.abs(
            this.rotationSpeed
        ) < 0.01
    ){

        this.recovering =
            true;

    }




    if(
        this.recovering
    ){


        this.angle *=
            0.94;



        if(
            Math.abs(
                this.angle
            ) < 0.05
        ){

            this.angle =
                0;


            this.crashed =
                false;

        }


    }


}







// ============================================================
// ROAD LIMIT
// ============================================================


keepStable(){


    const roadWidth =
        Math.min(
            500,
            this.canvas.width * 0.5
        );



    const roadX =
    (
        this.canvas.width -
        roadWidth
    ) / 2;



    if(
        this.x < roadX
    )
        this.x =
            roadX;



    if(
        this.x >
        roadX +
        roadWidth -
        this.width
    )
        this.x =
            roadX +
            roadWidth -
            this.width;



}







// ============================================================
// RENDER
// ============================================================


draw(ctx){


    if(
        this.destroyed
    )
        return;



    ctx.save();



    ctx.translate(
        this.x +
        this.width/2,

        this.y +
        this.height/2
    );



    ctx.rotate(
        this.angle
    );



    if(
        window.CarRenderer
    ){


        window.CarRenderer.draw(
            ctx,
            {

                x:
                -this.width/2,


                y:
                -this.height/2,


                width:
                this.width,


                height:
                this.height,


                color:
                this.color,


                type:
                this.vehicleType ||
                "sedan",


                headlights:true,


                state:
                this.brakeLights
                ? "brake"
                : "cruise"

            }
        );


    }



    ctx.restore();


}





render(ctx){

    this.draw(ctx);

}


}



window.TrafficCar =
    TrafficCar;



console.log(
    "✅ TrafficCar v2.9 Loaded Successfully"
);
