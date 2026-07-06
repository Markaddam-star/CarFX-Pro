/**
 * ============================================================
 * CarFX Pro
 * Input Manager v1.0
 * ============================================================
 */

class InputManager {

    constructor() {

        this.keys = {};

        this.gameMode = false;

        this.pause = false;

        window.addEventListener("keydown", (e) => {

            this.keys[e.code] = true;

            // Prevent page scrolling while driving
            if (this.gameMode) {

                if (
                    e.code === "ArrowUp" ||
                    e.code === "ArrowDown" ||
                    e.code === "ArrowLeft" ||
                    e.code === "ArrowRight" ||
                    e.code === "Space"
                ) {
                    e.preventDefault();
                }

            }

        });

        window.addEventListener("keyup", (e) => {

            this.keys[e.code] = false;

        });

    }

    isPressed(code) {

        return !!this.keys[code];

    }

    accelerate() {

        return this.isPressed("KeyW") || this.isPressed("ArrowUp");

    }

    brake() {

        return this.isPressed("KeyS") || this.isPressed("ArrowDown");

    }

    left() {

        return this.isPressed("KeyA") || this.isPressed("ArrowLeft");

    }

    right() {

        return this.isPressed("KeyD") || this.isPressed("ArrowRight");

    }

    handbrake() {

        return this.isPressed("Space");

    }

    update() {

        // Toggle Game Mode
        if (this.isPressed("KeyG") && !this._gPressed) {

            this._gPressed = true;

            this.gameMode = !this.gameMode;

            console.log(
                this.gameMode
                    ? "🎮 Game Mode Enabled"
                    : "🎬 Cinematic Mode Enabled"
            );

        }

        if (!this.isPressed("KeyG")) {

            this._gPressed = false;

        }

        // Toggle Pause
        if (this.isPressed("Escape") && !this._escPressed) {

            this._escPressed = true;

            this.pause = !this.pause;

            console.log(
                this.pause
                    ? "⏸ Game Paused"
                    : "▶ Game Resumed"
            );

        }

        if (!this.isPressed("Escape")) {

            this._escPressed = false;

        }

    }

}

window.InputManager = InputManager;
