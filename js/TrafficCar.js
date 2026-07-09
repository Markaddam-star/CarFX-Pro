/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v2.7
 *
 * GTA STYLE TRAFFIC VEHICLE AI
 *
 * HYBRID VERSION
 *
 * Based on:
 * - TrafficCar v2.4 Stable Physics
 * - TrafficCar v2.6 AI Improvements
 *
 * Part 1 / 3
 *
 * Features:
 * - Smooth dt movement
 * - CarRenderer support
 * - Vehicle types
 * - Damage foundation
 * - Panic foundation
 * - TrafficManager compatible
 * ============================================================
 */


console.log(
    "🚗 TrafficCar v2.7 START"
);



class TrafficCar {


constructor(
    canvas,
    lane = 0,
    speed = 2
){


    this.canvas = canvas;


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
        speed;


    this.speed =
        speed;


    this.targetSpeed =
        speed;


    this.acceleration =
0.025;



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
    // LANE
    // =========================


    this.lane =
        0;


    this.managerLaneX =
        null;



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
// AI + MOVEMENT SYSTEM
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


    if(this.destroyed)
        return;



    this.updatePanic(dt);



    if(this.crashed){

        this.updateCrash(dt);

    }
    else{

        this.drive(
            dt,
            traffic,
            player
        );

    }



    // v2.8 RESTORED SMOOTH PHYSICS

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



    this.keepStable();


}







// ============================================================
// DRIVE AI
// ============================================================


drive(
    dt,
    traffic,
    player
){


    let targetSpeed =
        this.baseSpeed;



    if(this.damage)
        targetSpeed *= 0.65;



    if(this.panic)
        targetSpeed *= 1.25;



    if(this.brakeForce > 0){


        targetSpeed *= 0.35;


        this.brakeForce -= 1;


        this.brakeLights = true;


    }
    else{


        this.brakeLights = false;


    }



    // smooth GTA traffic acceleration

    this.speed +=
    (
        targetSpeed -
        this.speed
    ) * 0.04;



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
// TRAFFIC AWARENESS
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



        }



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


        this.panic = true;



        if(dx > 0){

            this.slideVelocity += 2;

        }
        else{

            this.slideVelocity -= 2;

        }



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
// RESET VEHICLE
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



    this.targetSpeed =
        this.speed;



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



    this.smokeTimer =
        0;



    this.driverType =
        this.randomDriver();



    this.color =
        this.randomColor();



    this.vehicleType =
        this.randomVehicleType();



}







// ============================================================
// CRASH SYSTEM
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
0.05 * power
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



    if(
        this.health <= 0
    ){

        this.destroyed =
            true;

    }



}







updateCrash(dt){



    this.speed *=
        0.97;



    this.slideX *=
        0.95;



    if(
        Math.abs(
            this.rotationSpeed
        ) < 0.05
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
// ROAD LIMITS
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
    ){

        this.x =
            roadX +
            roadWidth -
            this.width;

    }



}







// ============================================================
// RENDER SYSTEM
// ============================================================


draw(ctx){



    if(
        this.destroyed
    )
        return;



    ctx.save();



    ctx.translate(
        this.x +
        this.width / 2,

        this.y +
        this.height / 2
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
                -this.width / 2,


                y:
                -this.height / 2,


                width:
                this.width,


                height:
                this.height,


                color:
                this.color,


                type:
                this.vehicleType ||
                "sedan",


                headlights:
                true,


                state:
                this.brakeLights
                ? "brake"
                : "cruise"

            }
        );


    }



    ctx.restore();


}







// TrafficManager compatibility

render(ctx){

    this.draw(ctx);

}



}





window.TrafficCar =
    TrafficCar;


console.log(
"✅ TrafficCar v2.8 Loaded Successfully"
);

