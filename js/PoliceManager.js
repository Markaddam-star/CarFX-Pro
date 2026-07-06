

class PoliceManager {

    constructor(canvas, player, wantedSystem) {

        this.canvas = canvas;
        this.player = player;
        this.wanted = wantedSystem;

        this.policeCars = [];

        this.maxPolice = 5;
        this.spawnCooldown = 0;
    }

    update(dt) {

        if (!this.player) return;

        this.spawnCooldown -= dt;

        // =========================
        // 1. SPAWN LOGIC
        // =========================

        if (this.wanted.level > 0 && this.spawnCooldown <= 0) {

            if (this.policeCars.length < this.wanted.level) {

                this.spawnPolice();
            }

            this.spawnCooldown = 3.0;
        }

        // =========================
        // 2. UPDATE POLICE CARS
        // =========================

        for (const police of this.policeCars) {
            police.update(dt, this.player);
        }

        // =========================
        // 3. CLEANUP (OPTIONAL)
        // =========================

        this.policeCars = this.policeCars.filter(p => !p.destroyed);
    }

    spawnPolice() {

        const car = new PoliceCar(this.canvas);

        car.setTarget(this.player);

        this.policeCars.push(car);
    }

    render(ctx) {

        for (const p of this.policeCars) {
            p.render(ctx);
        }
    }
}

window.PoliceManager = PoliceManager;
