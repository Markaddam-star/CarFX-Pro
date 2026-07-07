/**
 * ============================================================
 * CarFX Pro Ultimate
 * Car Renderer v2.2
 * GTA Style Procedural Vehicle Visual System
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
            "rgba(0,0,0,.35)";


        ctx.beginPath();

        ctx.ellipse(
            x + width / 2,
            y + height * .84,
            width * .46,
            height * .13,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();





        // =========================
        // BODY TYPE
        // =========================

        switch(type) {


            case "sports":

                this.drawSports(
                    ctx,x,y,width,height,color,spoiler
                );

                break;



            case "suv":

                this.drawSUV(
                    ctx,x,y,width,height,color
                );

                break;



            case "van":

                this.drawVan(
                    ctx,x,y,width,height,color
                );

                break;



            case "pickup":

                this.drawPickup(
                    ctx,x,y,width,height,color
                );

                break;



            case "taxi":

                this.drawTaxi(
                    ctx,x,y,width,height,color
                );

                break;



            case "hatchback":

                this.drawHatchback(
                    ctx,x,y,width,height,color
                );

                break;



            default:

                this.drawSedan(
                    ctx,x,y,width,height,color
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
            height,
            type
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

        if(headlights){

            ctx.fillStyle =
                "#fff2a0";


            ctx.fillRect(
                x+width*.18,
                y+4,
                9,
                4
            );


            ctx.fillRect(
                x+width*.65,
                y+4,
                9,
                4
            );

        }



        if(state==="brake"){


            ctx.fillStyle =
                "#ff2222";


            ctx.fillRect(
                x+width*.18,
                y+height-7,
                9,
                5
            );


            ctx.fillRect(
                x+width*.65,
                y+height-7,
                9,
                5
            );


        }



        ctx.restore();

    }







    static drawSedan(ctx,x,y,w,h,color){


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
            "rgba(0,0,0,.15)";


        ctx.fillRect(
            x+8,
            y+h*.65,
            w-16,
            8
        );


    }







    static drawSUV(ctx,x,y,w,h,color){


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .12
        );


        ctx.fillStyle =
            "rgba(0,0,0,.18)";


        ctx.fillRect(
            x+6,
            y+h*.65,
            w-12,
            10
        );


    }







    static drawSports(ctx,x,y,w,h,color,spoiler){


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .25
        );


        if(spoiler){


            ctx.fillStyle =
                "#111";


            ctx.fillRect(
                x-6,
                y+h*.18,
                w+12,
                5
            );

        }


    }







    static drawHatchback(ctx,x,y,w,h,color){


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .20
        );

    }







    static drawTaxi(ctx,x,y,w,h,color){


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            "#f5c542",
            .18
        );


        // taxi stripe

        ctx.fillStyle =
            "#111";


        ctx.fillRect(
            x,
            y+h*.45,
            w,
            6
        );



        // taxi roof sign

        ctx.fillStyle =
            "#222";


        ctx.fillRect(
            x+w*.32,
            y-8,
            w*.36,
            8
        );


        ctx.fillStyle =
            "#fff";


        ctx.font =
            "bold 7px Arial";


        ctx.fillText(
            "TAXI",
            x+w*.35,
            y-2
        );


    }







    static drawPickup(ctx,x,y,w,h,color){


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
            "rgba(0,0,0,.25)";


        ctx.fillRect(
            x+5,
            y+h*.55,
            w-10,
            h*.25
        );


    }







    static drawVan(ctx,x,y,w,h,color){


        this.body(
            ctx,
            x,
            y,
            w,
            h,
            color,
            .10
        );


        ctx.fillStyle =
            "rgba(0,0,0,.18)";


        ctx.fillRect(
            x+8,
            y+h*.55,
            w-16,
            14
        );


    }







    static body(ctx,x,y,w,h,color,radius){


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







    static drawWindows(ctx,x,y,w,h,type){


        ctx.fillStyle =
            "#18242d";


        this.roundRect(
            ctx,
            x+w*.20,
            y+h*.20,
            w*.60,
            h*.32,
            6
        );


        ctx.fill();



        ctx.fillStyle =
            "rgba(130,210,255,.65)";


        ctx.fillRect(
            x+w*.25,
            y+h*.27,
            w*.45,
            8
        );


    }







    static drawWheels(ctx,x,y,w,h,size){


        ctx.fillStyle =
            "#111";


        ctx.fillRect(
            x-3,
            y+20,
            size,
            18
        );


        ctx.fillRect(
            x+w-4,
            y+20,
            size,
            18
        );


        ctx.fillRect(
            x-3,
            y+h-38,
            size,
            18
        );


        ctx.fillRect(
            x+w-4,
            y+h-38,
            size,
            18
        );


    }







    static roundRect(ctx,x,y,w,h,r){


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
    "✅ CarRenderer v2.2 Loaded Successfully"
);
