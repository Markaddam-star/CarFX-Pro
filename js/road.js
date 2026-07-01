class Road {

    constructor(canvas) {
        this.canvas = canvas;

        this.laneOffset = 0;
        this.speed = 350;

        this.resize();
    }

    resize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.roadWidth = Math.min(500, this.width * 0.5);
        this.x = (this.width - this.roadWidth) / 2;
    }

    update(dt) {

        // 🚗 moving lane lines (GTA motion feel)
        this.laneOffset += this.speed * dt;

        if (this.laneOffset >= 80) {
            this.laneOffset = 0;
        }
    }

    render(ctx) {

        const w = this.canvas.width;
        const h = this.canvas.height;

        // 🌆 SKY GRADIENT (GTA FEEL IMPROVEMENT)
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, "#6ec6ff");
        sky.addColorStop(1, "#b3e5fc");

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // 🌫️ distant fog (depth illusion)
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(0, 0, w, h);

        // 🛣️ ROAD
        const roadW = Math.min(500, w * 0.5);
        const roadX = (w - roadW) / 2;

        ctx.fillStyle = "#2b2b2b";
        ctx.fillRect(roadX, 0, roadW, h);

        // 🟡 road edges (GTA style border)
        ctx.fillStyle = "#111";
        ctx.fillRect(roadX - 8, 0, 8, h);
        ctx.fillRect(roadX + roadW, 0, 8, h);

        // 🚧 LANE LINES (animated)
        ctx.strokeStyle = "#ffffff40";
        ctx.lineWidth = 3;

        for (let i = 0; i < 20; i++) {

            const y = i * 80 + this.laneOffset;

            ctx.beginPath();
            ctx.moveTo(w / 2, y);
            ctx.lineTo(w / 2, y + 40);
            ctx.stroke();
        }

        // 🌫️ road fade (top + bottom depth)
        const fade = ctx.createLinearGradient(0, 0, 0, h);

        fade.addColorStop(0, "rgba(0,0,0,0.25)");
        fade.addColorStop(0.2, "transparent");
        fade.addColorStop(0.8, "transparent");
        fade.addColorStop(1, "rgba(0,0,0,0.25)");

        ctx.fillStyle = fade;
        ctx.fillRect(0, 0, w, h);
    }

    drawLane(ctx, x) {

        for (let y = -80 + this.laneOffset; y < this.height; y += 80) {

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();
        }
    }
}

window.Road = Road;
