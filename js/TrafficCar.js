/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v3.0
 *
 * GTA STYLE TRAFFIC AI + SMART CRASH RECOVERY
 *
 * BASE:
 * - TrafficCar v2.9 Stable
 *
 * NEW:
 * - Crash avoidance lock
 * - Safe recovery lane
 * - Anti chain crash system
 * - Player front protection
 *
 * ============================================================
 */


console.log(
    "🚗 TrafficCar v3.0 START"
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


this.isChangingLane =
    false;


this.laneChangeSpeed =
    0.025;



// =========================
// CRASH RECOVERY SYSTEM v3.0
// =========================


this.crashAvoidTimer =
    0;


this.recoveryLock =
    false;


this.lastCrashSide =
    0;


this.safeRecoveryLane =
    lane;


this.chainCrashCooldown =
    0;



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



console.log(
    "🚗 TrafficCar v3.0 Created"
);


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
// TRAFFIC CHECK v3.0
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



            // blocked car -> safe lane

            if(
                this.speed <
                this.baseSpeed * 0.65
                &&
                !this.isChangingLane
            ){

                this.tryLaneChange();

            }


        }


    }


}
// ============================================================
// TRY LANE CHANGE v3.0
// ============================================================

tryLaneChange(){


    if(
        this.isChangingLane
    )
        return;



    let lanes = [
        this.lane - 1,
        this.lane + 1
    ];



    lanes =
    lanes.filter(
        lane =>
        lane >= 0 &&
        lane <= 2
    );



    for(
        const newLane of lanes
    ){


        if(
            this.isLaneSafe(newLane)
        ){


            this.targetLane =
                newLane;



            this.isChangingLane =
                true;



            this.state =
                "changing_lane";



            return;


        }


    }


}


// ============================================================
// CHECK SAFE LANE
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
            car.lane !== targetLane &&
            car.targetLane !== targetLane
        )
            continue;



        const distance =
        Math.abs(
            car.y - this.y
        );



        if(
            distance < 320
        ){

            return false;

        }


    }


    return true;


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
// UPDATE LOOP v3.0
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



    // crash timers

    if(
        this.crashAvoidTimer > 0
    ){

        this.crashAvoidTimer -= dt;

    }


    if(
        this.chainCrashCooldown > 0
    ){

        this.chainCrashCooldown -= dt;

    }



    // panic update

    this.updatePanic(dt);



    // crash state

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
    // MOVEMENT
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




    // lane movement

    this.updateLaneChange();



    // keep away after crash

    this.updateCrashAvoidance(
        player
    );



    // safety

    this.keepStable();



}

// ============================================================
// PANIC SYSTEM v3.0
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
// DRIVE AI v3.0
// BASED ON v2.9 STABLE
// ============================================================

drive(
    traffic,
    player
){


    let targetSpeed =
        this.baseSpeed;



    if(this.damage){

        targetSpeed *= 0.65;

    }



    if(this.panic){

        targetSpeed *= 1.25;

    }



    if(this.brakeForce > 0){


        targetSpeed *= 0.35;


        this.brakeForce -= 1;


        this.brakeLights = true;


    }
    else{


        this.brakeLights = false;


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
// CRASH AVOIDANCE SYSTEM v3.0
// Prevents damaged cars returning in front of player
// ============================================================


updateCrashAvoidance(player){


    if(
        !this.recoveryLock
    )
        return;



    // still recovering after crash

    this.crashAvoidTimer -= 0.016;



    if(
        this.crashAvoidTimer <= 0
    ){

        this.recoveryLock = false;

        this.panic = false;

        this.state =
            "cruise";

    }



    // force side escape

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



    const safeX =
        roadX +
        (
            this.safeRecoveryLane *
            laneWidth
        )
        +
        laneWidth / 2
        -
        this.width / 2;



    this.x +=
    (
        safeX -
        this.x
    )
    *
    0.02;



}



// ============================================================
// SELECT SAFE LANE AFTER CRASH
// ============================================================


selectSafeRecoveryLane(){


    let lanes = [
        0,
        1,
        2
    ];



    // remove current lane

    lanes =
    lanes.filter(
        l =>
        l !== this.lane
    );



    this.safeRecoveryLane =
        lanes[
            Math.floor(
                Math.random() *
                lanes.length
            )
        ];



    this.targetLane =
        this.safeRecoveryLane;



}


// ============================================================
// PLAYER AVOIDANCE AI v3.0
// Keeps traffic away from player vehicle
// ============================================================

avoidPlayer(player){


    if(!player)
        return;



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


        this.panic = true;


        this.panicTimer = 60;



        if(dx > 0){

            this.slideVelocity += 2;

        }
        else{

            this.slideVelocity -= 2;

        }



        // crash recovery protection

        if(
            dy < 100
        ){

            this.selectSafeRecoveryLane();


            this.recoveryLock = true;


            this.crashAvoidTimer = 2;


        }


    }



    this.slideX +=
        this.slideVelocity *
        0.1;



    this.slideVelocity *=
        0.9;



}
// ============================================================
// PLAYER FRONT DANGER CHECK
// ============================================================


isPlayerDangerZone(player){


    if(!player)
        return false;



    const dx =
        Math.abs(
            this.x -
            player.x
        );



    const dy =
        this.y -
        player.y;



    return (

        dx < 80 &&

        dy > -80 &&

        dy < 180

    );


}



// ============================================================
// SAFE PLAYER AVOID AFTER CRASH
// ============================================================


avoidCrashPlayer(player){


    if(
        !player
    )
        return;



    if(
        this.isPlayerDangerZone(player)
    ){

        this.selectSafeRecoveryLane();



        this.recoveryLock = true;


        this.crashAvoidTimer =
            3;


        this.speed *=
            0.7;



    }


}

// ============================================================
// CRASH SYSTEM v3.0
// Smart recovery + anti chain crash
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



    // crash direction

    const side =
        Math.random() > 0.5
        ? 1
        : -1;



    this.lastCrashSide =
        side;



    this.rotationSpeed =
        side *
        (
            0.05 *
            power
        );



    this.slideX =
        side *
        (
            120 *
            power
        );



    this.panic =
        true;



    this.panicTimer =
        180;



    // =========================
    // NEW v3.0
    // =========================


    this.recoveryLock =
        true;



    this.crashAvoidTimer =
        3;



    this.chainCrashCooldown =
        2;



    this.selectSafeRecoveryLane();



}






// ============================================================
// IMPACT PROTECTION
// ============================================================


canReceiveCrash(){


    return (
        this.chainCrashCooldown <= 0
    );


}





// ============================================================
// SMOOTH LANE MOVEMENT v3.0
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
        laneWidth / 2
        -
        this.width / 2;



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


        this.state =
            "cruise";

    }


}


// ============================================================
// KEEP ROAD LIMIT
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
// CRASH UPDATE v3.0
// ============================================================

updateCrash(dt){


    this.speed *=
        0.97;



    this.slideX *=
        0.95;



    this.angle +=
        this.rotationSpeed;



    if(
        Math.abs(
            this.rotationSpeed
        )
        < 0.01
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
            )
            < 0.05
        ){

            this.angle =
                0;


            this.crashed =
                false;


            this.recovering =
                false;

        }


    }


}
// ============================================================
// RENDER SYSTEM v3.0
// ============================================================

draw(ctx){


    if(
        this.destroyed
    )
        return;



    ctx.save();



    ctx.translate(
        this.x + this.width / 2,
        this.y + this.height / 2
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
// ============================================================
// RESET UPDATE
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



    this.recoveryLock =
        false;



    this.crashAvoidTimer =
        0;



    this.chainCrashCooldown =
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
// CLASS END
// ============================================================


}


window.TrafficCar =
    TrafficCar;


console.log(
    "✅ TrafficCar v3.0 Loaded Successfully"
);
