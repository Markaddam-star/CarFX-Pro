
/**
 * ============================================================
 * CarFX Pro Ultimate
 * HUD.js - GTA Style Driving HUD v1.0
 * ============================================================
 */

class HUD {

    constructor(player) {

        this.player = player;

        this.distance = 0;

    }

    update(dt) {

        if (!this.player) return;

        this.distance += this.player.speed * dt;

    }

    render(ctx) {

        if (!this.player) return;

        const speed =
            Math.round(this.player.speed);

        const gear =
            speed === 0 ? "P" : "D";

        // =========================
        // PANEL
        // =========================

        ctx.save();

        ctx.fillStyle = "rgba(0,0,0,.45)";

        this.roundRect(
            ctx,
            25,
            ctx.canvas.height - 135,
            185,
            105,
            12
        );

        ctx.fill();

        // =========================
        // SPEED
        // =========================

        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 38px Arial";

        ctx.fillText(
            speed,
            40,
            ctx.canvas.height - 72
        );

        ctx.font = "16px Arial";

        ctx.fillStyle = "#bbbbbb";

        ctx.fillText(
            "KM/H",
            120,
            ctx.canvas.height - 72
        );

        // =========================
        // GEAR
        // =========================

        ctx.fillStyle = "#00ff88";

        ctx.font = "bold 18px Arial";

        ctx.fillText(
            "GEAR : " + gear,
            40,
            ctx.canvas.height - 42
        );

        // =========================
        // DISTANCE
        // =========================

        ctx.fillStyle = "#ffffff";

        ctx.font = "15px Arial";

        ctx.fillText(
            "DIST : " +
            Math.floor(this.distance) +
            " m",
            40,
            ctx.canvas.height - 18
        );

        ctx.restore();

    }

    roundRect(ctx, x, y, w, h, r) {

        ctx.beginPath();

        ctx.moveTo(x + r, y);

        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);

        ctx.closePath();

    }

}

window.HUD = HUD;

console.log("✅ HUD v1.0 Loaded");
