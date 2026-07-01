/**
 * ============================================================
 * CarFX Pro Ultimate
 * Engine v2.0
 * ============================================================
 */

class CarFXEngine {

    constructor() {

        this.canvas = null;
        this.ctx = null;

        this.running = false;
        this.lastTime = 0;

        this.road = null;
        this.player = null;
        this.trafficManager = null;

        this.loop = this.loop.bind(this);

    }

    init() {

        console.log("🚗 CarFX Engine Started");

        this.createCanvas();

        this.road = new Road(this.canvas);
        this.player = new PlayerCar(this.canvas);

        // Traffic Manager
        this.trafficManager = new TrafficManager(this.canvas);

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

            if (this.road) this.road.resize();
            if (this.player) this.player.resize();

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

        if (this.road) this.road.update(dt);
        if (this.player) this.player.update(dt);
        if (this.trafficManager) this.trafficManager.update(dt);

    }

    render() {

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        if (this.road) this.road.render(this.ctx);

        if (this.trafficManager)
            this.trafficManager.render(this.ctx);

        if (this.player)
            this.player.render(this.ctx);

    }

}

window.CarFXEngine = CarFXEngine;
