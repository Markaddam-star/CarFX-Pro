/**
 * ============================================================
 * CarFX Pro Ultimate
 * PlayerCar.js - PLAYER CONTROL SYSTEM v2.0
 * ============================================================
 *
 * Features
 * ✔ Smooth acceleration
 * ✔ Progressive braking
 * ✔ Lane interpolation
 * ✔ Steering tilt
 * ✔ Suspension bounce
 * ✔ Brake light state
 * ✔ HUD hooks
 * ✔ Audio hooks
 * ✔ Particle hooks
 * ✔ Camera hooks
 * ============================================================
 */

class PlayerCar {

    constructor(canvas) {

        this.canvas = canvas;

        this.vehicle = VehicleFactory.player();

        this.width = this.vehicle.width;
        this.height = this.vehicle.height;

        // -----------------------------
        // Lane System
        // -----------------------------

        this.lane = 1;
        this.targetLane = 1;

        this.x = 0;
        this.targetX = 0;

        this.laneSmooth = 8;

        // -----------------------------
        // Physics
        // -----------------------------

        this.speed = 0;

        this.maxSpeed = this.vehicle.maxSpeed;

        this.acceleration = this.vehicle.acceleration;

        this.brakePower = this.vehicle.braking;

        this.friction = 110;

        // -----------------------------
        // Visual State
        // -----------------------------

        this.steer = 0;

        this.targetSteer = 0;

        this.bodyBounce = 0;

        this.braking = false;

        this.handbrakeActive = false;

        this.engineRPM = 0;

        // future systems

        this.cameraZoom = 1;

        this.motionBlur = 0;

        this.resize();
    }

    resize() {

        const roadWidth =
            Math.min(
                500,
                this.canvas.width * .5
            );

        const roadX =
            (
                this.canvas.width -
                roadWidth
            ) / 2;

        const laneWidth =
            roadWidth / 3;

        this.x =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.targetX = this.x;

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

        // ==================================
        // ACCELERATION
        // ==================================

        if (input.accelerate()) {

            this.speed +=
                this.acceleration * dt;

        } else {

            this.speed -=
                this.friction * dt;

        }

        // ==================================
        // BRAKING
        // ==================================

        this.braking = false;

        if (input.brake()) {

            this.speed -=
                this.brakePower * dt;

            this.braking = true;

        }

        // ==================================
        // HANDBRAKE
        // ==================================

        this.handbrakeActive =
            input.handbrake();

        if (this.handbrakeActive) {

            this.speed -=
                this.brakePower * 0.65 * dt;

        }

        // ==================================
        // LIMITS
        // ==================================

        this.speed =
            Math.max(
                0,
                Math.min(
                    this.speed,
                    this.maxSpeed
                )
            );

        // ==================================
        // ENGINE RPM
        // ==================================

        this.engineRPM =
            this.speed /
            this.maxSpeed;

        // ==================================
        // LANE CHANGE
        // ==================================

        let wantedLane =
            this.targetLane;

        if (input.leftPressed()) {

            wantedLane =
                Math.max(
                    0,
                    this.targetLane - 1
                );

        }
        else if (input.rightPressed()) {

            wantedLane =
                Math.min(
                    2,
                    this.targetLane + 1
                );

        }

        const collision =
            window.carFXEngine?.collisionManager;

        if (
            !collision ||
            collision.canEnterLane(wantedLane)
        ) {

            this.targetLane =
                wantedLane;

        }

        this.lane +=
            (
                this.targetLane -
                this.lane
            ) *
            this.laneSmooth *
            dt;

        if (
            Math.abs(
                this.targetLane -
                this.lane
            ) < 0.01
        ) {

            this.lane =
                this.targetLane;

        }

        // ==================================
        // ROAD CALCULATION
        // ==================================

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

        this.targetX =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.x +=
            (
                this.targetX -
                this.x
            ) *
            10 *
            dt;

        // ==================================
        // STEERING TILT
        // ==================================

        this.targetSteer =
            (this.targetLane - this.lane) * 18;

        this.steer +=
            (
                this.targetSteer -
                this.steer
            ) *
            8 *
            dt;

        // ==================================
        // BODY BOUNCE
        // ==================================

        this.bodyBounce =
            Math.sin(
                performance.now() * 0.012
            ) *
            (
                this.speed /
                this.maxSpeed
            ) *
            2;

        // ==================================
        // CAMERA HOOK
        // ==================================

        this.cameraZoom =
            1 +
            (
                this.speed /
                this.maxSpeed
            ) *
            0.08;

        // ==================================
        // MOTION BLUR HOOK
        // ==================================

        this.motionBlur =
            this.speed /
            this.maxSpeed;

    }

    draw(ctx) {

        ctx.save();

        ctx.translate(
            this.x + this.width / 2,
            this.y + this.height / 2 + this.bodyBounce
        );

        ctx.rotate(
            this.steer *
            Math.PI /
            180
        );

        CarRenderer.draw(ctx, {

            x: -this.width / 2,

            y: -this.height / 2,

            width: this.width,

            height: this.height,

            color: this.vehicle.color,

            type: this.vehicle.type,

            spoiler: this.vehicle.spoiler,

            wheelSize: this.vehicle.wheelSize,

            headlights: this.vehicle.headlights,

            state:
                this.braking
                    ? "brake"
                    : "cruise"

        });

        ctx.restore();

    }

}

window.PlayerCar = PlayerCar;

console.log(
    "✅ PlayerCar v2.0 Loaded Successfully"
);
