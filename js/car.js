/**
 * ============================================================
 * CarFX Pro Ultimate
 * PlayerCar.js - PLAYER CONTROL SYSTEM v1.1
 * ============================================================
 */

class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.player();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;


        // =========================
        // LANE SYSTEM
        // =========================

        this.lane = 1;
        this.targetLane = 1;


        // =========================
        // MOVEMENT
        // =========================

        this.speed = 0;

        this.maxSpeed = 500;

        this.acceleration = 260;

        this.brakePower = 500;


        this.resize();

    }



    resize() {


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



        this.x =
            roadX +
            this.lane * laneW +
            (laneW - this.width) / 2;



        // PLAYER SCREEN POSITION

        this.y =
            this.canvas.height -
            this.height -
            40;


    }





    update(dt) {


        const input =
            window.carFXEngine?.input;


        if (!input)
            return;



        // =========================
        // ACCELERATION
        // =========================

        if (input.accelerate()) {


            this.speed +=
                this.acceleration * dt;


        }
        else {


            this.speed -=
                120 * dt;


        }



        // =========================
        // BRAKE
        // =========================

        if (input.brake()) {


            this.speed -=
                this.brakePower * dt;


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
        // LANE CONTROL
        // =========================


        const collision =
            window.carFXEngine?.collisionManager;



        let nextLane =
            this.targetLane;



       if (input.left()) {

    nextLane =
        Math.max(
            0,
            this.targetLane - 1
        );

}
else if (input.right()) {

    nextLane =
        Math.min(
            2,
            this.targetLane + 1
        );

}



        if (
            !collision ||
            collision.canEnterLane(nextLane)
        ) {

            this.targetLane =
                nextLane;

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
            5
            *
            dt;



        if (
            Math.abs(
                this.lane -
                this.targetLane
            )
            < 0.01
        ) {

            this.lane =
                this.targetLane;

        }




        // =========================
        // X POSITION UPDATE
        // =========================


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



        this.x =
            roadX +
            this.lane *
            laneW +
            (laneW - this.width) / 2;


    }





    draw(ctx) {


        CarRenderer.draw(ctx, {


            x: this.x,

            y: this.y,

            width: this.width,

            height: this.height,

            color: this.vehicle.color


        });


    }

}



window.PlayerCar = PlayerCar;
