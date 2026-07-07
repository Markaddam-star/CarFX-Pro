/**
 * ============================================================
 * CarFX Pro Ultimate
 * Car Renderer v2.1
 * Procedural Vehicle Visual System
 * ============================================================
 */

class CarRenderer {


    static draw(ctx, vehicle) {


        const {
            x,
            y,
            width,
            height,
            color,

            type = "sedan",

            spoiler = false,
            headlights = true,

            wheelSize = 8,

            state = "cruise"

        } = vehicle;



        ctx.save();



        // =========================
        // SHADOW
        // =========================

        ctx.fillStyle =
            "rgba(0,0,0,.28)";


        ctx.beginPath();


        ctx.ellipse(

            x + width / 2,

            y + height * 0.82,

            width * 0.45,

            height * 0.12,

            0,

            0,

            Math.PI * 2

        );


        ctx.fill();





        // =========================
        // VEHICLE BODY
        // =========================

        switch(type) {


            case "suv":

                this.drawSUV(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

                break;



            case "sports":

                this.drawSports(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color,
                    spoiler
                );

                break;



            case "hatchback":

                this.drawHatchback(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

                break;



            case "taxi":

                this.drawTaxi(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

                break;



            case "pickup":

                this.drawPickup(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

                break;



            case "van":

                this.drawVan(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

                break;



            default:


                this.drawSedan(
                    ctx,
                    x,
                    y,
                    width,
                    height,
                    color
                );

        }







        // =========================
        // WINDOWS
        // =========================

        this.drawWindows(
            ctx,
            x,
            y,
            width,
            height
        );





        // =========================
        // WHEELS
        // =========================

        this.drawWheels(
            ctx,
            x,
            y,
            width,
            height,
            wheelSize
        );





        // =========================
        // LIGHTS
        // =========================

        if(headlights) {


            ctx.fillStyle =
                "#fff4a3";


            ctx.fillRect(
                x + width*.2,
                y + 3,
                8,
                4
            );


            ctx.fillRect(
                x + width*.65,
                y + 3,
                8,
                4
            );

        }



        // brake effect

        if(state === "brake") {


            ctx.fillStyle =
                "#ff2222";


            ctx.fillRect(
                x + width*.2,
                y + height - 6,
                8,
                5
            );


            ctx.fillRect(
                x + width*.65,
                y + height - 6,
                8,
                5
            );

        }



        ctx.restore();

    }







    static drawSedan(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .18
        );

    }







    static drawSUV(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .12
        );


    }







    static drawSports(
        ctx,
        x,
        y,
        w,
        h,
        color,
        spoiler
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .25
        );


        if(spoiler) {


            ctx.fillStyle =
                "#111";


            ctx.fillRect(
                x-4,
                y+h*.18,
                w+8,
                4
            );

        }


    }







    static drawHatchback(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .2
        );

    }







    static drawTaxi(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .18
        );


        ctx.fillStyle =
            "#222";


        ctx.fillRect(
            x+w*.35,
            y-5,
            w*.3,
            6
        );

    }







    static drawPickup(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .15
        );


        ctx.fillStyle =
            "rgba(0,0,0,.2)";


        ctx.fillRect(
            x+5,
            y+h*.55,
            w-10,
            h*.25
        );

    }







    static drawVan(
        ctx,
        x,
        y,
        w,
        h,
        color
    ) {


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .1
        );

    }







    static body(
        ctx,
        x,
        y,
        w,
        h,
        color,
        radius
    ) {


        this.roundRect(
            ctx,
            x,
            y,
            w,
            h,
            w*radius
        );


        ctx.fillStyle =
            color;


        ctx.fill();

    }







    static drawWindows(
        ctx,
        x,
        y,
        w,
        h
    ) {


        ctx.fillStyle =
            "#20252b";


        this.roundRect(
            ctx,
            x+w*.2,
            y+h*.22,
            w*.6,
            h*.35,
            6
        );


        ctx.fill();


        ctx.fillStyle =
            "#7fcfff";


        ctx.fillRect(
            x+w*.25,
            y+h*.28,
            w*.5,
            h*.08
        );

    }







    static drawWheels(
        ctx,
        x,
        y,
        w,
        h,
        size
    ) {


        ctx.fillStyle =
            "#111";


        ctx.fillRect(
            x-3,
            y+18,
            size,
            18
        );


        ctx.fillRect(
            x+w-4,
            y+18,
            size,
            18
        );


        ctx.fillRect(
            x-3,
            y+h-36,
            size,
            18
        );


        ctx.fillRect(
            x+w-4,
            y+h-36,
            size,
            18
        );

    }







    static roundRect(
        ctx,
        x,
        y,
        w,
        h,
        r
    ) {


        ctx.beginPath();


        ctx.moveTo(
            x+r,
            y
        );


        ctx.arcTo(
            x+w,
            y,
            x+w,
            y+h,
            r
        );


        ctx.arcTo(
            x+w,
            y+h,
            x,
            y+h,
            r
        );


        ctx.arcTo(
            x,
            y+h,
            x,
            y,
            r
        );


        ctx.arcTo(
            x,
            y,
            x+w,
            y,
            r
        );


        ctx.closePath();

    }


}



window.CarRenderer = CarRenderer;


console.log(
    "✅ CarRenderer v2.1 Loaded Successfully"
);
