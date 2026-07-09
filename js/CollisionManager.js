/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js v2.1
 *
 * GTA Physics Collision Engine
 * Traffic AI Integration
 *
 * PART 1 / 2
 * ============================================================
 */


console.log(
    "💥 CollisionManager v2.1 START"
);



class CollisionManager {


    constructor(
        player,
        trafficManager,
        particles
    ){


        this.player =
            player;


        this.trafficManager =
            trafficManager;


        this.particles =
            particles;




        // =========================
        // PHYSICS SETTINGS
        // =========================


        this.cooldown = 0;


        this.restitution =
            0.35;


        this.playerMass =
            1.25;


        this.trafficMass =
            1.0;


        this.maxKnockback =
            60;


        this.minImpactSpeed =
            25;



        this.sideMultiplier =
            1.35;


        this.frontMultiplier =
            1.0;



        // =========================
        // CRASH CONTROL
        // =========================


        this.lastCrash = 0;


        this.crashDelay =
            0.18;


        this.totalCrashes =
            0;




        console.log(
            "💥 CollisionManager v2.1 Loaded"
        );


    }






    // ========================================================
    // UPDATE
    // ========================================================


    update(dt){



        if(
            !this.player ||
            !this.trafficManager
        ){

            return;

        }



        this.cooldown -= dt;



        for(
            const car of
            this.trafficManager.cars
        ){



            const result =
                this.detectCollision(
                    car
                );



            if(
                !result.hit
            ){

                continue;

            }




            if(
                this.cooldown > 0
            ){

                continue;

            }





            this.resolveOverlap(
                car,
                result
            );




            this.crash(
                car,
                result
            );




            this.cooldown =
                this.crashDelay;



        }


    }







    // ========================================================
    // COLLISION DETECTION
    // ========================================================


    detectCollision(car){



        const p =
            this.player;



        const pLeft =
            p.x;


        const pRight =
            p.x +
            p.width;



        const pTop =
            p.y;


        const pBottom =
            p.y +
            p.height;




        const cLeft =
            car.x;


        const cRight =
            car.x +
            car.width;



        const cTop =
            car.y;



        const cBottom =
            car.y +
            car.height;






        if(

            pRight <= cLeft ||

            pLeft >= cRight ||

            pBottom <= cTop ||

            pTop >= cBottom

        ){

            return {
                hit:false
            };

        }





        const overlapX =

            Math.min(
                pRight,
                cRight
            )

            -

            Math.max(
                pLeft,
                cLeft
            );




        const overlapY =

            Math.min(
                pBottom,
                cBottom
            )

            -

            Math.max(
                pTop,
                cTop
            );






        const dx =

            (
                p.x +
                p.width/2
            )

            -

            (
                car.x +
                car.width/2
            );





        const dy =

            (
                p.y +
                p.height/2
            )

            -

            (
                car.y +
                car.height/2
            );






        let normalX = 0;

        let normalY = 0;


        let type =
            "front";





        if(
            overlapX <
            overlapY
        ){


            normalX =
                dx > 0
                ? 1
                : -1;



            type =
                "side";


        }
        else{


            normalY =
                dy > 0
                ? 1
                : -1;




            type =

                dy > 0
                ?

                "rear"

                :

                "front";


        }






        const impact =

            Math.abs(

                this.player.speed -

                car.speed

            );





        return {


            hit:true,


            overlapX,


            overlapY,


            normalX,


            normalY,


            impact,


            type


        };
            // ========================================================
    // IMPACT CALCULATION
    // ========================================================


    calculateImpact(result){


        let force =
            Math.max(
                this.minImpactSpeed,
                result.impact
            );



        if(
            result.type ===
            "side"
        ){


            force *=
                this.sideMultiplier;


        }
        else{


            force *=
                this.frontMultiplier;


        }



        return force;


    }






    // ========================================================
    // OVERLAP SOLVER
    // ========================================================


    resolveOverlap(
        car,
        result
    ){


        if(
            result.overlapX <
            result.overlapY
        ){



            const move =
                result.overlapX *
                0.55;



            this.player.x +=

                move *
                result.normalX;



            car.x -=

                move *
                result.normalX;



        }
        else{


            const move =

                result.overlapY *
                0.5;



            car.y +=
                move;



        }


    }








    // ========================================================
    // KNOCKBACK PHYSICS
    // ========================================================


    applyKnockback(
        car,
        result,
        force
    ){



        const push =

            Math.min(

                this.maxKnockback,

                force *
                0.18

            );




        if(
            result.type ===
            "side"
        ){



            this.player.x +=

                result.normalX *
                push;




            car.x -=

                result.normalX *
                push *
                0.65;



        }
        else{


            this.player.speed *=
                0.45;




            car.speed *=
                0.55;




            car.y +=

                push *
                0.45;



        }




        this.player.motionBlur =
            0;



    }







    // ========================================================
    // CRASH FX
    // ========================================================


    spawnCrashFX(
        x,
        y,
        force
    ){



        if(
            !this.particles
        )
            return;





        const power =

            Math.min(

                5,

                Math.max(

                    1,

                    force / 70

                )

            );





        this.particles.sparks?.(
            x,
            y
        );



        this.particles.smoke?.(
            x,
            y,
            power
        );



        this.particles.debris?.(
            x,
            y
        );



    }








    // ========================================================
    // MAIN CRASH EVENT
    // ========================================================


    crash(
        car,
        result
    ){



        console.log(
            "💥 GTA CRASH EVENT",
            result.type
        );





        const force =

            this.calculateImpact(
                result
            );






        this.applyKnockback(
            car,
            result,
            force
        );






        // TrafficCar damage

        if(
            typeof car.hit ===
            "function"
        ){


            car.hit(
                force
            );


        }






        // TrafficCar v2.4 crash physics

        if(
            typeof car.crash ===
            "function"
        ){


            car.crash(
                force / 50
            );


        }







        // TrafficManager panic chain

        if(

            this.trafficManager &&

            typeof
            this.trafficManager
            .onCrashEvent
            ===
            "function"

        ){



            this.trafficManager
            .onCrashEvent(

                car,

                force / 50

            );



        }







        this.spawnCrashFX(

            car.x +
            car.width / 2,


            car.y +
            car.height / 2,


            force


        );





        this.totalCrashes++;



    }








    // ========================================================
    // LANE SAFETY
    // ========================================================


    canEnterLane(
        lane
    ){



        if(
            !this.trafficManager
        )
            return true;





        for(
            const car of
            this.trafficManager.cars
        ){



            if(
                Math.round(car.lane)
                !== lane
            )
                continue;





            const distance =

                Math.abs(

                    car.y -
                    this.player.y

                );






            if(

                distance < 120 &&

                car.speed <
                this.player.speed + 30

            ){



                return false;



            }



        }





        return true;



    }




}






window.CollisionManager =
    CollisionManager;





console.log(
    "✅ CollisionManager v2.1 Ready"
);


    }
