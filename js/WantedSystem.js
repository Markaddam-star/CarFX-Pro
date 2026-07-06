

class WantedSystem {

    constructor() {

        this.level = 0; // 0–5
        this.timer = 0;

        this.speedThreshold = 260; // player speed trigger
        this.lastIncrease = 0;
    }

    update(dt, playerSpeed) {

        this.timer += dt;

        // =========================
        // 1. SPEED CHECK
        // =========================

        if (playerSpeed > this.speedThreshold) {
            this.increaseWanted(1);
        }

        // =========================
        // 2. NATURAL DECAY
        // =========================

        if (this.timer > 8) {
            this.decreaseWanted(1);
            this.timer = 0;
        }
    }

    increaseWanted(amount = 1) {

        this.level = Math.min(5, this.level + amount);
        this.lastIncrease = Date.now();
    }

    decreaseWanted(amount = 1) {

        this.level = Math.max(0, this.level - amount);
    }

    reset() {
        this.level = 0;
    }

    isActive() {
        return this.level > 0;
    }
}

window.WantedSystem = WantedSystem;
