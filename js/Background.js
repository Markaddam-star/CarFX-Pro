/**
 * ============================================================
 * CarFX Pro Ultimate
 * Background System (GTA Parallax)
 * ============================================================
 */

class Background {

   constructor(canvas) {

    this.canvas = canvas;

    this.farOffset = 0;
    this.nearOffset = 0;

    this.farSpeed = 15;
    this.nearSpeed = 40;

    // Vehicle Factory
    this.vehicleFactory = window.VehicleFactory;
    this.playerVehicle = this.vehicleFactory.player();
}
    update(dt) {

        // 🌆 parallax movement
        this.farOffset += this.farSpeed * dt;
        this.nearOffset += this.nearSpeed * dt;
    }

    render(ctx) {

        const w = this.canvas.width;
        const h = this.canvas.height;

        // 🌤 SKY GRADIENT (GTA style)
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, "#87CEEB");
        sky.addColorStop(1, "#d6ecff");

        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        // 🌫 LIGHT ATMOSPHERIC FOG
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(0, 0, w, h);

        // 🌆 FAR BUILDINGS (slow layer)
        this.drawCityLayer(
            ctx,
            w,
            h,
            this.farOffset,
            180,
            "rgba(20,20,30,0.25)"
        );

        // 🌆 NEAR BUILDINGS (fast layer)
        this.drawCityLayer(
            ctx,
            w,
            h,
            this.nearOffset,
            120,
            "rgba(10,10,20,0.45)"
        );
       // Demo Player Vehicle
const car = this.playerVehicle;

const carWidth = car.width;
const carHeight = car.height;

const x = (w - carWidth) / 2;
const y = h - 180;

ctx.fillStyle = car.color;
ctx.fillRect(x, y, carWidth, carHeight);

ctx.fillStyle = "#202020";
ctx.fillRect(x + 6, y + 12, carWidth - 12, 28);

ctx.fillStyle = "#000";
ctx.beginPath();
ctx.arc(x + 12, y + 20, car.wheelSize, 0, Math.PI * 2);
ctx.arc(x + carWidth - 12, y + 20, car.wheelSize, 0, Math.PI * 2);
ctx.arc(x + 12, y + carHeight - 20, car.wheelSize, 0, Math.PI * 2);
ctx.arc(x + carWidth - 12, y + carHeight - 20, car.wheelSize, 0, Math.PI * 2);
ctx.fill();
    }

    drawCityLayer(ctx, w, h, offset, baseHeight, color) {

        ctx.fillStyle = color;

        for (let i = 0; i < 25; i++) {

            let x = (i * 160 - offset) % (w + 300);

            if (x < -200) x += w + 300;

            const height = baseHeight + (i % 4) * 50;

            ctx.fillRect(
                x,
                h - height,
                100,
                height
            );
        }
    }
}

window.Background = Background;
