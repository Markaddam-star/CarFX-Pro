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

    resize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.roadWidth = Math.min(500, this.width * 0.5);
        this.x = (this.canvas.width - this.roadWidth) / 2;
    }

    update(dt) {
        this.laneOffset += this.speed * dt;
        if (this.laneOffset >= 80) this.laneOffset = 0;
    }

    getLaneWidth() {
        return this.roadWidth / 3;
    }

    getLaneCenter(lane) {
        return this.x + lane * this.getLaneWidth() + this.getLaneWidth() / 2;
    }

    render(ctx) {

        const h = this.height;
        const roadX = this.x;
        const roadW = this.roadWidth;

        ctx.save();

        // smooth blend
        ctx.globalAlpha = 0.95;

        // asphalt
        const g = ctx.createLinearGradient(roadX, 0, roadX + roadW, 0);
        g.addColorStop(0, "#181818");
        g.addColorStop(0.5, "#323232");
        g.addColorStop(1, "#181818");

        ctx.fillStyle = g;
        ctx.fillRect(roadX, -50, roadW, h + 100);

        ctx.globalAlpha = 1;

        // noise
        ctx.fillStyle = "rgba(255,255,255,0.025)";
        for (const d of this.asphaltNoise) {
            ctx.fillRect(
                roadX + d.x * roadW,
                d.y * h,
                d.s,
                d.s
            );
        }

        // edges
        ctx.fillStyle = "#0f0f0f";
        ctx.fillRect(roadX - 6, 0, 6, h);
        ctx.fillRect(roadX + roadW, 0, 6, h);

        // lane lines
        ctx.strokeStyle = "#ffd94d";
        ctx.lineWidth = 5;

        const laneW = roadW / 3;

        for (let i = 1; i <= 2; i++) {
            const x = roadX + laneW * i;

            for (let j = 0; j < 20; j++) {
                const y = (j * 80 + this.laneOffset) % (h + 100);

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + 40);
                ctx.stroke();
            }
        }

        ctx.restore();
    }
}

window.Road = Road;
