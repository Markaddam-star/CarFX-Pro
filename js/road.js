class Road {

    constructor(canvas) {
        this.canvas = canvas;

        this.laneOffset = 0;
        this.speed = 420;

        this.asphaltNoise = [];

        for (let i = 0; i < 900; i++) {
            this.asphaltNoise.push({
                x: Math.random(),
                y: Math.random(),
                s: Math.random() * 2 + 1
            });
        }

        this.resize();
    }

    getLaneWidth() {
        return this.roadWidth / 3;
    }

    getLaneCenter(lane) {
        const laneWidth = this.getLaneWidth();

        return (
            this.x +
            lane * laneWidth +
            laneWidth / 2
        );
    }

    getLaneX(lane, vehicleWidth) {
        return (
            this.getLaneCenter(lane) -
            vehicleWidth / 2
        );
    }

    resize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.roadWidth = Math.min(500, this.width * 0.5);
        this.x = (this.width - this.roadWidth) / 2;
    }

    update(dt) {
        this.laneOffset += this.speed * dt;

        if (this.laneOffset >= 80) {
            this.laneOffset = 0;
        }
    }

    render(ctx) {

        const w = this.canvas.width;
        const h = this.canvas.height;

        // 🌤 SKY
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, "#081321");
        sky.addColorStop(0.45, "#17304f");
        sky.addColorStop(1, "#2c2c2c");

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // 🌫 Fog
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(0, 0, w, h);

        const roadW = this.roadWidth;
        const roadX = this.x;

        // Asphalt
        const asphalt = ctx.createLinearGradient(
            roadX,
            0,
            roadX + roadW,
            0
        );

        asphalt.addColorStop(0, "#181818");
        asphalt.addColorStop(0.5, "#323232");
        asphalt.addColorStop(1, "#181818");

        ctx.fillStyle = asphalt;
        ctx.fillRect(roadX, 0, roadW, h);

        // Asphalt Noise
        ctx.fillStyle = "rgba(255,255,255,0.025)";

        for (const dot of this.asphaltNoise) {
            ctx.fillRect(
                roadX + dot.x * roadW,
                dot.y * h,
                dot.s,
                dot.s
            );
        }

        // Road edges
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(roadX - 6, 0, 6, h);
        ctx.fillRect(roadX + roadW, 0, 6, h);

        // Lane lines
        ctx.strokeStyle = "#ffd94d";
        ctx.lineWidth = 5;

        this.drawLane(ctx, roadX + roadW / 3);
        this.drawLane(ctx, roadX + roadW * 2 / 3);

        // Vignette
        const fade = ctx.createLinearGradient(0, 0, 0, h);

        fade.addColorStop(0, "rgba(0,0,0,0.35)");
        fade.addColorStop(0.2, "transparent");
        fade.addColorStop(0.8, "transparent");
        fade.addColorStop(1, "rgba(0,0,0,0.35)");

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
