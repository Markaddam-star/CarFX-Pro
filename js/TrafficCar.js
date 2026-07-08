console.log("🔥 TrafficCar v2.2 START");


/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - SMART AI TRAFFIC SYSTEM v2.2
 * ============================================================
 *
 * Features
 * ✔ Driver personality AI
 * ✔ Smooth acceleration
 * ✔ Smart braking
 * ✔ Lane changing
 * ✔ Player awareness
 * ✔ Traffic following
 * ✔ Overtake behavior
 * ✔ Panic reaction
 * ✔ Suspension motion
 * ✔ Particle FX hooks
 * ============================================================
 */


class TrafficCar {


constructor(canvas){


    this.canvas = canvas;


    this.vehicle =
        VehicleFactory.random();



    this.width =
        this.vehicle.width;


    this.height =
        this.vehicle.height;




    // =========================
    // DRIVER AI
    // =========================


    this.personality =
        Math.random();



    if(this.personality > .75){

        this.driverType =
            "aggressive";

    }
    else if(this.personality > .35){

        this.driverType =
            "normal";

    }
    else{

        this.driverType =
            "cautious";

    }




    // =========================
    // AI STATE
    // =========================


    this.state =
        "cruise";


    this.braking =
        false;



    this.suspension =
        0;




    // =========================
    // LANE
    // =========================


    this.lane = 1;

    this.targetLane = 1;



    this.laneSpeed = 5;



    // =========================
    // SPEED
    // =========================


    this.speed = 0;

    this.targetSpeed = 0;



    this.maxSpeed = 300;


    this.acceleration = 80;


    this.brakePower = 450;



    // =========================
    // AI SAFETY
    // =========================


    this.safeDistance =
        240;


    this.reactionTimer =
        0;



    this.laneChangeCooldown =
        0;




    // =========================
    // FX
    // =========================


    this.fxTimer =
        0;



    this.reset();

}





reset(
    lane=null,
    y=null
){


    this.vehicle =
        VehicleFactory.random();



    this.width =
        this.vehicle.width;


    this.height =
        this.vehicle.height;




    this.lane =
        lane !== null
        ?
        lane
        :
        Math.floor(
            Math.random()*3
        );



    this.targetLane =
        this.lane;



    this.x =
        this.getLaneX(
            this.lane
        );



    this.y =
        y !== null
        ?
        y
        :
        -500;




    this.setupStats();



    this.state =
        "cruise";


    this.braking =
        false;


}






setupStats(){


    this.maxSpeed =
        this.vehicle.maxSpeed ||
        300;



    this.acceleration =
        this.vehicle.acceleration ||
        80;



    this.brakePower =
        this.vehicle.braking ||
        450;



    let personalitySpeed =
        .55 +
        this.personality*.35;



    this.speed =
        this.maxSpeed *
        personalitySpeed;



    this.targetSpeed =
        this.speed;


}







update(
    dt,
    cars=[],
    player=null
){


    dt =
    Math.min(
        dt,
        .05
    );



    this.laneChangeCooldown -= dt;


    this.reactionTimer -= dt;



    let danger =
        false;



    let front =
        this.getFrontCar(
            cars
        );



    // =========================
    // TRAFFIC FOLLOW
    // =========================


    if(front){


        let gap =
            front.y -
            this.y;



        if(
            gap <
            this.safeDistance
        ){


            danger = true;



            this.state =
                "follow";



            this.targetSpeed =
                front.speed *
                .85;


        }


    }





    // =========================
    // PLAYER DETECTION
    // =========================


    if(player){


        if(
            Math.round(this.lane)
            ===
            Math.round(player.lane)
        ){


            let distance =
                player.y -
                this.y;



            if(
                distance > 0 &&
                distance <
                this.safeDistance*2
            ){


                danger = true;


                this.state =
                    "yield";


                this.targetSpeed =
                    player.speed*.65;


            }

        }

    }
    // =========================
    // LANE CHANGE DECISION
    // =========================

    if (
        danger &&
        this.laneChangeCooldown <= 0 &&
        this.reactionTimer <= 0
    ) {

        const newLane =
            this.findSafeLane(
                cars,
                player
            );

        if (newLane !== this.lane) {

            this.targetLane = newLane;

            this.state = "overtake";

        } else {

            this.state = "panic";

            this.targetSpeed *= 0.4;

        }

        this.reactionTimer = 0.25;
        this.laneChangeCooldown = 1.5;

    }



    // =========================
    // FREE ROAD
    // =========================

    if (!danger) {

        this.state = "cruise";

        this.targetSpeed =
            this.maxSpeed *
            (
                0.60 +
                this.personality * 0.35
            );

    }



    // =========================
    // SPEED CONTROL
    // =========================

    if (this.speed < this.targetSpeed) {

        this.speed +=
            this.acceleration *
            dt;

        this.braking = false;

    }
    else {

        this.speed -=
            this.brakePower *
            dt;

        this.braking = true;

    }

    this.speed =
        Math.max(
            0,
            Math.min(
                this.speed,
                this.maxSpeed
            )
        );



    // =========================
    // SMOOTH LANE MOVEMENT
    // =========================

    this.lane +=
        (
            this.targetLane -
            this.lane
        )
        *
        this.laneSpeed *
        dt;


    this.x =
        this.getLaneX(
            this.lane
        );



    // =========================
    // SUSPENSION
    // =========================

    this.suspension =
        Math.sin(
            performance.now() * 0.01 +
            this.x
        )
        *
        (
            this.speed /
            this.maxSpeed
        )
        *
        2;



    // =========================
    // MOVE
    // =========================

    this.y +=
        this.speed *
        dt;



    // =========================
    // PARTICLE FX
    // =========================

    this.fxTimer -= dt;

    const particles =
        window.carFXEngine?.particles;

    if (
        particles &&
        this.fxTimer <= 0
    ) {

        this.fxTimer = 0.08;

        const rearX =
            this.x +
            this.width / 2;

        const rearY =
            this.y +
            this.height;

        if (
            this.speed >
            this.maxSpeed * 0.70
        ) {

            particles.dust(
                rearX,
                rearY
            );

        }

        if (this.braking) {

            particles.tireSmoke?.(
                rearX - 15,
                rearY
            );

            particles.tireSmoke?.(
                rearX + 15,
                rearY
            );

        }

    }



    // =========================
    // RESPAWN
    // =========================

    if (
        this.y >
        this.canvas.height + 600
    ) {

        this.reset(
            Math.floor(
                Math.random() * 3
            ),
            -700
        );

    }

}






getFrontCar(cars) {

    let closest = null;

    let distance = Infinity;

    for (const car of cars) {

        if (car === this)
            continue;

        if (
            Math.round(car.lane) !==
            Math.round(this.lane)
        )
            continue;

        const d =
            car.y - this.y;

        if (
            d > 0 &&
            d < distance
        ) {

            distance = d;

            closest = car;

        }

    }

    return closest;

}





findSafeLane(
    cars,
    player
) {

    const lanes = [];

    for (
        let lane = 0;
        lane < 3;
        lane++
    ) {

        if (
            lane ===
            Math.round(this.lane)
        )
            continue;

        if (
            player &&
            lane ===
            Math.round(player.lane)
        )
            continue;

        if (
            this.isLaneSafe(
                lane,
                cars
            )
        ) {

            lanes.push(
                lane
            );

        }

    }

    if (
        lanes.length === 0
    )
        return this.lane;

    return lanes[
        Math.floor(
            Math.random() *
            lanes.length
        )
    ];

}





isLaneSafe(
    lane,
    cars
) {

    for (const car of cars) {

        if (car === this)
            continue;

        if (
            Math.round(car.lane) !== lane
        )
            continue;

        if (
            Math.abs(
                car.y - this.y
            ) <
            this.safeDistance
        ) {

            return false;

        }

    }

    return true;

}





getLaneX(lane) {

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

    return (
        roadX +
        lane * laneWidth +
        (laneWidth - this.width) / 2
    );

}





render(ctx) {

    ctx.save();

    ctx.translate(
        0,
        this.suspension
    );

    CarRenderer.draw(ctx, {

        x: this.x,

        y: this.y,

        width: this.width,

        height: this.height,

        color: this.vehicle.color,

        type: this.vehicle.type,

        roofStyle: this.vehicle.roofStyle,

        spoiler: this.vehicle.spoiler,

        headlights: this.vehicle.headlights,

        wheelSize: this.vehicle.wheelSize,

        state: this.braking
            ? "brake"
            : this.state

    });

    ctx.restore();

}

}



window.TrafficCar =
TrafficCar;

console.log(
    "✅ TrafficCar v2.2 Loaded Successfully"
);



