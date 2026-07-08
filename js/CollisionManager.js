/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js v1.4
 * GTA CRASH SYSTEM
 * ============================================================
 *
 * Features:
 * ✔ Player vs Traffic collision
 * ✔ High speed impact detection
 * ✔ Previous position tracking
 * ✔ Impact force
 * ✔ Crash cooldown
 * ✔ Sparks FX
 * ✔ Debris FX
 * ✔ Knockback reaction
 * ✔ Wanted hook ready
 * ============================================================
 */


class CollisionManager {


    constructor(
        player,
        trafficManager,
        particles = null
    ){


        this.player =
            player;


        this.trafficManager =
            trafficManager;


        this.particles =
            particles;



        this.cooldown =
            0;



        this.hitDistance =
            20;



        // =========================
        // FAST MOVEMENT TRACKING
        // =========================

        this.prevPlayer = {

            x:0,

            y:0

        };



        console.log(
            "💥 CollisionManager v1.4 Loaded"
        );


    }








    update(dt){


        if(
            !this.player ||
            !this.trafficManager
        )
        return;



        this.cooldown -= dt;



        for(
            const car of
            this.trafficManager.cars
        ){


            if(
                this.checkCollision(car)
            ){


                if(
                    this.cooldown <= 0
                ){


                    this.crash(car);


                    this.cooldown =
                        0.8;


                }


            }


        }



        // save current position
        // for next frame

        this.prevPlayer.x =
            this.player.x;


        this.prevPlayer.y =
            this.player.y;



    }








    checkCollision(car){


        const player =
            this.player;



        const dx =
            Math.abs(

                (
                    car.x +
                    car.width / 2
                )

                -

                (
                    player.x +
                    player.width / 2
                )

            );



        const dy =
            Math.abs(

                (
                    car.y +
                    car.height / 2
                )

                -

                (
                    player.y +
                    player.height / 2
                )

            );



        const padding = 18;



        // normal collision

        const normalHit =

        (

            dx <
            (
                car.width +
                player.width
            ) / 2 + padding


            &&


            dy <
            (
                car.height +
                player.height
            ) / 2 + padding

        );





        // high speed crossing check

        const playerMove =

            Math.abs(

                this.prevPlayer.y -
                player.y

            );



        const fastHit =

        (

            playerMove > 60


            &&


            Math.abs(
                car.y -
                player.y
            )
            <
            120


            &&


            dx <
            (
                car.width +
                player.width
            )

        );





        return (

            normalHit ||
            fastHit

        );


    }








    crash(car){


        console.log(
            "💥 GTA CRASH EVENT"
        );



        const player =
            this.player;



        const impact =

            Math.abs(
                player.speed -
                car.speed
            );






        // =========================
        // PLAYER REACTION
        // =========================


        player.hit =
            true;



        player.speed *=
            0.45;



        player.motionBlur =
            0;





        // =========================
        // KNOCKBACK
        // =========================


        if(
            player.x < car.x
        ){

            player.x -= 35;

        }
        else{

            player.x += 35;

        }







        // =========================
        // TRAFFIC REACTION
        // =========================


        if(
            typeof car.hit ===
            "function"
        ){


            car.hit(
                impact
            );


        }
        else{


            car.speed *=
                0.3;


            car.y -=
                40;


        }







        // =========================
        // FX POSITION
        // =========================


        const x =

            player.x +
            player.width / 2;



        const y =

            player.y +
            player.height / 2;







        // =========================
        // PARTICLES
        // =========================


        if(
            this.particles
        ){


            this.particles.sparks(
                x,
                y
            );



            this.particles.debris(
                x,
                y
            );



            this.particles.smoke(
                x,
                y,
                1.5
            );


        }








        // =========================
        // WANTED SYSTEM HOOK
        // =========================


        const engine =
            window.carFXEngine;



        if(
            engine &&
            engine.wantedSystem
        ){


            engine.wantedSystem.addCrime?.(
                "traffic_collision"
            );


        }




    }


}





window.CollisionManager =
CollisionManager;



console.log(
    "✅ CollisionManager v1.4 Ready"
);
