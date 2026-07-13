/**
 * ============================================================
 * CarFX Pro Ultimate
 * Road System v3.00
 *
 * GTA STYLE ROAD WORLD FOUNDATION
 *
 * Added:
 * - Better asphalt depth
 * - Road shoulders
 * - Edge lines
 * - Road wear
 * - Asphalt variation
 * - Improved lane markings
 *
 * Compatible:
 * - PlayerCar
 * - TrafficManager
 * - TrafficCar
 * - Engine v2.4
 * ============================================================
 */

class Road {

    constructor(canvas) {

        this.canvas = canvas;

        // ============================
        // MOVEMENT
        // ============================

        this.laneOffset = 0;
        this.speed = 420;


        // ============================
        // ASPHALT DETAILS
        // ============================

        this.asphaltNoise = [];
        this.roadWear = [];


        for (let i = 0; i < 1200; i++) {

            this.asphaltNoise.push({

                x: Math.random(),
                y: Math.random(),
                s: Math.random() * 2 + 1

            });

        }


        for (let i = 0; i < 80; i++) {

            this.roadWear.push({

                x: Math.random(),
                y: Math.random(),
                w: Math.random() * 60 + 20,
                h: Math.random() * 4 + 2

            });

        }


        this.resize();

    }



    resize() {

        this.width = this.canvas.width;
        this.height = this.canvas.height;


        this.roadWidth =
            Math.min(520, this.width * 0.52);


        this.x =
            (this.width - this.roadWidth) / 2;

    }




    update(dt, playerSpeed = 0) {


        const scrollSpeed =
            this.speed + playerSpeed;


        this.laneOffset +=
            scrollSpeed * dt;


        if (this.laneOffset >= 80) {

            this.laneOffset %= 80;

        }

    }





    getLaneWidth() {

        return this.roadWidth / 3;

    }



    getLaneCenter(lane) {

        return (
            this.x +
            lane * this.getLaneWidth() +
            this.getLaneWidth() / 2
        );

    }





    render(ctx) {


        const h = this.height;
        const roadX = this.x;
        const roadW = this.roadWidth;



        ctx.save();



        // ============================
        // ROAD AREA
        // ============================

        ctx.beginPath();

        ctx.rect(
            roadX - 40,
            -200,
            roadW + 80,
            h + 400
        );

        ctx.clip();





        // ============================
        // ROAD SHOULDER
        // ============================


        ctx.fillStyle = "#252525";

        ctx.fillRect(
            roadX - 25,
            -200,
            roadW + 50,
            h + 400
        );





        // ============================
        // ASPHALT BASE
        // ============================


        const gradient =
            ctx.createLinearGradient(
                roadX,
                0,
                roadX + roadW,
                0
            );


        gradient.addColorStop(
            0,
            "#111111"
        );


        gradient.addColorStop(
            0.5,
            "#303030"
        );


        gradient.addColorStop(
            1,
            "#111111"
        );



        ctx.fillStyle = gradient;


        ctx.fillRect(
            roadX,
            -200,
            roadW,
            h + 400
        );







        // ============================
        // ASPHALT NOISE
        // ============================


        ctx.fillStyle =
            "rgba(255,255,255,0.035)";


        for (const n of this.asphaltNoise) {


            ctx.fillRect(

                roadX + n.x * roadW,

                (n.y * h + this.laneOffset)
                % (h + 100),

                n.s,

                n.s

            );

        }







        // ============================
        // ROAD WEAR
        // ============================


        ctx.fillStyle =
            "rgba(0,0,0,0.18)";


        for (const w of this.roadWear) {


            ctx.fillRect(

                roadX + w.x * roadW,

                (w.y * h + this.laneOffset)
                % (h + 100),

                w.w,

                w.h

            );

        }








        // ============================
        // ROAD EDGE LINES
        // ============================


        ctx.fillStyle =
            "#dddddd";


        ctx.fillRect(
            roadX + 8,
            -200,
            4,
            h + 400
        );


        ctx.fillRect(
            roadX + roadW - 12,
            -200,
            4,
            h + 400
        );







        // ============================
        // LANE MARKINGS
        // ============================


        ctx.strokeStyle =
            "#f6d34a";


        ctx.lineWidth = 4;



        const laneW =
            roadW / 3;



        for (let i = 1; i <= 2; i++) {


            const laneX =
                roadX + laneW * i;



            for (let j = 0; j < 22; j++) {


                const y =
                    (
                        j * 80 +
                        this.laneOffset
                    )
                    %
                    (h + 100);



                ctx.beginPath();


                ctx.moveTo(
                    laneX,
                    y
                );


                ctx.lineTo(
                    laneX,
                    y + 38
                );


                ctx.stroke();

            }

        }




        ctx.restore();

    }

}



window.Road = Road;
