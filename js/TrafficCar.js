/**
 * ============================================================
 * CarFX Pro Ultimate
 *
 * TrafficCar.js v3.1 CLEAN FINAL
 *
 * GTA STYLE TRAFFIC AI
 *
 * RESPONSIBILITY:
 *
 * ✔ Vehicle Movement
 * ✔ Speed AI
 * ✔ Lane Behaviour
 * ✔ Following System
 * ✔ Panic Reaction
 * ✔ Crash Recovery
 * ✔ Damage Foundation
 *
 * Compatible:
 *
 * ✔ TrafficManager v3.0
 * ✔ CollisionManager v3.0
 * ✔ Engine v2.5
 *
 * ============================================================
 */


console.log(
    "🚙 TrafficCar v3.1 CLEAN START"
);



class TrafficCar {


constructor(
    canvas,
    x = 0,
    laneCount = 3
){


    this.canvas =
        canvas;


    // =========================
    // POSITION
    // =========================

    this.x =
        x;


    this.y =
        0;



    // =========================
    // SIZE
    // =========================

    this.width =
        42;


    this.height =
        80;



    // =========================
    // LANE SYSTEM
    // =========================

    this.lane =
        0;


    this.targetLane =
        0;


    this.laneCount =
        laneCount;


    this.laneChanging =
        false;


    this.laneProgress =
        0;



    // =========================
    // SPEED SYSTEM
    // =========================

    this.baseSpeed =
      1.6;


    this.speed =
        this.baseSpeed;


    this.targetSpeed =
        this.baseSpeed;


    this.maxSpeed =
        2.2;


    this.minSpeed =
        0;


    this.acceleration =
        0.006;


    this.brakePower =
        0.03;



    // =========================
    // FOLLOW AI
    // =========================

    this.leadCar =
        null;


    this.followDistance =
        180;


    this.safeDistance =
        120;



    // =========================
    // AI STATE
    // =========================

    this.state =
        "CRUISE";


    this.aiTimer =
        0;


    this.decisionRate =
        0.8;



    // =========================
    // PLAYER AVOIDANCE
    // =========================

    this.playerNear =
        false;



    // =========================
    // DAMAGE / CRASH
    // =========================

    this.crashed =
        false;


    this.destroyed =
        false;


    this.remove =
        false;


    this.damage =
        0;


    this.crashTimer =
        0;


    this.crashDirection =
        null;



    // =========================
    // PANIC
    // =========================

    this.panicTimer =
        0;



    // =========================
    // VISUAL
    // =========================

    this.rotation =
        0;


    this.manager =
        null;

// =========================
// VISUAL
// =========================

this.rotation =
    0;


this.manager =
    null;


// =========================
// CAR VARIATION
// =========================

this.type =
[
    "sedan",
    "sports",
    "suv",
    "van",
    "taxi",
    "pickup",
    "hatchback"
][
    Math.floor(
        Math.random() * 7
    )
];


this.color =
[
    "#e63946",
    "#219ebc",
    "#ffb703",
    "#8338ec",
    "#06d6a0",
    "#ffffff",
    "#333333"
][
    Math.floor(
        Math.random() * 7
    )
];

// =========================
// GTA STYLE RANDOM VEHICLE
// =========================

const vehicleTypes = [

    "sedan",
    "sedan",
    "sedan",
    "sports",
    "suv",
    "van",
    "pickup",
    "taxi",
    "hatchback"

];


const vehicleColors = [

    "#e74c3c", // red
    "#3498db", // blue
    "#2ecc71", // green
    "#f1c40f", // yellow
    "#9b59b6", // purple
    "#ecf0f1", // white
    "#34495e", // dark
    "#111111", // black
    "#95a5a6"  // grey

];



this.type =
    vehicleTypes[
        Math.floor(
            Math.random() *
            vehicleTypes.length
        )
    ];



this.color =
    vehicleColors[
        Math.floor(
            Math.random() *
            vehicleColors.length
        )
    ];



this.headlights =
    Math.random() > 0.25;



this.wheelSize =
    7 +
    Math.random() * 5;



this.spoiler =
    (
        this.type === "sports"
        &&
        Math.random() > 0.4
    );


}
// ============================================================
// MAIN UPDATE PIPELINE
// ============================================================

update(dt){

    if(this.destroyed)
        return;


    // ============================
    // HARD LANE SAFETY
    // ============================

    this.lane = Math.max(
        0,
        Math.min(
            this.laneCount - 1,
            Number.isFinite(this.lane)
            ? Math.floor(this.lane)
            : 0
        )
    );


    this.targetLane = Math.max(
        0,
        Math.min(
            this.laneCount - 1,
            Number.isFinite(this.targetLane)
            ? Math.floor(this.targetLane)
            : this.lane
        )
    );


    // CRASH MODE


    if(this.destroyed)
        return;



    // =========================
    // CRASH MODE
    // =========================

    if(this.crashed){

        this.updateCrash(dt);

        return;

    }



    // =========================
    // PANIC
    // =========================

    this.updatePanic(dt);



    // =========================
    // AI TIMER
    // =========================

    this.aiTimer += dt;



    // =========================
    // PLAYER DETECTION
    // =========================

    this.detectPlayer();



    // =========================
    // DECISION MAKING
    // =========================

    if(
        this.aiTimer >=
        this.decisionRate
    ){


        if(this.playerNear){

            this.findSafeLane();

        }


        this.aiTimer = 0;

    }



    // =========================
    // FOLLOW TRAFFIC
    // =========================

    this.findLeadCar();



    // =========================
    // SPEED CONTROL
    // =========================

    this.updateSpeedAI(dt);



    // =========================
    // LANE MOVEMENT
    // =========================

    this.updateLane(dt);



    // =========================
    // VISUAL ROTATION
    // =========================

    this.updateRotation();



    // =========================
    // MOVE VEHICLE
    // =========================

    this.move(dt);


}




// ============================================================
// VEHICLE MOVEMENT
// ============================================================


move(dt){

    const player =
        this.manager?.player;


    // FIXED TRAFFIC SPEED
    this.y +=
        this.speed *
        dt *
        60;



    // jab player se bohat door ho jaye
    if(
        player &&
        this.y > player.y + 1000
    ){

        this.y =
        player.y - 1500;

    }


    if(
        player &&
        this.y < player.y - 1500
    ){

        this.y =
        player.y + 1000;

    }

}



// ============================================================
// SPEED AI
// ============================================================

updateSpeedAI(dt){


   let desiredSpeed = this.baseSpeed;



    // FOLLOW VEHICLE

    if(this.leadCar){


        const gap =
            this.leadCar.y -
            this.y;



        if(
            gap <
            this.safeDistance
        ){


            desiredSpeed =
                this.leadCar.speed *
                0.85;


        }
        else if(
            gap <
            this.followDistance
        ){


            desiredSpeed =
                this.leadCar.speed;


        }


    }



    this.targetSpeed =
        Math.max(
            this.minSpeed,
            Math.min(
                this.maxSpeed,
                desiredSpeed
            )
        );




    // ACCELERATION

    if(
        this.speed <
        this.targetSpeed
    ){


        this.speed +=
            this.acceleration *
            dt *
            60;


    }



    // BRAKING

    else if(
        this.speed >
        this.targetSpeed
    ){


        this.speed -=
            this.brakePower *
            dt *
            60;


    }




    this.speed =
        Math.max(
            this.minSpeed,
            Math.min(
                this.maxSpeed,
                this.speed
            )
        );


}
// ============================================================
// FIND LEAD VEHICLE
// ============================================================

findLeadCar(){


    this.leadCar =
        null;



    if(!this.manager)
        return;



    let cars =
        [];



    const lane =
        Math.round(
            this.lane
        );



    if(
        this.manager.laneCars &&
        this.manager.laneCars[lane]
    ){

        cars =
            this.manager.laneCars[lane];

    }
    else if(
        this.manager.getCars
    ){

        cars =
            this.manager.getCars();

    }



    let closest =
        Infinity;



    for(
        const car of cars
    ){


        if(
            !car ||
            car === this ||
            car.destroyed ||
            car.crashed
        )
            continue;



        if(
            Math.round(car.lane)
            !== lane
        )
            continue;



        const distance =
            car.y -
            this.y;



        if(
            distance > 0 &&
            distance < closest
        ){

            closest =
                distance;


            this.leadCar =
                car;

        }


    }


}





// ============================================================
// PLAYER DETECTION
// ============================================================


detectPlayer(){

    this.playerNear = false;


    if(!this.manager)
        return;


    const player =
        this.manager.player;


    if(!player)
        return;



    const distance =
        player.y - this.y;



    const playerLane =
        Math.floor(
            (
                player.x -
                this.manager.roadX
            )
            /
            this.manager.laneWidth
        );



    // player same lane aur paas hai

  if(
    distance > -50 &&
    distance < 350 &&
    playerLane === Math.round(this.lane)
){

        this.playerNear = true;

        this.playerDangerLane =
            playerLane;

    }

}



// ============================================================
// CHECK LANE SAFETY
// ============================================================

isLaneSafe(targetLane){

    if(!this.manager)
        return false;


    const player =
        this.manager.player;


    if(player){

        const playerLane =
        Math.floor(
            (
                player.x -
                this.manager.roadX
            )
            /
            this.manager.laneWidth
        );


        const gap =
            player.y - this.y;


        // player ke aagay ya bilkul paas wali lane block
        if(
            playerLane === targetLane &&
            gap > -120 &&
            gap < 350
        ){

            return false;

        }

    }


    return true;

}





// ============================================================
// FIND SAFE LANE
// ============================================================

findSafeLane(){

    let options = [];


    for(
        let i = 0;
        i < this.laneCount;
        i++
    ){

        // current lane skip
        if(i === Math.round(this.lane))
            continue;


        // safety check
        if(
            this.isLaneSafe(i)
        ){

            options.push(i);

        }

    }


    if(
        options.length === 0
    )
        return;


    const target =
        options[
            Math.floor(
                Math.random() *
                options.length
            )
        ];


    this.startLaneChange(target);

}


// ============================================================
// START LANE CHANGE
// ============================================================

startLaneChange(target){


    target =
    Math.max(
        0,
        Math.min(
            this.laneCount - 1,
            Number(target) || 0
        )
    );


    if(
        this.laneChanging
    )
        return;


    this.targetLane =
        target;


    this.laneChanging =
        true;


    this.laneProgress =
        0;

}


// ============================================================
// UPDATE LANE CHANGE
// ============================================================

updateLane(dt){

    if(!this.laneChanging)
        return;


    this.laneProgress +=
        dt * 2;


    if(this.laneProgress >= 1){

        this.laneProgress = 1;

        this.lane =
            this.targetLane;

        this.laneChanging = false;

    }


    if(this.manager){


        const currentX =
            this.manager.getLaneX(this.lane)
            - this.width / 2;


        const targetX =
            this.manager.getLaneX(this.targetLane)
            - this.width / 2;


        this.x =
            currentX +
            (
                targetX - currentX
            )
            *
            this.laneProgress;

    }

}

// ============================================================
// CRASH SYSTEM
// ============================================================

crash(direction="front"){


    if(this.crashed)
        return;



    this.crashed =
        true;



    this.state =
        "CRASHED";



    this.crashDirection =
        direction;



    this.crashTimer =
        0;



    this.targetSpeed =
        0;



    this.speed *=
        0.35;



    console.log(
        "💥 TrafficCar crash",
        direction
    );


}





// ============================================================
// CRASH UPDATE
// ============================================================

updateCrash(dt){


    this.crashTimer += dt;



    this.speed *=
        0.96;



    if(
        this.speed < 0.05
    ){

        this.speed = 0;

    }



    if(
        this.crashTimer > 2.5
    ){

        this.recoverFromCrash();

    }


}





// ============================================================
// RECOVER
// ============================================================

recoverFromCrash(){


    this.crashed =
        false;



    this.state =
        "CRUISE";



    this.speed =
        this.baseSpeed;



    this.targetSpeed =
        this.baseSpeed;



    this.crashTimer =
        0;


}





// ============================================================
// PANIC SYSTEM
// ============================================================

panic(){


    if(this.crashed)
        return;



    this.state =
        "PANIC";



    this.panicTimer =
        1.5;



    this.targetSpeed =
        this.maxSpeed *
        0.5;


}





// ============================================================
// PANIC UPDATE
// ============================================================

updatePanic(dt){


    if(
        !this.panicTimer ||
        this.panicTimer <= 0
    )
        return;



    this.panicTimer -= dt;



    if(
        this.panicTimer <= 0
    ){


        this.state =
            "CRUISE";


        this.targetSpeed =
            this.baseSpeed;


    }


}





// ============================================================
// DAMAGE
// ============================================================

applyDamage(amount=10){


    this.damage +=
        amount;



    if(
        this.damage >= 100
    ){

        this.crash(
            "destroyed"
        );

    }


}





// ============================================================
// DAMAGE STATE
// ============================================================

getDamageState(){


    if(
        this.damage >= 80
    )
        return "heavy";



    if(
        this.damage >= 40
    )
        return "medium";



    return "light";


}





// ============================================================
// ROTATION
// ============================================================

updateRotation(){


    if(
        this.laneChanging
    ){


        this.rotation *= 0.9;


    }
    else{


        this.rotation *= 0.85;


    }


}





// ============================================================
// PARTICLE HOOK
// ============================================================

emitSmoke(){


    if(
        !this.manager ||
        !this.manager.particles
    )
        return;



    if(
        this.damage < 40 &&
        !this.crashed
    )
        return;



    if(
        this.manager.particles.smoke
    ){

        this.manager.particles.smoke(
            this.x,
            this.y
        );

    }


}





// ============================================================
// RENDER
// ============================================================

render(ctx){

    if(
        this.destroyed ||
        !ctx
    )
        return;


    ctx.save();


    


    if(
        window.CarRenderer &&
        CarRenderer.draw
    ){

        CarRenderer.draw(
    ctx,
    this
);

    }


    ctx.restore();

}



// ============================================================
// RESET
// ============================================================

reset(){


    this.crashed =
        false;


    this.destroyed =
        false;


    this.damage =
        0;


    this.speed =
        this.baseSpeed;


    this.targetSpeed =
        this.baseSpeed;


    this.state =
        "CRUISE";


}





// ============================================================
// DESTROY
// ============================================================

destroy(){


    this.destroyed =
        true;


}





// ============================================================
// EXPORT
// ============================================================

}



window.TrafficCar =
    TrafficCar;



console.log(
    "🚙 TrafficCar v3.1 CLEAN FINAL LOADED"
);
