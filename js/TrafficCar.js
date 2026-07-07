console.log("🔥 TrafficCar START");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - SMART AI TRAFFIC SYSTEM v1.3
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;


        // DRIVER TYPE

        this.personality = 0.2 + Math.random() * 0.8;

        if (this.personality > 0.75)
            this.driverType = "aggressive";
        else if (this.personality > 0.4)
            this.driverType = "normal";
        else
            this.driverType = "cautious";


        this.state = "cruise";


        // LANES

        this.lane = 1;
        this.targetLane = 1;


        // SPEED

        this.speed = 180 + Math.random() * 120;

        this.maxSpeed = 340;
        this.minSpeed = 0;


        // SAFETY

        this.safeDistance = 240;
        this.laneChangeCooldown = 0;


        this.reset();

    }



    reset(lane = null, y = null) {


        this.lane =
            lane !== null
            ? lane
            : Math.floor(Math.random() * 3);


        this.targetLane = this.lane;


        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;


        this.x = this.getLaneX(this.lane);


        this.y =
    y !== null
    ? y
    : -200 - Math.random() * 400;


        this.speed =
            180 + Math.random() * 140;


        this.state = "cruise";

    }





    update(dt, cars = [], player = null) {


        this.laneChangeCooldown -= dt;


        const currentLane =
            Math.round(this.lane);


        let danger = false;



        // =========================
        // FRONT CAR CHECK
        // =========================

        const frontCar =
            this.getFrontCar(
                cars,
                currentLane
            );


        if (frontCar) {

            const gap =
                frontCar.y - this.y;


            if (gap < this.safeDistance) {

                danger = true;

            }

        }





        // =========================
        // PLAYER CHECK
        // =========================

        if (player) {


            const playerLane =
                Math.round(player.lane);


            const playerDistance =
                player.y - this.y;



            if (
                playerLane === currentLane &&
                playerDistance > 0 &&
                playerDistance <
                this.safeDistance * 2
            ) {


                danger = true;


            }

        }






        // =========================
        // OVERTAKE DECISION
        // =========================

        if (
            danger &&
            this.laneChangeCooldown <= 0
        ) {


            let possible = [];



         const playerLane =
    player
    ? Math.round(player.lane)
    : -1;



if (
    this.isLaneSafe(currentLane - 1, cars) &&
    currentLane - 1 !== playerLane
) {

    possible.push(currentLane - 1);

}



if (
    this.isLaneSafe(currentLane + 1, cars) &&
    currentLane + 1 !== playerLane
) {

    possible.push(currentLane + 1);

}




            if (possible.length > 0) {


                this.targetLane =
                    possible[
                        Math.floor(
                            Math.random() *
                            possible.length
                        )
                    ];


                this.state = "overtake";


            }
            else {


                this.state = "brake";


                this.speed -=
                    900 * dt;


            }



            this.laneChangeCooldown = 1.5;

        }





        // =========================
        // SMOOTH LANE CHANGE
        // =========================


        this.lane +=
            (
                this.targetLane -
                this.lane
            )
            *
            3
            *
            dt;



        if (
            Math.abs(
                this.lane -
                this.targetLane
            )
            < 0.05
        ) {

            this.lane =
                this.targetLane;

        }





        // =========================
        // SPEED AI
        // =========================


        if (!danger) {


            this.state = "cruise";


            const accel =
                this.driverType === "aggressive"
                ? 120
                : 70;


            this.speed +=
                accel * dt;

        }





        // SPEED LIMIT

        this.speed =
            Math.max(
                0,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );





        // =========================
        // MOVE
        // =========================


        this.x =
            this.getLaneX(
                this.lane
            );


        this.y +=
            this.speed * dt;





        // =========================
        // RESPAWN
        // =========================

        if (
            this.y >
            this.canvas.height + 400
        ) {

this.reset(
    Math.floor(Math.random() * 3),
    -800 - Math.random() * 500
);
        }


    }





    getFrontCar(cars, lane) {


        let closest = null;

        let distance = Infinity;



        for (const car of cars) {


            if (car === this)
                continue;



            if (
                Math.round(car.lane)
                !== lane
            )
                continue;



            const diff =
                car.y - this.y;



            if (
                diff > 0 &&
                diff < distance
            ) {

                distance = diff;

                closest = car;

            }

        }


        return closest;

    }







    isLaneSafe(lane, cars) {


        if (
            lane < 0 ||
            lane > 2
        )
            return false;



        for (const car of cars) {


            if (car === this)
                continue;



            if (
                Math.round(car.lane)
                !== lane
            )
                continue;



            if (
                Math.abs(
                    car.y -
                    this.y
                )
                <
                this.safeDistance * 1.3
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
            )
            /
            2;



        const laneW =
            roadWidth / 3;



        return (
            roadX +
            lane * laneW +
            (laneW - this.width) / 2
        );

    }






    render(ctx) {


        CarRenderer.draw(ctx, {

            x: this.x,

            y: this.y,

            width: this.width,

            height: this.height,

            color: this.vehicle.color,

            state: this.state

        });


    }

}



window.TrafficCar = TrafficCar;


console.log("✅ TrafficCar Loaded Successfully");
