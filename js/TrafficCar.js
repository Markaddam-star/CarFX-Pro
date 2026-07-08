console.log("🔥 TrafficCar v2.3 START");
/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js v2.2
 * Smart Traffic AI
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // =====================================
        // DRIVER PERSONALITY
        // =====================================

        const r = Math.random();

        if (r > 0.75) {

            this.driverType = "aggressive";

        }
        else if (r > 0.35) {

            this.driverType = "normal";

        }
        else {

            this.driverType = "cautious";

        }

        this.personality = r;
        

        // =====================================
        // AI STATE
        // =====================================

        this.state = "cruise";

        this.braking = false;

        // =====================================
        // ROAD POSITION
        // =====================================

        this.lane = 1;
        this.targetLane = 1;

        this.x = 0;
        this.y = 0;
        
// =====================================
// DAMAGE / CRASH SYSTEM
// =====================================

this.damage = 0;

this.crashed = false;

this.crashTimer = 0;

this.shake = 0;
        
        // =====================================
        // MOVEMENT
        // =====================================

        this.speed = 180;
        this.targetSpeed = 180;

        this.maxSpeed = 280;

        this.acceleration = 80;
        this.brakePower = 420;

        this.safeDistance = 240;

        // =====================================
        // ANIMATION
        // =====================================

        this.suspension = 0;

        this.laneSpeed = 10;

        this.fxTimer = 0;

        this.reactionTimer = 0;
        this.playerReactionDistance = 500;

        this.avoidStrength = 1;
        this.emergencyAvoid = false;
        this.laneChangeCooldown = 0;

        this.reset();

    }



    reset(lane = null, y = null) {

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        this.lane =
            lane !== null
                ? lane
                : Math.floor(Math.random() * 3);

        this.targetLane = this.lane;

        this.setupVehicleStats();

        this.x = this.getLaneX(this.lane);

        this.y =
            y !== null
                ? y
                : -600;

        this.state = "cruise";

        this.braking = false;

        this.damage = 0;

this.crashed = false;

this.crashTimer = 0;

this.shake = 0;

   
this.targetLane = this.lane;

    }



    setupVehicleStats() {

        this.maxSpeed =
            this.vehicle.maxSpeed || 300;

        this.acceleration =
            this.vehicle.acceleration || 80;

        this.brakePower =
            this.vehicle.braking || 420;

        let modifier = 1;

        switch (this.driverType) {

            case "aggressive":

                modifier = 1.15;
                break;

            case "cautious":

                modifier = 0.85;
                break;

        }

        this.maxSpeed *= modifier;

        this.speed =
            this.maxSpeed * 0.65;

        this.targetSpeed =
            this.speed;

    }



    update(dt, cars = [], player = null) {

        // =====================================
// CRASH RECOVERY
// =====================================

if(this.crashed){

    this.crashTimer -= dt;


    this.speed *= 0.96;


    this.shake =
        Math.sin(
            performance.now()*0.05
        )
        *
        3;


    if(this.crashTimer <= 0){

        this.crashed = false;

        this.state = "cruise";

        this.targetSpeed =
            this.maxSpeed * 0.6;

    }

}
        
        this.reactionTimer -= dt;

        this.laneChangeCooldown -= dt;

        let danger = false;

        const front =
            this.getFrontCar(cars);

        // =====================================
        // FRONT CAR
        // =====================================

        if (front) {

            const gap =
                front.y - this.y;

            if (gap > 0 &&
                gap < this.safeDistance) {

                danger = true;

                this.state = "follow";

                this.targetSpeed =
                    front.speed;

            }

        }

// =====================================
// PLAYER AWARENESS
// =====================================

if(player){

    const sameLane =
        Math.round(player.lane) ===
        Math.round(this.lane);


    const distance =
        Math.abs(
            player.y - this.y
        );


    const playerClosing =
        player.speed >
        this.speed + 40;



    if(
        sameLane &&
        distance < this.playerReactionDistance
    ){

        danger = true;


        this.emergencyAvoid = true;


        this.state =
            "player_avoid";



        if(playerClosing){

            this.targetSpeed =
                Math.max(
                    20,
                    this.speed * 0.35
                );

        }
        else{

            this.targetSpeed =
                Math.max(
                    40,
                    player.speed * 0.55
                );

        }


    }

}



// emergency reaction

if(this.emergencyAvoid){

    this.reactionTimer = 0;

}
        
                // =====================================
        // LANE CHANGE DECISION
        // =====================================

        if (
            danger &&
            this.reactionTimer <= 0 &&
            this.laneChangeCooldown <= 0
        ) {

            const nextLane =
                this.findSafeLane(
                    cars,
                    player
                );

            if (nextLane !== this.lane) {

                this.targetLane = nextLane;

                this.state = "overtake";

            }
            else {

                this.state = "brake";

                this.targetSpeed *= 0.45;

            }

            this.reactionTimer = 0.25;

            this.laneChangeCooldown = 1.5;

        }



        // =====================================
        // FREE ROAD
        // =====================================

        if (!danger) {

            this.state = "cruise";

            this.targetSpeed =
                this.maxSpeed *
                (
                    0.60 +
                    this.personality * 0.35
                );

        }



        // =====================================
        // SPEED CONTROL
        // =====================================

        if (this.speed < this.targetSpeed) {

            this.speed +=
                this.acceleration *
                dt;

            this.braking = false;

        }
        else {

            this.speed -=
                this.brakePower *
                dt;

            this.braking = true;

        }

        this.speed =
            Math.max(
                0,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );



        // =====================================
        // SMOOTH LANE CHANGE
        // =====================================

        this.lane +=
            (
                this.targetLane -
                this.lane
            ) *
            this.laneSpeed *
            dt;

        this.x =
            this.getLaneX(
                this.lane
            );



        // =====================================
        // SUSPENSION
        // =====================================

        this.suspension =
            Math.sin(
                performance.now() * 0.01 +
                this.x
            ) *
            (
                this.speed /
                this.maxSpeed
            ) *
            2;



        // =====================================
        // MOVE
        // =====================================

        this.y +=
            this.speed *
            dt;



        // =====================================
        // PARTICLE EFFECTS
        // =====================================

        this.fxTimer -= dt;

        const particles =
            window.carFXEngine?.particles;

        if (
            particles &&
            this.fxTimer <= 0
        ) {

            this.fxTimer = 0.08;

            const rearX =
                this.x +
                this.width / 2;

            const rearY =
                this.y +
                this.height;

            if (
                this.speed >
                this.maxSpeed * 0.7
            ) {

                particles.dust?.(
                    rearX,
                    rearY
                );

            }

            if (this.braking) {

                particles.smoke?.(
                    rearX - 15,
                    rearY
                );

                particles.smoke?.(
                    rearX + 15,
                    rearY
                );

            }

        }

this.emergencyAvoid = false;

        // =====================================
        // RESPAWN
        // =====================================

        if (
            this.y >
            this.canvas.height + 700
        ) {

            this.reset(

                Math.floor(
                    Math.random() * 3
                ),

                -700

            );

        }

    }



    getFrontCar(cars) {

        let closest = null;

        let distance = Infinity;

        for (const car of cars) {

            if (car === this)
                continue;

            if (
                Math.round(car.lane) !==
                Math.round(this.lane)
            )
                continue;

            const d =
                car.y - this.y;

            if (
                d > 0 &&
                d < distance
            ) {

                distance = d;

                closest = car;

            }

        }

        return closest;

    }

// =========================================================
// CRASH REACTION
// =========================================================

hit(force = 100){


    this.damage +=
        Math.min(
            force * 0.01,
            1
        );


    this.crashed = true;


    this.crashTimer =
        1.2;


    this.state =
        "crash";



    this.speed *=
        0.35;

this.targetLane =
Math.max(
0,
Math.min(
2,
this.lane +
(
Math.random()>0.5
?1
:-1
)
);

    this.targetSpeed =
        this.maxSpeed * 0.4;



    const particles =
        window.carFXEngine?.particles;



    if(particles){


        particles.sparks?.(

            this.x +
            this.width / 2,

            this.y +
            this.height / 2

        );


        particles.smoke?.(

            this.x +
            this.width / 2,

            this.y +
            this.height

        );


    }


}

    findSafeLane(
        cars,
        player
    ) {

        const lanes = [];

        for (
            let lane = 0;
            lane < 3;
            lane++
        ) {

            if (
                lane ===
                Math.round(this.lane)
            )
                continue;

            if (
                player &&
                lane ===
                Math.round(player.lane)
            )
                continue;

            if (
                this.isLaneSafe(
                    lane,
                    cars
                )
            ) {

                lanes.push(lane);

            }

        }

        if (
            lanes.length === 0
        )
            return this.lane;

        return lanes[
            Math.floor(
                Math.random() *
                lanes.length
            )
        ];

    }
        isLaneSafe(
        lane,
        cars
    ) {

        for (const car of cars) {

            if (car === this)
                continue;

            if (
                Math.round(car.lane) !== lane
            )
                continue;

            if (
                Math.abs(
                    car.y - this.y
                ) < this.safeDistance
            ) {

                return false;

            }

        }

        return true;

    }



    getLaneX(lane) {

        const roadWidth =
            Math.min(
                500,
                this.canvas.width * 0.5
            );

        const roadX =
            (
                this.canvas.width -
                roadWidth
            ) / 2;

        const laneWidth =
            roadWidth / 3;

        return (

            roadX +

            lane * laneWidth +

            (laneWidth - this.width) / 2

        );

    }



    render(ctx) {

        ctx.save();

        ctx.translate(
    this.shake,
    this.suspension
);

        CarRenderer.draw(ctx, {

            x: this.x,

            y: this.y,

            width: this.width,

            height: this.height,

            color: this.vehicle.color,

            type: this.vehicle.type,

            roofStyle: this.vehicle.roofStyle,

            spoiler: this.vehicle.spoiler,

            wheelSize: this.vehicle.wheelSize,

            headlights: this.vehicle.headlights,

            state:

this.crashed
?
"crash"
:
(
    this.braking
    ?
    "brake"
    :
    this.state
)

        });

        ctx.restore();

    }

}



window.TrafficCar =
TrafficCar;

console.log(
    "✅ TrafficCar v2.3 Loaded Successfully"
);

// =========================
// ✅ END OF FILE
// =========================
