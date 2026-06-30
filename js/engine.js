/**
 * ============================================================
 * CarFX Pro Ultimate
 * Engine v1.1
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
        this.traffic = [];

        this.loop = this.loop.bind(this);

    }

    init() {

        console.log("🚗 CarFX Engine Started");

        this.createCanvas();

        this.road = new Road(this.canvas);
        this.player = new PlayerCar(this.canvas);

        // Spawn AI Traffic
        for (let i = 0; i < 8; i++) {

            const car = new TrafficCar(this.canvas);

            // Different starting positions
            car.y = -(i * 180);

            this.traffic.push(car);

        }

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

        this.road?.update(dt);
        this.player?.update(dt);

        for (const car of this.traffic) {
            car.update(dt);
        }

    }

    render() {

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Road
        this.road?.render(this.ctx);

        // Traffic
        for (const car of this.traffic) {
            car.render(this.ctx);
        }

        // Player always on top
        this.player?.render(this.ctx);

    }

}

window.CarFXEngine = CarFXEngine;
