
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

        objectManager.render(this);

    }

    clear() {

        // Future:
        // Canvas rendering آئے گی تو یہاں screen clear ہوگی.
    }

}
