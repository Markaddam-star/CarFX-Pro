class CarFXEngine {

    constructor() {
        this.running = false;
        this.lastFrame = 0;
        this.objects = [];
        this.ctx = null;
        this.canvas = null;

        this.loop = this.loop.bind(this);
    }

    init() {

        console.log("🚗 Engine Started");

        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);

        this.canvas.style.position = "fixed";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.zIndex = "999999";

        this.resize();

        this.ctx = this.canvas.getContext("2d");

        window.addEventListener("resize", () => this.resize());

        this.start();

        this.spawnTraffic();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.running = true;
        this.lastFrame = performance.now();
        requestAnimationFrame(this.loop);
    }

    loop(time) {

        if (!this.running) return;

        const delta = (time - this.lastFrame) / 1000;
        this.lastFrame = time;

        this.update(delta);
        this.render();

        requestAnimationFrame(this.loop);
    }

    update(delta) {

        for (const o of this.objects) {
            o.update && o.update(delta);
        }
    }

    render() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // road
        this.ctx.fillStyle = "#222";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (const o of this.objects) {
            o.render && o.render(this.ctx);
        }
    }

    spawnTraffic() {

        for (let i = 0; i < 6; i++) {

            this.objects.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * -500,
                speed: 100 + Math.random() * 200,

                update: function (dt) {
                    this.y += this.speed * dt;
                    if (this.y > window.innerHeight) {
                        this.y = -200;
                        this.x = Math.random() * window.innerWidth;
                    }
                },

                render: function (ctx) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(this.x, this.y, 40, 80);
                }
            });
        }
    }
}

window.CarFXEngine = CarFXEngine;
