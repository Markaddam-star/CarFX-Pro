class Renderer {

    constructor(scene) {

        this.scene = scene;
        this.frame = 0;

        this.ctx = null;
    }

    attach(ctx) {
        this.ctx = ctx;
    }

    render(objectManager) {

        if (!objectManager || !this.ctx) return;

        this.frame++;

        this.clear();

        objectManager.render(this);
    }

    clear() {

        const ctx = this.ctx;
        const canvas = ctx.canvas;

        // 🧼 clean frame every render
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    getFrameCount() {
        return this.frame;
    }
}

window.Renderer = Renderer;
