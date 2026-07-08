/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js v1.3
 * GTA CRASH SYSTEM
 * ============================================================
 *
 * Features:
 * ✔ Player vs Traffic collision
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



        console.log(
            "💥 CollisionManager v1.3 Loaded"
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



        return (

            dx <
            (
                car.width +
                player.width
            ) / 2

            &&

            dy <
            (
                car.height +
                player.height
            ) / 2

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
        // PLAYER STATE
        // =========================


        player.hit =
            true;



        player.speed *=
            0.45;






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
        // WANTED HOOK
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
    "✅ CollisionManager v1.3 Ready"
);
