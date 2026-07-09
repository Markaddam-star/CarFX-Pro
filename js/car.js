/**
 * ============================================================
 * CarFX Pro Ultimate
 * PlayerCar.js - PLAYER CONTROL SYSTEM v2.2
 * ============================================================
 *
 * Features
 * ✔ Smooth acceleration
 * ✔ Progressive braking
 * ✔ Lane interpolation
 * ✔ Steering tilt
 * ✔ Suspension bounce
 * ✔ Brake light state
 * ✔ RPM system
 * ✔ Audio hooks
 * ✔ HUD hooks
 * ✔ Cinematic particle FX v2.0
 * ✔ Tire smoke
 * ✔ Brake dust
 * ✔ Drift smoke
 * ============================================================
 */


class PlayerCar {


constructor(canvas, particles){


    this.canvas = canvas;

    this.particles = particles;


    this.vehicle =
        VehicleFactory.player();



    this.width =
        this.vehicle.width;


    this.height =
        this.vehicle.height;



    // Lane

    this.lane = 1;

    this.targetLane = 1;


    this.x = 0;

    this.targetX = 0;


    this.laneSmooth = 8;



    // Physics

    this.speed = 0;

    this.maxSpeed =
        this.vehicle.maxSpeed;


    this.acceleration =
        this.vehicle.acceleration;


    this.brakePower =
        this.vehicle.braking;


    this.friction = 8;



    // Visual

    this.steer = 0;

    this.targetSteer = 0;


    this.bodyBounce = 0;


    this.braking = false;


    this.handbrakeActive = false;



    // Engine

    this.rpm = 800;

    this.engineRPM = 0;

    this.throttle = 0;


    this.lastSpeed = 0;

    this.speedDelta = 0;



    // FX

    this.particleTimer = 0;



    this.cameraZoom = 1;

    this.motionBlur = 0;



    this.resize();



}





resize(){


    const roadWidth =
        Math.min(
            500,
            this.canvas.width * .5
        );


    const roadX =
        (
            this.canvas.width -
            roadWidth
        ) / 2;


    const laneWidth =
        roadWidth / 3;



    this.x =
        roadX +
        this.lane * laneWidth +
        (laneWidth - this.width) / 2;



    this.targetX = this.x;



    this.y =
        this.canvas.height -
        this.height -
        40;

}





update(dt){


    const input =
        window.carFXEngine?.input;


    if(!input)
        return;



    dt =
        Math.min(
            dt,
            0.05
        );



    // ACCELERATION


    if(input.accelerate()){


        this.speed +=
            this.acceleration * dt;


    }
    else{


        this.speed -=
            this.friction * dt;


        if(this.speed < 0)
            this.speed = 0;

    }





    // BRAKE


    this.braking = false;


    if(input.brake()){


        this.speed -=
            this.brakePower * dt;


        this.braking = true;

    }





    // HANDBRAKE


    this.handbrakeActive =
        input.handbrake();



    if(this.handbrakeActive){


        this.speed -=
            this.brakePower *
            0.65 *
            dt;


    }





    this.speed =
        Math.max(
            0,
            Math.min(
                this.speed,
                this.maxSpeed
            )
        );





    // RPM


    this.speedDelta =
        this.speed -
        this.lastSpeed;



    if(this.speedDelta > 0){


        this.throttle =
            Math.min(
                this.speedDelta * 20,
                1
            );


    }
    else{


        this.throttle *= .9;

    }



    this.lastSpeed =
        this.speed;



    let ratio =
        this.speed /
        this.maxSpeed;



    let targetRPM =
        800 +
        ratio * 5000 +
        this.throttle * 2500;



    this.rpm +=
    (
        targetRPM -
        this.rpm
    ) * .08;



    this.engineRPM =
        this.rpm / 8000;





    // LANE SYSTEM


    let wantedLane =
        this.targetLane;



    if(input.leftPressed()){


        wantedLane =
            Math.max(
                0,
                this.targetLane - 1
            );

    }
    else if(input.rightPressed()){


        wantedLane =
            Math.min(
                2,
                this.targetLane + 1
            );

    }



   // GTA Style:
// Always allow lane change.
// CollisionManager will handle crashes.

this.targetLane = wantedLane;



    this.lane +=
    (
        this.targetLane -
        this.lane
    )
    *
    this.laneSmooth *
    dt;





    // ROAD POSITION


    const roadWidth =
        Math.min(
            500,
            this.canvas.width*.5
        );


    const roadX =
    (
        this.canvas.width -
        roadWidth
    ) / 2;


    const laneWidth =
        roadWidth/3;



    this.targetX =
        roadX +
        this.lane *
        laneWidth +
        (laneWidth-this.width)/2;



    this.x +=
    (
        this.targetX -
        this.x
    )
    *
    10 *
    dt;





    // STEERING


    this.targetSteer =
        (
            this.targetLane -
            this.lane
        )
        *
        18;



    this.steer +=
    (
        this.targetSteer -
        this.steer
    )
    *
    8 *
    dt;





    // BOUNCE


    this.bodyBounce =
        Math.sin(
            performance.now()*0.012
        )
        *
        ratio *
        2;




    this.cameraZoom =
        1 +
        ratio*.08;



    this.motionBlur =
        ratio;




    // =========================
    // PARTICLE FX v2.0
    // =========================


    this.particleTimer -= dt;



    if(
        this.particles &&
        this.particleTimer <= 0
    ){


        this.particleTimer =
            0.08;



        const rearX =
            this.x +
            this.width/2;


        const rearY =
            this.y +
            this.height;



        if(this.throttle > .4){


            this.particles.smoke(
                rearX,
                rearY,
                1
            );

        }



        if(this.speed >
            this.maxSpeed*.65
        ){


            this.particles.dust(
                rearX,
                rearY
            );

        }



        if(this.braking){


            this.particles.tireSmoke(
                rearX-15,
                rearY
            );


            this.particles.tireSmoke(
                rearX+15,
                rearY
            );

        }



        if(this.handbrakeActive){


            this.particles.tireSmoke(
                rearX,
                rearY
            );

        }

    }


}





draw(ctx){


    ctx.save();



    ctx.translate(
        this.x +
        this.width/2,

        this.y +
        this.height/2 +
        this.bodyBounce
    );



    ctx.rotate(
        this.steer *
        Math.PI /
        180
    );



    CarRenderer.draw(
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
        this.vehicle.color,

        type:
        this.vehicle.type,

        spoiler:
        this.vehicle.spoiler,

        wheelSize:
        this.vehicle.wheelSize,

        headlights:
        this.vehicle.headlights,

        state:
        this.braking
        ?
        "brake"
        :
        "cruise"

        }
    );



    ctx.restore();


}





getEngineData(){


    return {

        speed:this.speed,

        rpm:this.rpm,

        throttle:this.throttle,

        braking:this.braking

    };


}


}



window.PlayerCar =
PlayerCar;



console.log(
"✅ PlayerCar v2.2 Loaded Successfully"
);
