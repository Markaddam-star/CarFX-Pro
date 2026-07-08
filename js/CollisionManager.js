/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js v1.5
 *
 * GTA Crash Physics System
 * ============================================================
 *
 * Features:
 * ✔ Player collision
 * ✔ Traffic collision
 * ✔ Damage reaction
 * ✔ Knockback
 * ✔ Sparks
 * ✔ Smoke
 * ✔ Crash cooldown
 * ✔ GTA style impact
 *
 * ============================================================
 */


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



        this.cooldown = 0;



        console.log(
            "💥 CollisionManager v1.5 Loaded"
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
                        0.6;


                }


            }


        }


    }






    checkCollision(car){


        const player =
            this.player;



        if(
            !car ||
            !player
        )
            return false;




        const playerX =
            player.x +
            player.width / 2;


        const playerY =
            player.y +
            player.height / 2;




        const carX =
            car.x +
            car.width / 2;


        const carY =
            car.y +
            car.height / 2;





        const dx =
            Math.abs(
                playerX -
                carX
            );



        const dy =
            Math.abs(
                playerY -
                carY
            );





        // GTA STYLE HITBOX


        const hitWidth =

            (
                player.width +
                car.width
            )
            *
            0.55;



        const hitHeight =

            (
                player.height +
                car.height
            )
            *
            0.55;





        const hit =

            dx < hitWidth &&
            dy < hitHeight;





        if(hit){


            console.log(
                "🚗 TRAFFIC HIT",
                car
            );


        }




        return hit;


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
        // PLAYER DAMAGE
        // =========================


        player.speed *=
            0.35;



        player.motionBlur =
            0;





        // =========================
        // PLAYER KNOCKBACK
        // =========================


        if(
            player.x <
            car.x
        ){

            player.x -= 45;

        }
        else{

            player.x += 45;

        }





        // =========================
        // TRAFFIC REACTION
        // =========================


        if(
            typeof car.hit ===
            "function"
        ){


            car.hit(

                Math.max(
                    impact,
                    120
                )

            );


        }





        // =========================
        // CRASH FX
        // =========================


        if(
            this.particles
        ){


            const x =
                car.x +
                car.width / 2;



            const y =
                car.y +
                car.height / 2;



            this.particles.sparks?.(
                x,
                y
            );



            this.particles.smoke?.(
                x,
                y,
                2
            );



            this.particles.debris?.(
                x,
                y
            );


        }



    }






    // Used by PlayerCar lane change


    canEnterLane(lane){


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
                distance < 180
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
    "✅ CollisionManager v1.5 Ready"
);
