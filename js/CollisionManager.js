/**
 * ============================================================
 * CarFX Pro Ultimate
 * CollisionManager.js v2.0
 *
 * GTA Physics Collision Engine
 * PART 1 / 2
 * ============================================================
 */

class CollisionManager {

    constructor(
        player,
        trafficManager,
        particles
    ){

        this.player = player;
        this.trafficManager = trafficManager;
        this.particles = particles;

        // -------------------------
        // Physics
        // -------------------------

        this.cooldown = 0;

        this.restitution = 0.35;

        this.playerMass = 1.25;
        this.trafficMass = 1.0;

        this.maxKnockback = 60;

        this.minImpactSpeed = 25;

        this.sideMultiplier = 1.35;

        this.frontMultiplier = 1.0;

        console.log(
            "💥 CollisionManager v2.0 Loaded"
        );

    }

    //========================================================

    update(dt){

        if(
            !this.player ||
            !this.trafficManager
        ){
            return;
        }

        this.cooldown -= dt;

        for(const car of this.trafficManager.cars){

            const result =
                this.detectCollision(car);

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

            this.cooldown = 0.18;

        }

    }

    //========================================================
    // GTA COLLISION
    //========================================================

    detectCollision(car){

        const p = this.player;

        const pLeft = p.x;
        const pRight = p.x + p.width;

        const pTop = p.y;
        const pBottom = p.y + p.height;

        const cLeft = car.x;
        const cRight = car.x + car.width;

        const cTop = car.y;
        const cBottom = car.y + car.height;

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

        const pCenterX =
            p.x +
            p.width/2;

        const pCenterY =
            p.y +
            p.height/2;

        const cCenterX =
            car.x +
            car.width/2;

        const cCenterY =
            car.y +
            car.height/2;

        const dx =
            pCenterX -
            cCenterX;

        const dy =
            pCenterY -
            cCenterY;

        let normalX = 0;
        let normalY = 0;

        let type = "front";

        if(
            overlapX <
            overlapY
        ){

            normalX =
                dx > 0
                ? 1
                : -1;

            type = "side";

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

        return{

            hit:true,

            overlapX,
            overlapY,

            normalX,
            normalY,

            impact,

            type

        };

    }

    //========================================================

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

    //========================================================

    resolveOverlap(
        car,
        result
    ){

        if(
            result.overlapX <
            result.overlapY
        ){

            const move =
                result.overlapX * 0.55;

            this.player.x +=
                move *
                result.normalX;

            car.x -=
                move *
                result.normalX;

        }
        else{

            const move =
                result.overlapY * 0.5;

            car.y += move;

        }

    }

    //========================================================

    applyKnockback(
        car,
        result,
        force
    ){

        // PART 2
    }

    spawnCrashFX(
        x,
        y,
        force
    ){

        // PART 2
    }

    crash(
        car,
        result
    ){

        // PART 2
    }

    canEnterLane(lane){

        // PART 2
    }
    //========================================================
    // PLAYER + TRAFFIC PHYSICS
    //========================================================

    applyKnockback(
        car,
        result,
        force
    ){

        const playerPush = Math.min(
            this.maxKnockback,
            force * 0.18
        );

        if(result.type === "side"){

            this.player.x +=
                result.normalX * playerPush;

            car.x -=
                result.normalX *
                playerPush *
                0.65;

        }else{

            this.player.speed *= 0.45;

            car.speed *= 0.55;

            car.y +=
                playerPush * 0.45;

        }

        this.player.motionBlur = 0;

    }

    //========================================================
    // GTA FX
    //========================================================

    spawnCrashFX(
        x,
        y,
        force
    ){

        if(!this.particles)
            return;

        const power = Math.min(
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

    //========================================================
    // CRASH EVENT
    //========================================================

    crash(
        car,
        result
    ){

        console.log(
            "💥 GTA PHYSICS CRASH",
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

        if(
            typeof car.hit ===
            "function"
        ){

            car.hit(force);

        }

        this.spawnCrashFX(

            car.x +
            car.width/2,

            car.y +
            car.height/2,

            force

        );

    }

    //========================================================
    // LANE SAFETY
    //========================================================

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
            ){
                continue;
            }

            const distance = Math.abs(
                car.y -
                this.player.y
            );

            // Allow lane change if the traffic
            // car is moving away or is far enough.
            if(
                distance < 120 &&
                car.speed < this.player.speed + 30
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
    "✅ CollisionManager v2.0 Ready"
);
