/**
 * ============================================================
 * PoliceManager.js - GTA POLICE CONTROL SYSTEM
 * ============================================================
 */

class PoliceManager {

    constructor(canvas, player, wantedSystem) {

        this.canvas = canvas;
        this.player = player;
        this.wanted = wantedSystem;

        this.policeCars = [];

        this.spawnCooldown = 0;
    }

    spawnPolice() {

        const car = new PoliceCar(this.canvas, this);

        car.setTarget(this.player);

        this.policeCars.push(car);
    }

    update(dt) {

        const player = this.player;
        if (!player) return;

        this.spawnCooldown -= dt;

        // =========================
        // SPAWN SYSTEM
        // =========================

        if (this.wanted.level > 0 && this.spawnCooldown <= 0) {

            const maxPolice = this.wanted.level * 2;

            if (this.policeCars.length < maxPolice) {
                this.spawnPolice();
            }

            this.spawnCooldown = 2.5;
        }

        // =========================
        // UPDATE POLICE
        // =========================

        for (const p of this.policeCars) {
            p.update(dt, player, this.policeCars);
        }

        // remove dead cars
        this.policeCars = this.policeCars.filter(p => !p.destroyed);
    }

    render(ctx) {

        for (const p of this.policeCars) {
            p.render(ctx);
        }
    }
}

window.PoliceManager = PoliceManager;
