/**
 * ============================================================
 * CarFX Pro Ultimate
 * Renderer v2.0.0
 * Cinematic Layer Pipeline
 * ============================================================
 */

class Renderer {

    constructor(scene) {

        this.scene = scene;

        this.frame = 0;
        this.ctx = null;

        this.layers = [
            "background",
            "road",
            "traffic",
            "player",
            "effects",
            "lighting",
            "hud"
        ];

    }

    attach(ctx) {
        this.ctx = ctx;
    }

    beginFrame() {

        if (!this.ctx) return;

        const canvas = this.ctx.canvas;

        this.ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        this.frame++;
    }

    render(objectManager) {

        if (!this.ctx || !objectManager) return;

        this.beginFrame();

        for (const layer of this.layers) {

            if (typeof objectManager.renderLayer === "function") {

                objectManager.renderLayer(layer, this);

            } else {

                objectManager.render(this);

                break;
            }

        }

    }

    getContext() {
        return this.ctx;
    }

    getFrameCount() {
        return this.frame;
    }

}

window.Renderer = Renderer;
