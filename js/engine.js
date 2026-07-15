/**
 * ============================================================
 * CarFX Pro Ultimate
 *
 * Engine.js v2.5 CLEAN FINAL
 *
 * GTA SYSTEM CORE
 *
 * RESPONSIBILITY:
 *
 * ✔ Canvas Engine
 * ✔ Main Loop
 * ✔ Update Pipeline
 * ✔ Render Pipeline
 * ✔ System Connections
 * ✔ Camera Foundation
 *
 * Compatible:
 *
 * ✔ PlayerCar v2.2
 * ✔ TrafficManager v3.1
 * ✔ TrafficCar v3.1
 * ✔ CollisionManager v3.1
 * ✔ ParticleSystem v2.0
 * ✔ AudioManager v1.0
 * ✔ HUD v1.1
 *
 * ============================================================
 */


console.log(
    "🚗 CarFX Engine v2.5 CLEAN START"
);





class CarFXEngine {



constructor(){


    // =====================================
    // CORE
    // =====================================

    this.canvas =
        null;


    this.ctx =
        null;



    // =====================================
    // WORLD
    // =====================================

    this.background =
        null;


    this.road =
        null;


    this.player =
        null;




    // =====================================
    // TRAFFIC
    // =====================================

    this.trafficManager =
        null;


    this.collisionManager =
        null;




    // =====================================
    // SUPPORT SYSTEMS
    // =====================================

    this.input =
        null;


    this.particles =
        null;


    this.audio =
        null;


    this.hud =
        null;




    // =====================================
    // OPTIONAL SYSTEMS
    // =====================================

    this.wantedSystem =
        null;


    this.policeManager =
        null;


    this.roadblockManager =
        null;




    // =====================================
    // LOOP
    // =====================================

    this.running =
        false;


    this.lastTime =
        0;




    // =====================================
    // CAMERA
    // =====================================

    this.cameraY =
        0;


    this.cameraTargetY =
        0;




    this.loop =
        this.loop.bind(
            this
        );



}






// ============================================================
// INIT
// ============================================================


init(){


    console.log(
        "🚗 Engine initializing..."
    );



    this.createCanvas();



    // INPUT

    if(
        window.InputManager
    ){

        this.input =
            new InputManager();

    }




    // AUDIO

    if(
        window.AudioManager
    ){

        this.audio =
            new AudioManager();


        if(
            this.audio.init
        ){

            this.audio.init();

        }


    }





    // PARTICLES

    if(
        window.ParticleSystem
    ){

        this.particles =
            new ParticleSystem(
                this.canvas
            );


    }





    // WORLD

    if(
        window.Background
    ){

        this.background =
            new Background(
                this.canvas
            );


    }



    if(
        window.Road
    ){

        this.road =
            new Road(
                this.canvas
            );


    }





    // PLAYER

    if(
        window.PlayerCar
    ){

        this.player =
            new PlayerCar(
                this.canvas,
                this.particles
            );


    }





    console.log(
        "🚗 Engine systems loaded"
    );

// ============================================================
// CONTINUE INIT
// ============================================================

this.loadSystems();


this.start();

}


// ============================================================
// LOAD GAME SYSTEMS
// ============================================================

loadSystems(){



    // =====================================
    // HUD
    // =====================================

    if(
        window.HUD
    ){

        this.hud =
            new HUD(
                this.player
            );

    }





    // =====================================
    // TRAFFIC MANAGER
    // =====================================

    if(
        window.TrafficManager
    ){


        this.trafficManager =
            new TrafficManager(
                this.canvas,
                this.player,
                this.particles
            );


    }





    // =====================================
    // COLLISION MANAGER
    // =====================================

    if(
        window.CollisionManager
    ){


        this.collisionManager =
            new CollisionManager(
                this.player,
                this.trafficManager
            );


    }






    // =====================================
    // OPTIONAL SYSTEMS
    // =====================================


    if(
        window.WantedSystem
    ){

        this.wantedSystem =
            new WantedSystem();

    }




    if(
        window.PoliceManager
    ){

        this.policeManager =
            new PoliceManager(
                this.canvas,
                this.player
            );

    }




    if(
        window.RoadblockManager
    ){

        this.roadblockManager =
            new RoadblockManager(
                this.canvas,
                this.player,
                this.wantedSystem
            );

    }



}





// ============================================================
// START ENGINE
// ============================================================

start(){


    if(
        this.running
    )
        return;



    this.running =
        true;



    this.lastTime =
        performance.now();



    requestAnimationFrame(
        this.loop
    );



    console.log(
        "🚗 CarFX Engine RUNNING"
    );


}






// ============================================================
// STOP ENGINE
// ============================================================

stop(){


    this.running =
        false;



    if(
        this.audio &&
        this.audio.pause
    ){

        this.audio.pause();

    }



    console.log(
        "🚗 Engine stopped"
    );


}






// ============================================================
// MAIN LOOP
// ============================================================

loop(time){


    if(
        !this.running
    )
        return;



    const dt =
        Math.min(
            (
                time -
                this.lastTime
            )
            /
            1000,

            0.05
        );



    this.lastTime =
        time;



    this.update(
        dt
    );



    this.render();



    requestAnimationFrame(
        this.loop
    );


}






// ============================================================
// UPDATE PIPELINE
// ============================================================

update(dt){



    // INPUT

    if(
        this.input &&
        this.input.update
    ){

        this.input.update();

    }






    // PLAYER

    if(
        this.player &&
        this.player.update
    ){
this.player.update(
    dt,
    this.input
);

    }


// BACKGROUND WORLD MOVEMENT

if(
    this.background &&
    this.background.update
){

    this.background.update(
        dt,
        this.player ? this.player.speed : 0
    );

}

// ROAD MOVEMENT

if(
    this.road &&
    this.road.update
){

    this.road.update(
        dt,
        this.player ? this.player.speed : 0
    );

}



    // TRAFFIC

    if(
        this.trafficManager &&
        this.trafficManager.update
    ){

        this.trafficManager.update(
            dt
        );

    }






    // COLLISION

    if(
        this.collisionManager &&
        this.collisionManager.update
    ){

        this.collisionManager.update(
            dt
        );

    }






    // PARTICLES

    if(
        this.particles &&
        this.particles.update
    ){

        this.particles.update(
            dt
        );

    }






   // AUDIO

if(
    this.audio &&
    this.audio.update &&
    this.player &&
    this.player.getEngineData
){

    this.audio.update(
        dt,
        this.player.getEngineData()
    );

}


// CAMERA

this.updateCamera();


}

// ============================================================
// CAMERA UPDATE
// ============================================================

updateCamera(){


    if(
        !this.player ||
        !this.canvas
    )
        return;



    this.cameraTargetY =
        this.player.y -
        this.canvas.height * 0.55;



    this.cameraY +=
        (
            this.cameraTargetY -
            this.cameraY
        )
        *
        0.10;



    if(
        this.cameraY < 0
    ){

        this.cameraY = 0;

    }


}


// ============================================================
// RENDER PIPELINE
// ============================================================

render(){


    if(
        !this.ctx
    )
        return;



    this.ctx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );






    // =====================================
    // BACKGROUND
    // =====================================

    if(
        this.background &&
        this.background.render
    ){

        this.background.render(
            this.ctx
        );

    }






    this.ctx.save();





    // CAMERA

    this.ctx.translate(
        0,
        -this.cameraY
    );






    // ROAD

    if(
        this.road &&
        this.road.render
    ){

        this.road.render(
            this.ctx
        );

    }







    // BACK PARTICLES

    if(
        this.particles &&
        this.particles.renderBehind
    ){

        this.particles.renderBehind(
            this.ctx
        );

    }







    // TRAFFIC

    if(
        this.trafficManager &&
        this.trafficManager.render
    ){

        this.trafficManager.render(
            this.ctx
        );

    }







    // PLAYER

    if(
        this.player
    ){


        if(
            this.player.render
        ){

            this.player.render(
                this.ctx
            );


        }
        else if(
            this.player.draw
        ){

            this.player.draw(
                this.ctx
            );

        }


    }








    // POLICE

    if(
        this.policeManager &&
        this.policeManager.render
    ){

        this.policeManager.render(
            this.ctx
        );

    }







    // ROADBLOCK

    if(
        this.roadblockManager &&
        this.roadblockManager.render
    ){

        this.roadblockManager.render(
            this.ctx
        );

    }







    // FRONT PARTICLES

    if(
        this.particles &&
        this.particles.renderFront
    ){

        this.particles.renderFront(
            this.ctx
        );

    }





    this.ctx.restore();







    // HUD

    if(
        this.hud &&
        this.hud.render
    ){

        this.hud.render(
            this.ctx
        );

    }



}







// ============================================================
// CANVAS CREATION
// ============================================================

createCanvas(){


    this.canvas =
        document.createElement(
            "canvas"
        );



    this.canvas.width =
        window.innerWidth;



    this.canvas.height =
        window.innerHeight;





    Object.assign(
        this.canvas.style,
        {

            position:"fixed",

            left:"0",

            top:"0",

            width:"100vw",

            height:"100vh",

            pointerEvents:"none",

            zIndex:"999990"

        }
    );





    document.body.appendChild(
        this.canvas
    );




    this.ctx =
        this.canvas.getContext(
            "2d"
        );





    window.addEventListener(
        "resize",
        ()=>{


            this.canvas.width =
                window.innerWidth;


            this.canvas.height =
                window.innerHeight;



            if(
                this.trafficManager &&
                this.trafficManager.resize
            ){

                this.trafficManager.resize(
                    this.canvas
                );

            }



        }
    );



}






// ============================================================
// EXPORT
// ============================================================

}



window.CarFXEngine =
    CarFXEngine;



console.log(
    "🚗 CarFX Engine v2.5 CLEAN FINAL LOADED"
);
