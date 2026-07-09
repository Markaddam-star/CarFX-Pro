/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v2.6
 *
 * GTA STYLE TRAFFIC VEHICLE AI
 *
 * PART 1 / 3
 *
 * Features:
 * - Smooth traffic movement
 * - Player relative AI
 * - Lane keeping
 * - Smart braking foundation
 * - Crash compatible
 * ============================================================
 */


console.log(
    "🚗 TrafficCar v2.6 START"
);



class TrafficCar {


    constructor(
        canvas,
        x = 0,
        speed = 2
    ){


        this.canvas = canvas;


        this.x = x;


        this.y = 0;



        // =========================
        // MOVEMENT
        // =========================


        this.speed = speed;


        this.targetSpeed =
            speed;


        this.acceleration =
            0.025;


        this.maxSpeed =
            5;



        this.lane = 0;



        this.width = 42;

        this.height = 78;



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
        // PHYSICS
        // =========================


        this.slideX = 0;


        this.rotation = 0;


        this.rotationSpeed =
            0;



        // =========================
        // EFFECTS
        // =========================


        this.smokeTimer =
            0;


        this.brakeLights =
            false;



        this.crashed =
            false;



        this.__crashReported =
            false;



        // =========================
        // STYLE
        // =========================


        this.color =
            this.randomColor();



        console.log(
            "🚙 TrafficCar v2.6 created"
        );


    }







    randomColor(){


        const colors = [

            "#d32f2f",
            "#1976d2",
            "#388e3c",
            "#eeeeee",
            "#212121",
            "#ff9800"

        ];


        return colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];


    }





    // ========================================================
    // UPDATE
    // ========================================================


    update(
        dt,
        cars = [],
        player = null
    ){


        this.handlePanic(dt);



        this.detectTraffic(
            cars
        );



        this.applySpeed(dt);



        this.y +=
            this.speed;



        this.x +=
            this.slideX;



        this.slideX *=
            0.92;



        this.keepLane();



        this.updateEffects(
            dt
        );


    }
        // ========================================================
    // TRAFFIC DETECTION AI
    // ========================================================


    detectTraffic(cars){


        let frontCar = null;

        let closest = Infinity;



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



            const distance =
                car.y - this.y;



            if(
                distance > 0 &&
                distance < closest
            ){

                closest =
                    distance;


                frontCar =
                    car;

            }


        }





        if(frontCar){


            if(
                closest <
                this.followDistance
            ){


                this.state =
                    "brake";


                this.targetSpeed =
                    Math.max(
                        0.8,
                        frontCar.speed -
                        0.5
                    );


                this.brakeLights =
                    true;


            }
            else{


                this.state =
                    "follow";


                this.targetSpeed =
                    frontCar.speed;


                this.brakeLights =
                    false;


            }



        }
        else{


            this.state =
                "cruise";


            this.targetSpeed =
                2 +
                Math.random()*1.5;


            this.brakeLights =
                false;


        }



    }







    // ========================================================
    // SPEED CONTROL
    // ========================================================


    applySpeed(dt){



        if(
            this.panic
        ){

            this.targetSpeed =
                0.5;

        }



        if(
            this.brakeForce > 0
        ){


            this.speed -=
                this.brakeForce *
                0.01;


            this.brakeForce *=
                0.90;


        }





        if(
            this.speed <
            this.targetSpeed
        ){


            this.speed +=
                this.acceleration *
                dt;


        }
        else if(
            this.speed >
            this.targetSpeed
        ){


            this.speed -=
                this.acceleration *
                dt;


        }





        this.speed =
            Math.max(
                0.2,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );



    }









    // ========================================================
    // PANIC AI
    // ========================================================


    handlePanic(dt){



        if(
            !this.panic
        )
            return;



        this.panicTimer -=
            dt;



        this.rotation +=
            this.rotationSpeed;



        this.targetSpeed =
            0.7;



        if(
            this.panicTimer <= 0
        ){


            this.panic =
                false;


            this.rotation =
                0;


        }



    }









    // ========================================================
    // KEEP LANE
    // ========================================================


    keepLane(){


        if(
            this.crashed
        )
            return;



        const targetX =
            this.managerLaneX ||
            this.x;



        this.x +=
            (
                targetX -
                this.x
            ) *
            0.02;



    }









    // ========================================================
    // EFFECT UPDATE
    // ========================================================


    updateEffects(dt){


        this.smokeTimer -=
            dt;



        if(
            this.brakeLights
        ){

            this.smokeTimer =
                5;

        }



    }
        // ========================================================
    // RESET / RESPAWN
    // ========================================================


    reset(
        x,
        y
    ){


        this.x = x;

        this.y = y;



        this.speed =
            1.5 +
            Math.random()*2;



        this.targetSpeed =
            this.speed;



        this.state =
            "cruise";



        this.panic =
            false;



        this.panicTimer =
            0;



        this.brakeForce =
            0;



        this.slideX =
            0;



        this.rotation =
            0;



        this.rotationSpeed =
            0;



        this.crashed =
            false;



        this.__crashReported =
            false;



    }









    // ========================================================
    // CRASH EVENT
    // ========================================================


    crash(
        force = 1
    ){


        this.crashed =
            true;



        this.panic =
            true;



        this.panicTimer =
            120;



        this.rotationSpeed =
            (
                Math.random() > 0.5
                ? 0.05
                : -0.05
            )
            *
            force;



        this.slideX =
            (
                Math.random() > 0.5
                ? 1
                : -1
            )
            *
            80;



    }









    // ========================================================
    // RENDER
    // ========================================================


    render(ctx){



        ctx.save();



        ctx.translate(
            this.x,
            this.y
        );



        ctx.rotate(
            this.rotation
        );



        // shadow

        ctx.fillStyle =
            "rgba(0,0,0,0.35)";


        ctx.fillRect(
            -this.width/2 + 4,
            -this.height/2 + 8,
            this.width,
            this.height
        );





        // body

        ctx.fillStyle =
            this.color;


        ctx.fillRect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );





        // windows

        ctx.fillStyle =
            "#111";


        ctx.fillRect(
            -12,
            -25,
            24,
            22
        );


        ctx.fillRect(
            -12,
            5,
            24,
            18
        );





        // brake lights

        if(
            this.brakeLights
        ){


            ctx.fillStyle =
                "red";


            ctx.fillRect(
                -15,
                32,
                7,
                5
            );


            ctx.fillRect(
                8,
                32,
                7,
                5
            );


        }







        // smoke hook

      if(
    window.ParticleSystem &&
    typeof window.ParticleSystem.emit === "function"
){

    window.ParticleSystem.emit(
        this.x,
        this.y + 40,
        "smoke"
    );

}


        }




        ctx.restore();



    }






}




window.TrafficCar =
    TrafficCar;



console.log(
    "✅ TrafficCar v2.6 Loaded Successfully"
);
