/**
 * ============================================================
 * CarFX Pro Ultimate
 * PlayerCar.js - PLAYER CONTROL SYSTEM v1.0
 * ============================================================
 */

class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.player();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;


        // lane system

        this.lane = 1;

        this.targetLane = 1;


        // movement

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



        this.y =
            this.canvas.height -
            this.height -
            30;


    }





    update(dt) {


        const input = window.carFXEngine?.input;


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


        if (input.left()) {


            this.targetLane = 0;


        }


        if (input.right()) {


            this.targetLane = 2;


        }




        if (
            !input.left() &&
            !input.right()
        ) {


            this.targetLane = 1;


        }





        this.lane +=
            (
                this.targetLane -
                this.lane
            )
            *
            5
            *
            dt;






        // =========================
        // POSITION UPDATE
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





    render(ctx) {


        CarRenderer.draw(ctx, {

            x:this.x,

            y:this.y,

            width:this.width,

            height:this.height,

            color:this.vehicle.color

        });


    }

}



window.PlayerCar = PlayerCar;
