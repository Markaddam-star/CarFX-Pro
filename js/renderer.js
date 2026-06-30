/**
 * ============================================================
 * CarFX Pro Ultimate
 * Renderer v0.2
 * ============================================================
 */

class Renderer {

    constructor(scene) {

        this.scene = scene;
        this.frame = 0;

    }

    render(objectManager) {

        if (!objectManager) return;

        this.frame++;

        this.clear();

        objectManager.render(this);

    }

    clear() {

        // Future:
        // Canvas/WebGL rendering آئے گی تو
        // screen یہاں clear ہوگی.

    }

    getFrameCount() {

        return this.frame;

    }

}
