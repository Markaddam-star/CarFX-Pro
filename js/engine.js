
/**
 * ============================================================
 * CarFX Pro Ultimate
 * Engine.js - FULL GTA SYSTEM INTEGRATION
 * ============================================================
 */

class CarFXEngine {

    constructor() {

        this.canvas = null;
        this.ctx = null;
        this.hud = null;
        this.audio = null;
        this.particles = null;
        this.running = false;
        this.lastTime = 0;

        // core systems
        this.background = null;
        this.road = null;
        this.player = null;

        this.input = null;

        this.trafficManager = null;
        this.policeManager = null;
        this.wantedSystem = null;
        this.roadblockManager = null;
        this.collisionManager = null;

        // camera
        this.cameraY = 0;
        this.cameraTargetY = 0;

        this.loop = this.loop.bind(this);
    }

   init() {

    console.log("🚗 CarFX GTA Engine Started");

    this.createCanvas();

    this.input = new InputManager();

       // 🔊 AUDIO SYSTEM

if(window.AudioManager){

    this.audio = new AudioManager();

    this.audio.init();

    console.log(
        "🔊 AudioManager Connected"
    );

}


// =========================
// PARTICLE SYSTEM
// =========================

if(window.ParticleSystem){

    this.particles =
        new ParticleSystem(this.canvas);

    console.log(
        "💨 ParticleSystem Connected"
    );

}


// 🔊 AUDIO UNLOCK

document.addEventListener("keydown", () => {

    if(
        this.audio &&
        this.audio.ctx &&
        this.audio.ctx.state === "suspended"
    ){

        this.audio.ctx.resume().then(()=>{

            console.log(
                "🔊 Audio Context Running"
            );

        });

    }

});

    // =========================
    // WORLD SETUP
    // =========================

    this.background = window.Background
        ? new Background(this.canvas)
        : null;

    this.road = window.Road
        ? new Road(this.canvas)
        : null;

    this.player = window.PlayerCar
        ? new PlayerCar(this.canvas)
        : null;

    // =========================
    // HUD
    // =========================

    this.hud = window.HUD
        ? new HUD(this.player)
        : null;

    // =========================
    // SYSTEMS (ORDER MATTERS)
    // =========================

    this.wantedSystem = window.WantedSystem
        ? new WantedSystem()
        : null;

    this.trafficManager = window.TrafficManager
        ? new TrafficManager(this.canvas, this.player)
        : null;

    this.collisionManager = window.CollisionManager
        ? new CollisionManager(
            this.player,
            this.trafficManager
        )
        : null;

    // =========================
// POLICE SYSTEM TEMP DISABLED
// v2.3 Driving Testing
// =========================

this.policeManager = null;

    this.roadblockManager = window.RoadblockManager
        ? new RoadblockManager(
            this.canvas,
            this.player,
            this.wantedSystem
        )
        : null;

    // =========================
    // START LOOP
    // =========================

    this.running = true;
    this.lastTime = performance.now();

    requestAnimationFrame(this.loop);
}

    createCanvas() {

        this.canvas = document.createElement("canvas");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        Object.assign(this.canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: "999990"
        });

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("resize", () => {

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.road?.resize();
            this.player?.resize();
        });
    }

    start() {

    if (this.running) return;


    this.running = true;


    if(this.audio){

        this.audio.resume();

    }


    this.lastTime = performance.now();

    requestAnimationFrame(this.loop);

}

   stop() {

    this.running = false;


    if(this.audio){

        this.audio.pause();

    }


    console.log(
        "🚗 CarFX Engine Stopped"
    );

}

    loop(time) {

        if (!this.running) return;

        const dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(dt) {

        // =========================
        // CORE UPDATES
        // =========================

        this.input?.update();
        this.background?.update(dt);
        this.road?.update(dt);
        this.player?.update(dt);
        this.particles?.update(dt);
// =========================
// AUDIO UPDATE
// =========================

if(
    this.audio &&
    this.player
){

    this.audio.update(
        dt,
        this.player.getEngineData()
    );

}
        this.trafficManager?.update(dt);
        this.collisionManager?.update?.(dt);

        // =========================
        // GTA SYSTEMS
        // =========================

        this.wantedSystem?.update(dt, this.player?.speed || 0);

        this.policeManager?.update(dt);

        this.roadblockManager?.update(dt);

        // =========================
        // CAMERA FOLLOW
        // =========================

        if (this.player) {

            this.cameraTargetY =
                this.player.y - this.canvas.height * 0.55;

            this.cameraY += (this.cameraTargetY - this.cameraY) * 0.10;

            if (this.cameraY < 0) this.cameraY = 0;
        }

        this.hud?.update(dt);
    }

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // =========================
        // WORLD SPACE
        // =========================

        this.background?.render(this.ctx);

        this.ctx.save();
        this.ctx.translate(0, -this.cameraY);

        this.road?.render(this.ctx);

        this.trafficManager?.render(this.ctx);
        this.policeManager?.render(this.ctx);
        this.roadblockManager?.render(this.ctx);

        this.player?.draw(this.ctx);

        this.particles?.render(this.ctx);

        this.ctx.restore();

        // =========================
        // SCREEN EFFECTS
        // =========================

        const fog = this.ctx.createLinearGradient(
            0,
            0,
            0,
            this.canvas.height
        );

        fog.addColorStop(0, "rgba(255,255,255,0.015)");
        fog.addColorStop(1, "rgba(0,0,0,0.22)");

        this.ctx.fillStyle = fog;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // =========================
// HUD
// =========================

this.hud?.render(this.ctx);
    }
}

window.CarFXEngine = CarFXEngine;
