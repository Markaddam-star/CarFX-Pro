/**
 * ============================================================
 * CarFX Pro Ultimate
 *
 * CollisionManager.js v3.1 CLEAN FINAL
 *
 * GTA STYLE COLLISION SYSTEM
 *
 * RESPONSIBILITY:
 *
 * ✔ Detect collisions
 * ✔ Trigger crash events
 * ✔ Damage events
 * ✔ Panic reactions
 * ✔ Crash effects
 *
 * DOES NOT:
 *
 * ✘ Physics
 * ✘ Movement
 * ✘ AI
 *
 * Compatible:
 *
 * ✔ PlayerCar v2.2
 * ✔ TrafficCar v3.1
 * ✔ TrafficManager v3.0
 * ✔ Engine v2.5
 *
 * ============================================================
 */


console.log(
    "💥 CollisionManager v3.1 CLEAN START"
);



class CollisionManager {


constructor(
    player,
    trafficManager
){


    this.player =
        player;


    this.trafficManager =
        trafficManager;



    this.enabled =
        true;

    this.cooldowns =
    new Map();

// =====================================
// GLOBAL COOLDOWN STORAGE
// =====================================

this.cooldowns =
    new Map();


    this.playerRadius =
        35;


    this.carRadius =
        30;



    console.log(
        "💥 CollisionManager v3.1 READY"
    );


}



// ============================================================
// MAIN UPDATE
// ============================================================

update(dt){


    if(
        !this.enabled
    )
        return;



    this.updateCooldowns(dt);



    if(
        !this.player
    )
        return;



    this.checkPlayerTraffic();


    this.checkTrafficTraffic();


}





// ============================================================
// PLAYER VS TRAFFIC
// ============================================================

checkPlayerTraffic(){


    if(
        !this.trafficManager
    )
        return;



    const cars =
        this.trafficManager.getCars();



    for(
        const car of cars
    ){


        if(
            !car ||
            car.destroyed
        )
            continue;



        if(
            this.hitTest(
                this.player,
                car
            )
        ){


            this.triggerCrash(
                this.player,
                car,
                "player"
            );


        }


    }


}





// ============================================================
// TRAFFIC VS TRAFFIC
// ============================================================

checkTrafficTraffic(){


    if(
        !this.trafficManager
    )
        return;



    const cars =
        this.trafficManager.getCars();



    for(
        let i=0;
        i<cars.length;
        i++
    ){


        const a =
            cars[i];



        if(
            !a ||
            a.destroyed
        )
            continue;



        for(
            let j=i+1;
            j<cars.length;
            j++
        ){


            const b =
                cars[j];



            if(
                !b ||
                b.destroyed
            )
                continue;



            if(
                this.hitTest(
                    a,
                    b
                )
            ){


                


            }


        }


    }


}
// ============================================================
// RECTANGLE COLLISION TEST
// ============================================================

hitTest(
    a,
    b
){


    const aw =
        a.width || 40;


    const ah =
        a.height || 70;



    const bw =
        b.width || 40;


    const bh =
        b.height || 70;



    return (

        a.x <
        b.x + bw &&


        a.x + aw >
        b.x &&


        a.y <
        b.y + bh &&


        a.y + ah >
        b.y

    );


}





// ============================================================
// IMPACT DIRECTION
// ============================================================

getImpactDirection(
    a,
    b
){


    const dx =
        b.x - a.x;



    const dy =
        b.y - a.y;



    if(
        Math.abs(dx) >
        Math.abs(dy)
    ){


        return dx > 0 ?
        "right" :
        "left";


    }



    return dy > 0 ?
    "front" :
    "rear";


}





// ============================================================
// CREATE COLLISION COOLDOWN
// ============================================================

createCooldown(
    a,
    b
){

    if(!a || !b)
        return;


    if(!a._collisionData)
        a._collisionData = [];


    a._collisionData.push({

        target:b,

        time:0.5

    });

}




// ============================================================
// GLOBAL COOLDOWN
// ============================================================

setCooldown(
    a,
    b
){

    if(
        !a ||
        !b
    )
        return;



    if(
        !this.cooldowns
    ){

        this.cooldowns =
            new Map();

    }



    const key =
        a + "_" + b;



    this.cooldowns.set(
        key,
        performance.now()
    );


}

// ============================================================
// CHECK COOLDOWN
// ============================================================

isOnCooldown(
    a,
    b
){


    if(
        !a ||
        !a._collisionData
    )
        return false;



    for(
        const hit of a._collisionData
    ){


        if(
            hit.target === b &&
            hit.time > 0
        ){

            return true;

        }


    }



    return false;


}





// ============================================================
// UPDATE COOLDOWN TIMER
// ============================================================

updateCooldowns(dt){


    if(
        !this.trafficManager
    )
        return;



    const cars =
        this.trafficManager.getCars();



    for(
        const car of cars
    ){


        if(
            !car ||
            !car._collisionData
        )
            continue;



        for(
            let i =
            car._collisionData.length-1;

            i>=0;

            i--
        ){


            const hit =
                car._collisionData[i];



            hit.time -= dt;



            if(
                hit.time <= 0
            ){

                car._collisionData.splice(
                    i,
                    1
                );

            }


        }


    }


}





// ============================================================
// FINAL CRASH EVENT
// ============================================================

triggerCrash(
    a,
    b,
    type="unknown"
){


    if(
        this.isOnCooldown(
            a,
            b
        )
    )
        return;



    this.createCooldown(
        a,
        b
    );



    const directionA =
        this.getImpactDirection(
            a,
            b
        );



    const directionB =
        this.getImpactDirection(
            b,
            a
        );





    // =========================
    // CRASH
    // =========================

    if(
        a &&
        a.crash
    ){

        a.crash(
            directionA
        );

    }



    if(
        b &&
        b.crash
    ){

        b.crash(
            directionB
        );

    }





    // =========================
    // DAMAGE
    // =========================

    if(
        a &&
        a.applyDamage
    ){

        a.applyDamage(
            25
        );

    }



    if(
        b &&
        b.applyDamage
    ){

        b.applyDamage(
            25
        );

    }




    // =========================
    // EFFECTS
    // =========================

    this.createCrashEffect(a);


    this.createCrashEffect(b);




    // =========================
    // PANIC CHAIN
    // =========================

    this.triggerCrashChain(
        a
    );




    // =========================
    // MANAGER EVENT
    // =========================

    if(
        this.trafficManager &&
        this.trafficManager.onCrashEvent
    ){

        this.trafficManager.onCrashEvent(
            a,
            b
        );

    }



}
// ============================================================
// PARTICLE / EFFECT HOOKS
// ============================================================

createCrashEffect(car){

    if(!car)
        return;


    if(
        !this.trafficManager ||
        !this.trafficManager.particles
    )
        return;


    const particles =
        this.trafficManager.particles;



    if(
        particles.createCrash
    ){

        particles.createCrash(
            car.x + car.width/2,
            car.y + car.height/2
        );

    }



    if(
        particles.smoke
    ){

        particles.smoke(
            car.x + car.width/2,
            car.y + car.height/2
        );

    }


}



// ============================================================
// DAMAGE SYSTEM HOOK
// ============================================================

applyDamage(car, amount){

    if(
        !car
    )
        return;



    if(
        typeof car.applyDamage === "function"
    ){

        car.applyDamage(
            amount
        );

    }


}



// ============================================================
// CRASH EVENT HANDLER
// ============================================================

triggerCrash(
    a,
    b,
    type="traffic"
){


    if(
        !a ||
        !b
    )
        return;



    if(
        this.isOnCooldown(
            a,
            b
        )
    )
        return;



    this.createCooldown(
    a,
    b
);



    const direction =
        this.getImpactDirection(
            a,
            b
        );



    // =========================
    // CRASH CALLBACK
    // =========================


    if(
        typeof a.crash === "function"
    ){

        a.crash(
            direction
        );

    }



    if(
        typeof b.crash === "function"
    ){

        b.crash(
            direction
        );

    }



    // =========================
    // DAMAGE
    // =========================


    this.applyDamage(
        a,
        35
    );


    this.applyDamage(
        b,
        35
    );



    // =========================
    // EFFECTS
    // =========================


    this.createCrashEffect(
        a
    );


    this.createCrashEffect(
        b
    );



    // =========================
    // PANIC CHAIN
    // =========================


    this.triggerPanicChain(
        a
    );


    this.triggerPanicChain(
        b
    );



    // =========================
    // MANAGER EVENT
    // =========================


    if(
        this.trafficManager &&
        typeof this.trafficManager.onCrashEvent === "function"
    ){

        this.trafficManager.onCrashEvent(
            a,
            b,
            type
        );

    }



    console.log(
        "💥 Collision Event",
        type
    );


}





// ============================================================
// PANIC CHAIN
// ============================================================

triggerPanicChain(source){


    if(
        !this.trafficManager
    )
        return;



    const cars =
        this.trafficManager.getCars();



    for(
        const car of cars
    ){


        if(
            !car ||
            car === source ||
            car.crashed ||
            car.destroyed
        )
            continue;



        const dx =
            car.x -
            source.x;



        const dy =
            car.y -
            source.y;



        const distance =
            Math.sqrt(
                dx*dx +
                dy*dy
            );



        if(
            distance < 220 &&
            typeof car.panic === "function"
        ){

            car.panic();

        }


    }


}



// ============================================================
// RESET
// ============================================================

reset(){

    if(
        !this.trafficManager
    )
        return;


    const cars =
        this.trafficManager.getCars();


    for(
        const car of cars
    ){

        if(
            car &&
            car.reset
        ){

            car.reset();

        }

    }

}



// ============================================================
// DEBUG
// ============================================================

debug(){

    return {

        enabled:
            this.enabled,


        cooldowns:
            this.cooldowns.size,


        cars:
            this.trafficManager ?
            this.trafficManager.getCars().length :
            0,


        player:
            !!this.player


    };


}



// ============================================================
// ENABLE / DISABLE
// ============================================================

setEnabled(state){

    this.enabled =
        state;

}



// ============================================================
// CLASS END
// ============================================================

}


window.CollisionManager =
    CollisionManager;



console.log(
    "💥 CollisionManager v3.1 FINAL HYBRID LOADED"
);
