/**
 * ============================================================
 * CarFX Pro Ultimate
 * PoliceCar.js - FULL GTA CHASE SYSTEM
 * ============================================================
 */

class PoliceCar {

    constructor(canvas, manager = null) {

        this.canvas = canvas;
        this.manager = manager;

        this.width = 60;
        this.height = 120;

        this.x = canvas.width / 2;
        this.y = canvas.height - 300;

        this.speed = 260;
        this.maxSpeed = 480;
        this.acceleration = 220;

        this.target = null;

        this.state = "idle";

        this.catchDistance = 55;

        this.destroyed = false;

        this.pitCooldown = 0;
    }

    setTarget(player) {
        this.target = player;
    }

    update(dt, player, policeCars = []) {

        if (!this.target) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // =========================
        // 1. ACTIVATE CHASE
        // =========================

        if (dist < 900) {
            this.state = "chase";
        }

        // =========================
        // 2. MOVEMENT
        // =========================

        if (this.state === "chase") {

            this.speed += this.acceleration * dt;
            this.speed = Math.min(this.speed, this.maxSpeed);

            const dirX = dx / (dist || 1);
            const dirY = dy / (dist || 1);

            this.x += dirX * this.speed * dt;
            this.y += dirY * this.speed * dt;
        }

        // =========================
        // 3. PIT SYSTEM
        // =========================

        this.pitCooldown -= dt;

        if (dist < 180 && this.pitCooldown <= 0) {

            this.tryPIT();
            this.pitCooldown = 4;
        }

        // =========================
        // 4. CATCH PLAYER
        // =========================

        if (dist < this.catchDistance) {
            this.catchPlayer();
        }

        // =========================
        // 5. AVOID STACKING
        // =========================

        this.avoidPolice(policeCars);
    }

    tryPIT() {

        console.log("🚓 PIT MANEUVER!");

        if (this.target) {
            this.target.speed *= 0.6;
        }
    }

    avoidPolice(policeCars) {

        for (const p of policeCars) {

            if (p === this) continue;

            const dx = p.x - this.x;
            const dy = p.y - this.y;

            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
                this.x -= dx * 0.05;
                this.y -= dy * 0.05;
            }
        }
    }

    catchPlayer() {

        console.log("🚓 PLAYER CAUGHT!");

        this.destroyed = true;

        if (this.target) {
            this.target.speed *= 0.3;
        }
    }

    render(ctx) {

        ctx.save();

        ctx.fillStyle = "blue";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // siren
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y - 8, this.width / 2, 6);

        ctx.fillStyle = "white";
        ctx.fillRect(this.x + this.width / 2, this.y - 8, this.width / 2, 6);

        ctx.restore();
    }
}

window.PoliceCar = PoliceCar;
