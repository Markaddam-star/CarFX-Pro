/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v2.4
 * GTA STYLE DAMAGE + PANIC AI SYSTEM
 * ============================================================
 *
 * Features:
 * - Crash spin
 * - Side slide
 * - Panic AI
 * - Better crash recovery
 * - Damaged driving behavior
 *
 * ============================================================
 */

class TrafficCar {

    constructor(canvas, lane, speed = 2) {

        this.canvas = canvas;

        this.width = 42;
        this.height = 82;

        this.x = lane;
        this.y = -150;

        this.baseSpeed = speed;
        this.speed = speed;

        this.angle = 0;
        this.rotationSpeed = 0;

        this.slideX = 0;
        this.slideVelocity = 0;

        this.health = 100;

        this.damage = false;
        this.destroyed = false;

        this.panic = false;
        this.panicTimer = 0;

        this.crashed = false;
        this.recovering = false;

        this.brakeForce = 0;

        this.driverType = this.randomDriver();

        this.color = this.randomColor();
    }

// ============================================================
// RESET VEHICLE STATE
// ============================================================

reset(lane, y){

    this.x = lane;

    this.y = y;


    this.speed =
        this.baseSpeed;


    this.angle = 0;

    this.rotationSpeed = 0;


    this.slideX = 0;

    this.slideVelocity = 0;


    this.health = 100;


    this.damage = false;

    this.destroyed = false;


    this.crashed = false;

    this.recovering = false;


    this.panic = false;

    this.panicTimer = 0;


    this.brakeForce = 0;


    this.driverType =
        this.randomDriver();


    this.color =
        this.randomColor();

}
    randomDriver() {

        const types = [
            "normal",
            "aggressive",
            "careful",
            "panic"
        ];

        return types[
            Math.floor(Math.random() * types.length)
        ];
    }


    randomColor() {

        const colors = [
            "#ff3030",
            "#3080ff",
            "#ffffff",
            "#222222",
            "#ffd000",
            "#00cc88"
        ];

        return colors[
            Math.floor(Math.random() * colors.length)
        ];
    }



    update(dt, traffic = [], player = null) {


        if(this.destroyed)
            return;


        this.updatePanic(dt);


        if(this.crashed) {

            this.updateCrash(dt);

        }
        else {

            this.drive(dt, traffic, player);

        }


        this.y += this.speed * dt;


        this.x += this.slideX * dt;


        this.slideX *= 0.94;


        this.angle += this.rotationSpeed * dt;


        this.rotationSpeed *= 0.96;


        this.keepStable();

    }



    drive(dt, traffic, player) {


        let targetSpeed = this.baseSpeed;


        if(this.damage)
            targetSpeed *= 0.65;



        if(this.panic)
            targetSpeed *= 1.35;



        if(this.brakeForce > 0) {

            targetSpeed *= 0.3;
            this.brakeForce -= dt;

        }


        this.speed +=
        (targetSpeed - this.speed) * 0.04;



        this.checkTraffic(traffic);


        if(player)
            this.avoidPlayer(player);

    }



    checkTraffic(cars) {


        for(const car of cars) {


            if(car === this)
                continue;



            const dx =
            Math.abs(this.x - car.x);


            const dy =
            Math.abs(this.y - car.y);



            if(dx < this.width &&
               dy < this.height) {


                this.panic = true;
                this.brakeForce = 30;


            }

        }

    }



    avoidPlayer(player) {


        const dx =
        this.x - player.x;


        const dy =
        this.y - player.y;



        if(
            Math.abs(dx) < 60 &&
            Math.abs(dy) < 120
        ) {


            this.panic = true;


            if(dx > 0)
                this.slideVelocity += 2;

            else
                this.slideVelocity -= 2;

        }


        this.slideX +=
        this.slideVelocity * 0.1;


        this.slideVelocity *= 0.9;

    }




    crash(power = 1) {


        if(this.crashed)
            return;


        this.crashed = true;

        this.damage = true;


        this.health -=
        power * 40;



        this.speed *= 0.25;



        this.rotationSpeed =
        (Math.random() > 0.5 ? 1 : -1)
        *
        (3 + power);



        this.slideX =
        (Math.random() > 0.5 ? 1 : -1)
        *
        (120 * power);



        this.panic = true;

        this.panicTimer = 180;



        if(this.health <= 0) {

            this.destroyed = true;

        }

    }




    updateCrash(dt) {


        this.speed *= 0.97;


        this.slideX *= 0.95;


        if(Math.abs(this.rotationSpeed) < 0.05) {

            this.recovering = true;

        }


        if(this.recovering) {

            this.angle *= 0.94;


            if(Math.abs(this.angle) < 0.05) {

                this.angle = 0;
                this.crashed = false;

            }

        }

    }




    updatePanic(dt) {


        if(this.panicTimer > 0) {

            this.panicTimer -= dt;

        }
        else {

            this.panic = false;

        }

    }




    takeDamage(amount) {


        this.health -= amount;


        this.damage = true;


        this.speed *= 0.8;



        if(this.health <= 0) {

            this.crash(2);

        }

    }




    keepStable() {


        const maxAngle = Math.PI * 2;


        if(this.angle > maxAngle)
            this.angle -= maxAngle;


        if(this.angle < -maxAngle)
            this.angle += maxAngle;



        if(this.x < 0)
            this.x = 0;


        if(this.x >
           this.canvas.width - this.width)
            this.x =
            this.canvas.width - this.width;

    }





   draw(ctx){


    if(this.destroyed)
        return;



    ctx.save();



    ctx.translate(
        this.x + this.width / 2,
        this.y + this.height / 2
    );


    ctx.rotate(this.angle);



    if(window.CarRenderer){


        window.CarRenderer.draw(
            ctx,
            {

                x: -this.width / 2,

                y: -this.height / 2,

                width: this.width,

                height: this.height,

                color: this.color,


                type:
                this.vehicleType ||
                "sedan",


                headlights:true,


                state:
                this.brakeForce > 0
                ? "brake"
                : "cruise"

            }
        );


    }



    ctx.restore();


}



    // ============================================================
    // RENDER COMPATIBILITY
    // TrafficManager uses render()
    // ============================================================

    render(ctx){

        this.draw(ctx);

    }

}



window.TrafficCar = TrafficCar;


console.log(
    "🚗 TrafficCar v2.4 Loaded - Crash AI Active"
);
