class CarFXEngine {

    constructor(ctx) {
        this.ctx = ctx;
        this.running = false;
        this.lastFrame = 0;

        this.objectManager = null;
        this.renderer = null;

        this.loop = this.loop.bind(this);
    }

    init(objectManager, renderer) {

        console.log("🚗 CarFX Engine Started");

        this.objectManager = objectManager;
        this.renderer = renderer;

        this.start();
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.lastFrame = performance.now();

        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    loop(time) {

        if (!this.running) return;

        const delta = (time - this.lastFrame) / 1000;
        this.lastFrame = time;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(delta) {
        if (this.objectManager) {
            this.objectManager.update(delta);
        }
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.objectManager);
        }
    }
}

window.CarFXEngine = CarFXEngine;
