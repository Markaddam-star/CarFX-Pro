/**
 * ============================================================
 * CarFX Pro Ultimate
 * Car Renderer v2.0
 * 100% Procedural Vehicles
 * ============================================================
 */

class CarRenderer {

    static draw(ctx, vehicle) {

        const {
            x,
            y,
            width,
            height,
            color
        } = vehicle;

        ctx.save();

        // ===========================
        // Shadow
        // ===========================

        ctx.fillStyle = "rgba(0,0,0,.22)";
        ctx.beginPath();
        ctx.ellipse(
            x + width / 2,
            y + height * 0.82,
            width * 0.42,
            height * 0.12,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // ===========================
        // Body
        // ===========================

        this.roundRect(
            ctx,
            x,
            y,
            width,
            height,
            width * 0.18
        );

        ctx.fillStyle = color;
        ctx.fill();

        // ===========================
        // Metallic Highlight
        // ===========================

        const g = ctx.createLinearGradient(
            x,
            y,
            x + width,
            y
        );

        g.addColorStop(0, "rgba(255,255,255,.18)");
        g.addColorStop(.5, "rgba(255,255,255,.04)");
        g.addColorStop(1, "rgba(0,0,0,.12)");

        ctx.fillStyle = g;

        this.roundRect(
            ctx,
            x,
            y,
            width,
            height,
            width * 0.18
        );

        ctx.fill();

        // ===========================
        // Roof
        // ===========================

        this.roundRect(
            ctx,
            x + width * .18,
            y + height * .22,
            width * .64,
            height * .42,
            8
        );

        ctx.fillStyle = "#20252b";
        ctx.fill();

        // ===========================
        // Windshield
        // ===========================

        ctx.fillStyle = "#7fcfff";

        this.roundRect(
            ctx,
            x + width * .23,
            y + height * .27,
            width * .54,
            height * .12,
            4
        );

        ctx.fill();

        // Rear Window

        this.roundRect(
            ctx,
            x + width * .23,
            y + height * .48,
            width * .54,
            height * .10,
            4
        );

        ctx.fill();

        // ===========================
        // Wheels
        // ===========================

        ctx.fillStyle = "#111";

        const wheelW = 7;
        const wheelH = 18;

        ctx.fillRect(x - 3, y + 18, wheelW, wheelH);
        ctx.fillRect(x + width - 4, y + 18, wheelW, wheelH);

        ctx.fillRect(x - 3, y + height - 36, wheelW, wheelH);
        ctx.fillRect(x + width - 4, y + height - 36, wheelW, wheelH);

        // ===========================
        // Headlights
        // ===========================

        ctx.fillStyle = "#fff8aa";

        ctx.fillRect(
            x + width * .18,
            y + 2,
            8,
            4
        );

        ctx.fillRect(
            x + width * .62,
            y + 2,
            8,
            4
        );

        // ===========================
        // Tail Lights
        // ===========================

        ctx.fillStyle = "#ff4444";

        ctx.fillRect(
            x + width * .18,
            y + height - 6,
            8,
            4
        );

        ctx.fillRect(
            x + width * .62,
            y + height - 6,
            8,
            4
        );

        ctx.restore();

    }

    static roundRect(ctx, x, y, w, h, r) {

        ctx.beginPath();

        ctx.moveTo(x + r, y);

        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);

        ctx.closePath();

    }

}

window.CarRenderer = CarRenderer;
