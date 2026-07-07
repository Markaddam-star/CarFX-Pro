/**
 * ============================================================
 * CarFX Pro Ultimate
 * PlayerCar.js - PLAYER CONTROL SYSTEM v1.0
 * ============================================================
 */

class PlayerCar {

    constructor(canvas) {


    alert("NEW PlayerCar Loaded");

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
    600;


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

const collision =
    window.carFXEngine?.collisionManager;

let nextLane = 1;

if (input.left()) {

    nextLane = 0;

}
else if (input.right()) {

    nextLane = 2;

}
else {

    nextLane = 1;

}

// Allow lane change only if target lane is free
if (
    !collision ||
    collision.canEnterLane(nextLane)
) {

    this.targetLane = nextLane;

}

// Smooth lane movement
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
    ) < 0.01
) {

    this.lane = this.targetLane;

}


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




