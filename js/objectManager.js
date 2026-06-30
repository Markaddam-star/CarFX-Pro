
/**
 * ============================================================
 * CarFX Pro Ultimate
 * Object Manager v0.2
 * ============================================================
 */

class ObjectManager {

    constructor() {
        this.objects = [];
    }

    /**
     * Add a new object
     */
    add(object) {

        if (!object) return;

        this.objects.push(object);

        if (typeof object.init === "function") {
            object.init();
        }

    }

    /**
     * Remove object
     */
    remove(object) {

        const index = this.objects.indexOf(object);

        if (index !== -1) {

            if (typeof object.destroy === "function") {
                object.destroy();
            }

            this.objects.splice(index, 1);

        }

    }

    /**
     * Update all objects
     */
    update(delta) {

        for (const object of this.objects) {

            if (typeof object.update === "function") {

                object.update(delta);

            }

        }

    }

    /**
     * Render all objects
     */
    render(renderer) {

        for (const object of this.objects) {

            if (typeof object.render === "function") {

                object.render(renderer);

            }

        }

    }

    /**
     * Destroy everything
     */
    clear() {

        for (const object of this.objects) {

            if (typeof object.destroy === "function") {

                object.destroy();

            }

        }

        this.objects = [];

    }

    /**
     * Total objects
     */
    count() {

        return this.objects.length;

    }

}
