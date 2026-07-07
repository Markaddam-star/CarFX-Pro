console.log("🔥 TrafficCar v2.1 START");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - SMART AI TRAFFIC SYSTEM v2.1
 * Vehicle Visual Integration
 * ============================================================
 */

class TrafficCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.random();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;


        // =========================
        // DRIVER PERSONALITY
        // =========================

        this.personality = Math.random();


        if (this.personality > 0.7) {

            this.driverType = "aggressive";

        }
        else if (this.personality > 0.35) {

            this.driverType = "normal";

        }
        else {

            this.driverType = "cautious";

        }



        // =========================
        // AI STATE
        // =========================

        this.state = "cruise";


        // =========================
        // LANES
        // =========================

        this.lane = 1;
        this.targetLane = 1;



        // =========================
        // SPEED
        // =========================

        this.speed = 200;
        this.targetSpeed = 200;

        this.maxSpeed = 300;

        this.acceleration = 80;
        this.brakePower = 450;



        // =========================
        // SAFETY
        // =========================

        this.safeDistance = 240;

        this.laneChangeCooldown = 0;


        this.reset();

    }




    reset(
        lane = null,
        y = null
    ) {


        this.lane =
            lane !== null
            ? lane
            : Math.floor(Math.random() * 3);



        this.targetLane =
            this.lane;



        this.vehicle =
            VehicleFactory.random();



        this.width =
            this.vehicle.width;


        this.height =
            this.vehicle.height;



        this.x =
            this.getLaneX(
                this.lane
            );



        this.y =
            y !== null
            ? y
            : -500;



        this.setupVehicleStats();


        this.state = "cruise";

    }







    setupVehicleStats() {


        this.maxSpeed =
            this.vehicle.maxSpeed || 300;


        this.acceleration =
            this.vehicle.acceleration || 80;


        this.brakePower =
            this.vehicle.braking || 450;



        this.speed =
            this.maxSpeed * 0.65;


        this.targetSpeed =
            this.speed;


    }







    update(
        dt,
        cars = [],
        player = null
    ) {


        this.laneChangeCooldown -= dt;


        let danger = false;



        const front =
            this.getFrontCar(
                cars
            );



        // =========================
        // FRONT TRAFFIC
        // =========================

        if (front) {


            const gap =
                front.y - this.y;



            if (
                gap < this.safeDistance
            ) {


                danger = true;

                this.state =
                    "follow";


                this.targetSpeed =
                    front.speed;


            }

        }







        // =========================
        // PLAYER AWARENESS
        // =========================

        if (player) {


            if (
                Math.round(player.lane)
                ===
                Math.round(this.lane)
            ) {


                const distance =
                    player.y - this.y;



                if (
                    distance > 0 &&
                    distance <
                    this.safeDistance * 2
                ) {


                    danger = true;

                    this.state =
                        "yield";


                    this.targetSpeed =
                        player.speed * 0.7;


                }

            }

        }







        // =========================
        // LANE CHANGE
        // =========================

        if (
            danger &&
            this.laneChangeCooldown <= 0
        ) {


            const newLane =
                this.findSafeLane(
                    cars,
                    player
                );



            if (
                newLane !== this.lane
            ) {


                this.targetLane =
                    newLane;


                this.state =
                    "overtake";


            }
            else {


                this.state =
                    "brake";


                this.targetSpeed =
                    0;

            }



            this.laneChangeCooldown =
                1.5;

        }






        // =========================
        // FREE ROAD
        // =========================

        if (!danger) {


            this.state =
                "cruise";


            this.targetSpeed =
                this.maxSpeed *
                (
                    0.65 +
                    this.personality *
                    0.25
                );


        }







        // =========================
        // SPEED CONTROL
        // =========================


        if (
            this.speed <
            this.targetSpeed
        ) {


            this.speed +=
                this.acceleration *
                dt;


        }
        else {


            this.speed -=
                this.brakePower *
                dt;

        }



        this.speed =
            Math.max(
                0,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );






        // =========================
        // LANE SMOOTHING
        // =========================


        this.lane +=
            (
                this.targetLane -
                this.lane
            )
            *
            4 *
            dt;



        this.x =
            this.getLaneX(
                this.lane
            );





        this.y +=
            this.speed *
            dt;



        // =========================
        // RESPAWN
        // =========================

        if (
            this.y >
            this.canvas.height + 500
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



        for (
            const car of cars
        ) {


            if (
                car === this
            )
                continue;



            if (
                Math.round(car.lane)
                !==
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







    findSafeLane(
        cars,
        player
    ) {


        const options = [];



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

                options.push(
                    lane
                );

            }


        }




        if (
            options.length === 0
        )
            return this.lane;



        return options[
            Math.floor(
                Math.random() *
                options.length
            )
        ];

    }







    isLaneSafe(
        lane,
        cars
    ) {


        for (
            const car of cars
        ) {


            if (
                car === this
            )
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
                this.safeDistance
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



        const laneW =
            roadWidth / 3;



        return (
            roadX +
            lane * laneW +
            (laneW - this.width) / 2
        );


    }







    render(ctx) {


        CarRenderer.draw(
            ctx,
            {

                x: this.x,

                y: this.y,

                width: this.width,

                height: this.height,

                color: this.vehicle.color,

                type: this.vehicle.type,

                roofStyle: this.vehicle.roofStyle,

                spoiler: this.vehicle.spoiler,

                headlights: this.vehicle.headlights,

                wheelSize: this.vehicle.wheelSize,

                state: this.state

            }
        );


    }


}



window.TrafficCar = TrafficCar;


console.log(
    "✅ TrafficCar v2.1 Loaded Successfully"
);
