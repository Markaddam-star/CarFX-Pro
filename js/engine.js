class CarFXEngine {

    constructor() {

        this.canvas = null;
        this.ctx = null;

        this.running = false;

        this.lastTime = 0;

        this.road = null;
        this.player = null;

        this.loop = this.loop.bind(this);

    }

    init() {

        this.createCanvas();

        this.road = new Road(this.canvas);
        this.player = new PlayerCar(this.canvas);

        this.running = true;

        requestAnimationFrame(this.loop);

    }

    createCanvas() {

        this.canvas = document.createElement("canvas");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.width = "100vw";
        this.canvas.style.height = "100vh";
        this.canvas.style.pointerEvents = "none";
        this.canvas.style.zIndex = "999990";

        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("resize", () => {

            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.road?.resize();
            this.player?.resize();

        });

    }

    loop(time) {

        if (!this.running) return;

        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop);

    }

    update(dt) {

        this.road.update(dt);
        this.player.update(dt);

    }

    render() {

        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.road.render(this.ctx);
        this.player.render(this.ctx);

    }

}

window.CarFXEngine = CarFXEngine;
