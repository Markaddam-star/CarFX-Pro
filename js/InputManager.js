/**
 * ============================================================
 * CarFX Pro
 * Input Manager v1.1
 * One Tap Lane Control System
 * ============================================================
 */

class InputManager {

    constructor() {


        this.keys = {};

        this.justPressed = {};

        this.gameMode = false;

        this.pause = false;


        this._gPressed = false;
        this._escPressed = false;



        window.addEventListener("keydown", (e) => {


            // ignore key hold repeat

            if (e.repeat)
                return;



            this.keys[e.code] = true;

            this.justPressed[e.code] = true;




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







    pressedOnce(code) {


        if (this.justPressed[code]) {


            this.justPressed[code] = false;


            return true;


        }


        return false;


    }








    // =========================
    // ONE TAP CONTROLS
    // =========================


    leftPressed() {


        return (

            this.pressedOnce("KeyA") ||

            this.pressedOnce("ArrowLeft")

        );


    }







    rightPressed() {


        return (

            this.pressedOnce("KeyD") ||

            this.pressedOnce("ArrowRight")

        );


    }







    accelerate() {


        return (

            this.isPressed("KeyW") ||

            this.isPressed("ArrowUp")

        );


    }







    brake() {


        return (

            this.isPressed("KeyS") ||

            this.isPressed("ArrowDown")

        );


    }







    left() {


        return (

            this.isPressed("KeyA") ||

            this.isPressed("ArrowLeft")

        );


    }







    right() {


        return (

            this.isPressed("KeyD") ||

            this.isPressed("ArrowRight")

        );


    }







    handbrake() {


        return this.isPressed("Space");


    }







    update() {



        // =========================
        // GAME MODE TOGGLE
        // =========================


        if (
            this.isPressed("KeyG") &&
            !this._gPressed
        ) {


            this._gPressed = true;


            this.gameMode =
                !this.gameMode;



            console.log(

                this.gameMode

                ?

                "🎮 Game Mode Enabled"

                :

                "🎬 Cinematic Mode Enabled"

            );


        }






        if (
            !this.isPressed("KeyG")
        ) {


            this._gPressed = false;


        }








        // =========================
        // PAUSE TOGGLE
        // =========================


        if (
            this.isPressed("Escape") &&
            !this._escPressed
        ) {


            this._escPressed = true;


            this.pause =
                !this.pause;



            console.log(

                this.pause

                ?

                "⏸ Game Paused"

                :

                "▶ Game Resumed"

            );


        }






        if (
            !this.isPressed("Escape")
        ) {


            this._escPressed = false;


        }



    }



}





window.InputManager = InputManager;


console.log(
    "✅ InputManager v1.1 Loaded Successfully"
);
