class TrafficLight {

    constructor(x, y, cycleTime = 6) {

        this.x = x;
        this.y = y;

        this.state = "green"; // green | yellow | red
        this.timer = 0;
        this.cycleTime = cycleTime;
    }

    update(dt) {

        this.timer += dt;

        if (this.timer > this.cycleTime) {
            this.timer = 0;
            this.switchState();
        }
    }

    switchState() {

        if (this.state === "green") this.state = "yellow";
        else if (this.state === "yellow") this.state = "red";
        else this.state = "green";
    }

    isRed() {
        return this.state === "red";
    }

    render(ctx) {

        ctx.fillStyle =
            this.state === "green" ? "lime" :
            this.state === "yellow" ? "yellow" :
            "red";

        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

window.TrafficLight = TrafficLight;
