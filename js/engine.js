
/**
 * ============================================================
 * CarFX Pro Ultimate
 * Engine Core v0.2
 * ============================================================
 */

class CarFXEngine {

    constructor() {

        this.version = "0.2.0";

        this.running = false;

        this.lastFrame = 0;

        this.delta = 0;

        this.fps = 0;

        this.scene = null;

        this.renderer = null;

        this.objectManager = null;

        this.assets = null;

        this.loop = this.loop.bind(this);

    }

    async init() {

        console.log(`🚗 CarFX Engine v${this.version}`);

        this.assets = new AssetManager();

        await this.assets.load();

        this.scene = new Scene();

        this.objectManager = new ObjectManager();

        this.renderer = new Renderer(this.scene);

        this.start();

    }

    start() {

        if (this.running) return;

        this.running = true;

        this.lastFrame = performance.now();

        requestAnimationFrame(this.loop);

        console.log("✅ Engine Started");

    }

    stop() {

        this.running = false;

        console.log("🛑 Engine Stopped");

    }

    loop(time) {

        if (!this.running) return;

        this.delta = (time - this.lastFrame) / 1000;

        this.lastFrame = time;

        if (this.delta > 0) {

            this.fps = Math.round(1 / this.delta);

        }

        this.update(this.delta);

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

    spawn(entity) {

        this.objectManager.add(entity);

    }

    remove(entity) {

        this.objectManager.remove(entity);

    }

    destroy() {

        this.stop();

        if (this.objectManager) {

            this.objectManager.clear();

        }

    }

}
