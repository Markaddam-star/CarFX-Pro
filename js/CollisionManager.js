/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js - PLAYER + TRAFFIC COLLISION v2.0
 * ============================================================
 */

class CollisionManager {

    constructor(player, trafficManager) {

        this.player = player;
        this.trafficManager = trafficManager;

        this.hitCooldown = 0;

    }


    update(dt) {

        if (!this.player || !this.trafficManager)
            return;


        if (this.hitCooldown > 0) {

            this.hitCooldown -= dt;
            return;

        }


        for (const car of this.trafficManager.cars) {


            if (this.checkCollision(
                this.player,
                car
            )) {


                console.log("💥 PLAYER HIT TRAFFIC");


                // stop traffic car

                car.speed = 0;


                // push traffic backwards

                car.y -= 40;


                // slow player

                if (this.player.speed !== undefined) {

                    this.player.speed *= 0.3;

                }


                this.hitCooldown = 0.5;


                break;

            }

        }

    }



    checkCollision(a,b) {


        return (

            a.x < b.x + b.width &&

            a.x + a.width > b.x &&

            a.y < b.y + b.height &&

            a.y + a.height > b.y

        );


    }



    canEnterLane(targetLane) {


        for (const car of this.trafficManager.cars) {


            if (
                Math.round(car.lane) !== targetLane
            )
                continue;



            const gap =
                Math.abs(
                    car.y - this.player.y
                );


            if (gap < 250)
                return false;


        }


        return true;

    }

}


window.CollisionManager = CollisionManager;
