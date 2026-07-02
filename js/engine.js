class CarFXEngine {

    constructor() {

        this.canvas = null;
        this.ctx = null;

        this.running = false;
        this.lastTime = 0;

        this.background = null;
        this.road = null;
        this.player = null;
        this.trafficManager = null;

        // 🎥 CAMERA
        this.cameraY = 0;
        this.cameraTargetY = 0;

        this.loop = this.loop.bind(this);
    }

    init() {

        console.log("🚗 CarFX GTA Engine Started");

        this.createCanvas();

        this.background = window.Background ? new Background(this.canvas) : null;
        this.road = window.Road ? new Road(this.canvas) : null;
        this.player = window.PlayerCar ? new PlayerCar(this.canvas) : null;
        this.trafficManager = window.TrafficManager
            ? new TrafficManager(this.canvas, this.player)
            : null;

        this.running = true;
        this.lastTime = performance.now();

        requestAnimationFrame(this.loop);
    }

    createCanvas() {

        this.canvas = document.createElement("canvas");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        Object.assign(this.canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: "999990"
        });

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("resize", () => {

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.road?.resize();
            this.player?.resize();
        });
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    loop(time) {

        if (!this.running) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(dt) {

        this.background?.update(dt);
        this.road?.update(dt);
        this.player?.update(dt);
        this.trafficManager?.update(dt);

        // 🎥 SMOOTH CAMERA FOLLOW (FIXED)
        if (this.player) {

            this.cameraTargetY =
                this.player.y - this.canvas.height * 0.65;

            this.cameraY += (this.cameraTargetY - this.cameraY) * 0.10;

            if (this.cameraY < 0) this.cameraY = 0;
        }
    }

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 🌆 BACKGROUND (NO CAMERA)
        this.background?.render(this.ctx);

        this.ctx.save();

        // 🎥 WORLD CAMERA
        this.ctx.translate(0, -this.cameraY);

        // 🛣 ROAD FIRST
        this.road?.render(this.ctx);

        // 🚗 TRAFFIC
        this.trafficManager?.render(this.ctx);

        // 🚘 PLAYER LAST (IMPORTANT FIX)
        this.player?.render(this.ctx);

        this.ctx.restore();

        // 🌫 LIGHT FOG (ONLY SCREEN SPACE)
        const fog = this.ctx.createLinearGradient(
            0,
            0,
            0,
            this.canvas.height
        );

        fog.addColorStop(0, "rgba(255,255,255,0.015)");
        fog.addColorStop(1, "rgba(0,0,0,0.22)");

        this.ctx.fillStyle = fog;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

window.CarFXEngine = CarFXEngine;
