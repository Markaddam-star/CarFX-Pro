console.log("🔥 TrafficCar v2.0 START");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * TrafficCar.js - GTA SMART AI TRAFFIC SYSTEM v2.0
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

        this.personality =
            Math.random();


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



        this.setupVehicleSpeed();


        this.state = "cruise";

    }






    setupVehicleSpeed() {


        if (
            this.vehicle.speedClass === "fast"
        ) {


            this.speed =
                280;


            this.maxSpeed =
                380;


        }
        else if (
            this.vehicle.speedClass === "slow"
        ) {


            this.speed =
                120;


            this.maxSpeed =
                220;


        }
        else {


            this.speed =
                190;


            this.maxSpeed =
                300;


        }


        this.targetSpeed =
            this.speed;

    }







    update(
        dt,
        cars = [],
        player = null
    ) {


        this.laneChangeCooldown -= dt;



        const front =
            this.getFrontCar(
                cars
            );



        let danger = false;



        // =========================
        // FOLLOW SYSTEM
        // =========================


        if (front) {


            const gap =
                front.y -
                this.y;



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


            const sameLane =
                Math.round(player.lane)
                ===
                Math.round(this.lane);



            const distance =
                player.y -
                this.y;



            if (
                sameLane &&
                distance > 0 &&
                distance < this.safeDistance * 2
            ) {


                danger = true;


                this.state =
                    "yield";


                this.targetSpeed =
                    player.speed * 0.7;


            }

        }






        // =========================
        // OVERTAKE
        // =========================


        if (
            danger &&
            this.laneChangeCooldown <= 0
        ) {


            const lane =
                this.findSafeLane(
                    cars,
                    player
                );



            if (
                lane !== this.lane
            ) {


                this.targetLane =
                    lane;


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
        // RECOVER
        // =========================


        if (!danger) {


            this.state =
                "recover";


            this.targetSpeed =
                this.maxSpeed *
                (
                    0.7 +
                    this.personality *
                    0.3
                );

        }





        // =========================
        // SPEED SMOOTHING
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
        // LANE MOVE
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






        // =========================
        // DRIVE
        // =========================


        this.y +=
            this.speed *
            dt;



    }






    getFrontCar(cars) {


        let closest = null;

        let distance =
            Infinity;



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
                car.y -
                this.y;



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


        const possible = [];



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

                possible.push(
                    lane
                );

            }

        }



        if (
            possible.length === 0
        )
            return this.lane;



        return possible[
            Math.floor(
                Math.random() *
                possible.length
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


        CarRenderer.draw(
            ctx,
            {

                x:this.x,

                y:this.y,

                width:this.width,

                height:this.height,

                color:this.vehicle.color,

                state:this.state

            }
        );

    }


}



window.TrafficCar = TrafficCar;


console.log(
    "✅ TrafficCar v2.0 Loaded Successfully"
);
