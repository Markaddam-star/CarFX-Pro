
/**
 * ============================================================
 * CarFX Pro Ultimate
 * PoliceCar.js - GTA STYLE CHASE AI
 * ============================================================
 */

class PoliceCar {

    constructor(canvas) {

        this.canvas = canvas;

        // 🚓 vehicle style
        this.width = 60;
        this.height = 120;

        // position
        this.x = canvas.width / 2;
        this.y = canvas.height - 200;

        // AI
        this.target = null;

        this.speed = 280;
        this.maxSpeed = 420;

        this.acceleration = 180;

        this.state = "idle";

        // chase behavior
        this.catchDistance = 60;

        this.active = true;
        this.destroyed = false;
    }

    setTarget(player) {
        this.target = player;
    }

    update(dt, player) {

        if (!this.target) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // =========================
        // 1. STATE CONTROL
        // =========================

        if (dist < 800) {
            this.state = "chase";
        }

        // =========================
        // 2. CHASE MOVEMENT
        // =========================

        if (this.state === "chase") {

            // normalize direction
            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);

            // accelerate towards player
            this.speed += this.acceleration * dt;
            this.speed = Math.min(this.speed, this.maxSpeed);

            this.x += dirX * this.speed * dt;
            this.y += dirY * this.speed * dt;
        }

        // =========================
        // 3. CATCH CHECK
        // =========================

        if (dist < this.catchDistance) {

            this.onCatchPlayer();
        }
    }

    onCatchPlayer() {

        console.log("🚓 Player Caught!");

        // reset chase or mark destroyed
        this.destroyed = true;
    }

    render(ctx) {

        ctx.save();

        // 🚨 police color
        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // 🚨 siren effect
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y - 10, this.width / 2, 6);

        ctx.fillStyle = "white";
        ctx.fillRect(this.x + this.width / 2, this.y - 10, this.width / 2, 6);

        ctx.restore();
    }
}

window.PoliceCar = PoliceCar;
