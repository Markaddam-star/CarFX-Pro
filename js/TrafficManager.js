/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficManager.js v2.4
 * GTA CRASH RESPONSE AI PATCH
 * ============================================================
 *
 * Based on v2.3
 *
 * Added:
 * - Crash event system
 * - Panic chain reaction
 * - Emergency braking wave
 * - Nearby traffic avoidance
 * - CollisionManager integration hook
 *
 * ============================================================
 */

console.log("🚦 TrafficManager v2.4 START");


class TrafficManager {


    // =========================================================
    // CRASH EVENT
    // =========================================================

    onCrashEvent(source, power = 1) {


        if(!source)
            return;


        console.log(
            "🚨 Traffic Panic Event",
            source
        );



        for(const car of this.cars) {


            if(car === source)
                continue;



            const distance =
            Math.abs(
                car.y - source.y
            );



            // nearby vehicles panic

            if(distance < 350) {


                car.panic = true;


                car.panicTimer =
                180;



                // emergency braking

                if(distance < 180) {

                    car.brakeForce =
                    70;

                }



                // avoid crash zone

                const side =
                car.x - source.x;


                if(Math.abs(side) < 60) {


                    car.slideX +=
                    side > 0
                    ? 80
                    : -80;

                }


            }


        }



        // particle hook

        if(this.particles) {

            this.particles.emit(
                source.x,
                source.y,
                "crash"
            );

        }


    }






    // =========================================================
    // UPDATE PATCH
    // =========================================================

    handleCrashDetection() {


        for(const car of this.cars) {


            if(
                car.crashed &&
                !car.__crashReported
            ) {


                car.__crashReported = true;


                this.onCrashEvent(
                    car,
                    1
                );


            }


            if(
                !car.crashed
            ) {

                car.__crashReported =
                false;

            }


        }


    }





    // =========================================================
    // PANIC TRAFFIC UPDATE
    // =========================================================

    updatePanicTraffic(dt) {


        for(const car of this.cars) {


            if(!car.panic)
                continue;



            // slow recovery

            if(
                car.speed >
                car.baseSpeed * 1.2
            ) {


                car.speed *=
                0.96;


            }



            // random escape movement

            if(
                Math.random() < 0.005
            ) {


                car.slideX +=
                Math.random() > 0.5
                ? 40
                : -40;


            }


        }


    }




}



// =========================================================
// SAFE PATCH INJECTION
// =========================================================

const OldTrafficManager =
window.TrafficManager;


if(OldTrafficManager) {


    Object.assign(
        OldTrafficManager.prototype,
        TrafficManager.prototype
    );


    const oldUpdate =
    OldTrafficManager.prototype.update;



    OldTrafficManager.prototype.update =
    function(dt){


        this.handleCrashDetection();

        this.updatePanicTraffic(dt);


        oldUpdate.call(
            this,
            dt
        );


    };



    console.log(
        "✅ TrafficManager v2.4 Crash AI Patch Applied"
    );


}
else {


    console.warn(
        "⚠️ TrafficManager base missing"
    );


}
