/**
 * CarFX Pro Ultimate
 * Traffic Car System v0.1
 */

export default class TrafficCar {

    constructor(lane, y, speed, img, scene) {
        this.scene = scene;
        this.img = img;

        this.lane = lane;
        this.y = y;
        this.speed = speed;

        this.w = 50;
        this.h = 100;

        this.laneX = this.getLaneX(lane);
    }

    getLaneX(lane) {
        const roadWidth = this.scene.width * 0.6;
        const startX = this.scene.width * 0.2;

        const laneWidth = roadWidth / 3;

        return startX + lane * laneWidth + laneWidth / 2 - this.w / 2;
    }

    update(delta) {
        this.y += this.speed * delta;

        if (this.y > this.scene.height + 150) {
            this.y = -200;
            this.lane = Math.floor(Math.random() * 3);
            this.speed = 100 + Math.random() * 200;
        }

        this.laneX = this.getLaneX(this.lane);
    }

    render(ctx) {

        if (this.img) {
            ctx.drawImage(this.img, this.laneX, this.y, this.w, this.h);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(this.laneX, this.y, this.w, this.h);
        }
    }
}
