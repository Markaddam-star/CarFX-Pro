/**
 * ============================================================
 * CarFX Pro Ultimate
 * Background System v2.21 FIXED
 * GTA Parallax + Roadside World Layer
 * ============================================================
 */

class Background {


    constructor(canvas) {


        this.canvas = canvas;


        // PARALLAX

        this.farOffset = 0;
        this.nearOffset = 0;


        this.farSpeed = 15;
        this.nearSpeed = 40;



        // ROAD WORLD OBJECTS

        this.palms = [];
        this.streetLights = [];
        this.decorations = [];



        this.createRoadsideObjects();



        if(window.VehicleFactory){

            this.vehicleFactory =
                window.VehicleFactory;

            this.playerVehicle =
                this.vehicleFactory.player();

        }


    }







    update(dt, playerSpeed = 0){


        const ratio =
            Math.min(
                playerSpeed / 520,
                1
            );



        this.farOffset +=
            (this.farSpeed +
            ratio * 20) * dt;



        this.nearOffset +=
            (this.nearSpeed +
            ratio * 80) * dt;





        // 🌴 PALMS MOVE

        for(const tree of this.palms){


            tree.z -=
                (this.nearSpeed +
                playerSpeed*0.15)
                * dt;



            if(tree.z < -500){

                tree.z = 2500;

            }

        }





        // 💡 LIGHTS MOVE

        for(const light of this.streetLights){


            light.z -=
                (this.nearSpeed +
                playerSpeed*0.12)
                * dt;



            if(light.z < -500){

                light.z = 2500;

            }

        }





        // ROAD DECOR MOVE

        for(const item of this.decorations){


            item.z -=
                (this.nearSpeed +
                playerSpeed*0.1)
                * dt;



            if(item.z < -500){

                item.z = 2500;

            }

        }


    }










    createRoadsideObjects(){



        // 🌴 PALMS


        for(let i=0;i<12;i++){


            this.palms.push({

                side:
                    i%2===0 ? -1 : 1,


                z:
                    i*220 + 300,


                scale:
                    0.7 +
                    Math.random()*0.3

            });


        }





        // 💡 STREET LIGHTS


        for(let i=0;i<14;i++){


            this.streetLights.push({


                side:
                    i%2===0 ? -1 : 1,


                z:
                    i*180 + 200,


                height:
                    100 +
                    Math.random()*30


            });


        }






        // 🏙️ DECOR


        for(let i=0;i<18;i++){


            this.decorations.push({


                side:
                    i%2===0 ? -1 : 1,


                z:
                    i*160 + 150,


                type:
                    i%3


            });


        }


    }










    render(ctx){


        const w =
            this.canvas.width;


        const h =
            this.canvas.height;




        // SKY


        const sky =
            ctx.createLinearGradient(
                0,
                0,
                0,
                h
            );


        sky.addColorStop(
            0,
            "#87CEEB"
        );


        sky.addColorStop(
            1,
            "#d6ecff"
        );



        ctx.fillStyle = sky;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );





        // FOG


        ctx.fillStyle =
            "rgba(255,255,255,0.06)";


        ctx.fillRect(
            0,
            0,
            w,
            h
        );





        // FAR BUILDINGS


        this.drawCityLayer(
            ctx,
            w,
            h,
            this.farOffset,
            180,
            "rgba(20,20,30,0.25)"
        );





        // NEAR BUILDINGS


        this.drawCityLayer(
            ctx,
            w,
            h,
            this.nearOffset,
            120,
            "rgba(10,10,20,0.45)"
        );





        // ROAD


        const roadWidth =
            Math.min(
                500,
                w*0.5
            );


        const roadX =
            (w-roadWidth)/2;





        // SIDEWALKS


        ctx.fillStyle="#8b8b8b";


        ctx.fillRect(
            roadX-45,
            0,
            45,
            h
        );


        ctx.fillRect(
            roadX+roadWidth,
            0,
            45,
            h
        );





        // CURBS


        ctx.fillStyle="#cfcfcf";


        ctx.fillRect(
            roadX-10,
            0,
            10,
            h
        );


        ctx.fillRect(
            roadX+roadWidth,
            0,
            10,
            h
        );



        // OBJECTS LATER

        this.drawRoadsideObjects(
            ctx,
            w,
            h,
            roadX,
            roadWidth
        );



    }
    drawRoadsideObjects(ctx,w,h,roadX,roadWidth){


        this.drawDecor(
            ctx,
            w,
            h,
            roadX,
            roadWidth
        );


        this.drawPalmTrees(
            ctx,
            w,
            h,
            roadX,
            roadWidth
        );


        this.drawStreetLights(
            ctx,
            w,
            h,
            roadX,
            roadWidth
        );


    }








    drawPalmTrees(ctx,w,h,roadX,roadWidth){



        for(const tree of this.palms){



            let perspective =
                Math.max(
                    0.25,
                    1 - tree.z / 2500
                );



            let x;



            if(tree.side === -1){


                x =
                    roadX - 
                    (45 * perspective);


            }
            else{


                x =
                    roadX +
                    roadWidth +
                    (45 * perspective);


            }




            let y =
                h -
                (tree.z * 0.35);




            let scale =
                tree.scale *
                perspective;





            ctx.save();



            ctx.translate(
                x,
                y
            );



            ctx.scale(
                scale,
                scale
            );





            // trunk


            ctx.fillStyle =
                "#8b5a2b";


            ctx.fillRect(
                -5,
                -90,
                10,
                90
            );





            // leaves


            ctx.fillStyle =
                "#228b22";



            for(let i=0;i<5;i++){


                ctx.beginPath();


                ctx.ellipse(
                    0,
                    -100,
                    45,
                    12,
                    i*0.5,
                    0,
                    Math.PI*2
                );


                ctx.fill();


            }





            ctx.restore();


        }


    }










    drawStreetLights(ctx,w,h,roadX,roadWidth){



        for(const light of this.streetLights){



            let perspective =
                Math.max(
                    0.3,
                    1-light.z/2500
                );



            let x;



            if(light.side===-1){


                x =
                    roadX -
                    (20*perspective);


            }
            else{


                x =
                    roadX+
                    roadWidth+
                    (20*perspective);


            }




            let y =
                h -
                (light.z*0.35);






            ctx.strokeStyle =
                "#333";



            ctx.lineWidth =
                4*perspective;



            ctx.beginPath();



            ctx.moveTo(
                x,
                y
            );


            ctx.lineTo(
                x,
                y-light.height*perspective
            );


            ctx.stroke();






            // lamp


            ctx.fillStyle =
                "rgba(255,240,150,0.9)";



            ctx.beginPath();


            ctx.arc(
                x,
                y-light.height*perspective,
                7*perspective,
                0,
                Math.PI*2
            );


            ctx.fill();



        }


    }










    drawDecor(ctx,w,h,roadX,roadWidth){



        for(const item of this.decorations){



            let perspective =
                Math.max(
                    0.3,
                    1-item.z/2500
                );



            let x =
                item.side===-1

                ?

                roadX -
                (40*perspective)

                :

                roadX+
                roadWidth+
                (40*perspective);




            let y =
                h -
                (item.z*0.35);





            ctx.save();



            ctx.translate(
                x,
                y
            );



            ctx.scale(
                perspective,
                perspective
            );




            if(item.type===0){


                // bush


                ctx.fillStyle =
                    "#2f7d32";


                ctx.beginPath();


                ctx.arc(
                    0,
                    0,
                    25,
                    0,
                    Math.PI*2
                );


                ctx.fill();


            }

            else if(item.type===1){


                // sign


                ctx.fillStyle =
                    "#555";


                ctx.fillRect(
                    0,
                    -60,
                    5,
                    60
                );


                ctx.fillStyle =
                    "#1e88e5";


                ctx.fillRect(
                    -25,
                    -85,
                    55,
                    30
                );


            }

            else{


                // barrier


                ctx.fillStyle =
                    "#d6a400";


                ctx.fillRect(
                    0,
                    -15,
                    45,
                    12
                );


            }




            ctx.restore();



        }


    }










    drawCityLayer(ctx,w,h,offset,baseHeight,color){



        ctx.fillStyle=color;



        for(let i=0;i<25;i++){



            let x =
                (i*160-offset)
                %(w+300);



            if(x<-200){

                x+=w+300;

            }





            const bw =
                70+
                (i%3)*20;



            const bh =
                baseHeight+
                (i%5)*45;





            ctx.fillRect(
                x,
                h-bh,
                bw,
                bh
            );





            ctx.fillStyle =
                "rgba(210,230,255,0.18)";



            for(
                let yy=h-bh+15;
                yy<h-20;
                yy+=20
            ){


                for(
                    let xx=x+10;
                    xx<x+bw-10;
                    xx+=16
                ){


                    ctx.fillRect(
                        xx,
                        yy,
                        5,
                        7
                    );


                }

            }



            ctx.fillStyle=color;



        }


    }


}



window.Background = Background;
