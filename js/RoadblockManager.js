
/**
 * ============================================================
 * CarFX Pro Ultimate
 * RoadblockManager.js - GTA STYLE ROADBLOCK SYSTEM
 * ============================================================
 */

class RoadblockManager {

    constructor(canvas, player, wantedSystem) {

        this.canvas = canvas;
        this.player = player;
        this.wanted = wantedSystem;

        this.blocks = [];

        this.spawnCooldown = 0;

        this.laneCount = 3;
    }

    update(dt) {

        if (!this.player || !this.wanted) return;

        this.spawnCooldown -= dt;

        // =========================
        // SPAWN ROADBLOCKS BASED ON WANTED LEVEL
        // =========================

        if (this.wanted.level >= 2 && this.spawnCooldown <= 0) {

            this.spawnRoadblock();

            this.spawnCooldown = 6; // delay between blocks
        }

        // update blocks
        for (const block of this.blocks) {
            block.update(dt);
        }

        // cleanup far blocks
        this.blocks = this.blocks.filter(b => !b.destroyed);
    }

    spawnRoadblock() {

        const player = this.player;

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneW = roadWidth / 3;

        const baseY = player.y - 700; // 🚧 AHEAD OF PLAYER

        const blockedLane = Math.floor(Math.random() * 3);

        const cars = [];

        for (let lane = 0; lane < this.laneCount; lane++) {

            // leave one lane open randomly
            if (lane === blockedLane) continue;

            const x =
                roadX +
                lane * laneW +
                laneW / 2 - 30;

            cars.push({
                x,
                y: baseY,
                w: 60,
                h: 120,
                lane
            });
        }

        this.blocks.push(new Roadblock(cars));
    }

    render(ctx) {

        for (const block of this.blocks) {
            block.render(ctx);
        }
    }
}

/**
 * SINGLE ROADBLOCK GROUP
 */
class Roadblock {

    constructor(cars) {
        this.cars = cars;
        this.destroyed = false;
    }

    update(dt) {
        // static object, but future: animate police setup
    }

    render(ctx) {

        ctx.save();

        for (const c of this.cars) {

            ctx.fillStyle = "#1e88e5"; // police blue

            ctx.fillRect(c.x, c.y, c.w, c.h);

            // siren
            ctx.fillStyle = "red";
            ctx.fillRect(c.x, c.y - 10, c.w / 2, 6);

            ctx.fillStyle = "white";
            ctx.fillRect(c.x + c.w / 2, c.y - 10, c.w / 2, 6);
        }

        ctx.restore();
    }
}

window.RoadblockManager = RoadblockManager;
