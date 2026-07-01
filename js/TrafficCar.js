class TrafficCar {

    constructor(canvas, manager = null) {

        this.canvas = canvas;
        this.manager = manager;

        this.width = 58;
        this.height = 110;

        this.lane = 1;

        this.colors = [
            "#1e88e5",
            "#43a047",
            "#fb8c00",
            "#8e24aa",
            "#757575",
            "#fdd835"
        ];

        // 🚗 SINGLE IMAGE LOAD ONLY
        this.image = new Image();
        this.image.src = "assets/cars/traffic.png";

        // debug (safe inside constructor)
        this.image.onload = () => {
            console.log("Traffic image loaded ✔");
        };

        this.image.onerror = () => {
            console.log("Traffic image FAILED ❌");
        };

        this.reset();
    }

    reset(lane = null, y = null) {

        const roadWidth = Math.min(500, this.canvas.width * 0.5);
        const roadX = (this.canvas.width - roadWidth) / 2;
        const laneWidth = roadWidth / 3;

        if (lane !== null) {
            this.lane = lane;
        } else if (this.manager) {
            this.lane = this.manager.getSafeLane();
        } else {
            this.lane = Math.floor(Math.random() * 3);
        }

        this.x =
            roadX +
            this.lane * laneWidth +
            (laneWidth - this.width) / 2;

        this.y = y !== null ? y : (-this.height - Math.random() * 900);

        this.speed = 180 + Math.random() * 220;

        this.color =
            this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update(dt) {
        this.y += this.speed * dt;

        if (this.y > this.canvas.height + 200) {
            this.reset();
        }
    }

    render(ctx) {

        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.fillRect(
            this.x + 6,
            this.y + this.height - 12,
            this.width - 12,
            12
        );

        if (this.image && this.image.complete && this.image.naturalWidth > 0) {

            ctx.drawImage(
                this.image,
                this.x,
                this.y,
                this.width,
                this.height
            );

            return;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = "#111";
        ctx.fillRect(this.x - 4, this.y + 18, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + 18, 8, 20);
        ctx.fillRect(this.x - 4, this.y + 75, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + 75, 8, 20);
    }
}

window.TrafficCar = TrafficCar;
