/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js
 * PLAYER VS TRAFFIC COLLISION v1.2
 * ============================================================
 */

class CollisionManager {

    constructor(player, trafficManager) {

        this.player = player;
        this.trafficManager = trafficManager;

        this.hitDistance = 20;

    }


    update(dt) {


        if(
            !this.player ||
            !this.trafficManager
        )
            return;



        for(const car of this.trafficManager.cars){



            const dx =
                Math.abs(
                    (car.x + car.width / 2) -
                    (this.player.x + this.player.width / 2)
                );


            const dy =
                Math.abs(
                    (car.y + car.height / 2) -
                    (this.player.y + this.player.height / 2)
                );



            const collisionX =
                dx <
                (car.width + this.player.width) / 2;


            const collisionY =
                dy <
                (car.height + this.player.height) / 2;



            if(
                collisionX &&
                collisionY
            ){

                console.log(
                    "💥 PLAYER HIT BY TRAFFIC"
                );


                // stop traffic car

                car.speed *= 0.3;


                // push back

                car.y -= 40;



                // player damage later

                this.player.hit = true;


            }

        }


    }



}


window.CollisionManager = CollisionManager;
