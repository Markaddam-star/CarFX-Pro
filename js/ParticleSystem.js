/**
 * ============================================================
 * CarFX Pro Ultimate
 * ParticleSystem.js v1.2
 *
 * Cinematic Particle Engine
 * ============================================================
 *
 * Features:
 * ✔ Smoke
 * ✔ Dust
 * ✔ Skid smoke
 * ✔ Sparks
 * ✔ Debris
 * ✔ Rain
 * ✔ Gravity
 * ✔ Turbulence
 * ✔ Speed effects
 * ✔ Fade animation
 * ✔ Future weather ready
 * ============================================================
 */


class ParticleSystem {


    constructor(canvas){


        this.canvas = canvas;

        this.particles = [];


        this.maxParticles = 1000;


        this.wind = 0;


        this.enabled = true;



        console.log(
            "💨 ParticleSystem v1.2 Loaded"
        );


    }





    emit(
        x,
        y,
        options={}
    ){


        if(
            this.particles.length >=
            this.maxParticles
        )
        return;



        this.particles.push({


            x,
            y,


            vx:
            options.vx ??
            (Math.random()-0.5)*2,


            vy:
            options.vy ??
            -Math.random()*2,


            size:
            options.size ??
            6,


            life:
            options.life ??
            1,


            maxLife:
            options.life ??
            1,


            alpha:1,


            gravity:
            options.gravity ??
            0.02,


            type:
            options.type ??
            "smoke",


            color:
            options.color ??
            null,


            rotation:
            Math.random()*Math.PI,


            spin:
            (Math.random()-0.5)*0.1


        });


    }






    smoke(x,y,power=1){


        for(
            let i=0;
            i<4*power;
            i++
        ){


            this.emit(
                x,
                y,
                {

                    type:"smoke",

                    size:
                    8+
                    Math.random()*10,


                    life:
                    0.8+
                    Math.random()*0.8,


                    vx:
                    (Math.random()-0.5)*1.5,


                    vy:
                    -Math.random()*2,


                    gravity:-0.01


                }
            );


        }

    }





    dust(x,y){


        for(
            let i=0;
            i<3;
            i++
        ){


            this.emit(
                x,
                y,
                {

                    type:"dust",

                    size:
                    4+
                    Math.random()*6,


                    life:0.5,


                    vx:
                    (Math.random()-0.5)*2,


                    vy:
                    -Math.random(),


                    gravity:0.05


                }
            );

        }

    }





    skid(x,y){


        this.smoke(
            x,
            y,
            2
        );


    }






    sparks(x,y){


        for(
            let i=0;
            i<8;
            i++
        ){


            this.emit(
                x,
                y,
                {


                    type:"spark",


                    size:
                    2+
                    Math.random()*3,


                    life:0.4,


                    vx:
                    (Math.random()-0.5)*6,


                    vy:
                    (Math.random()-1)*5,


                    gravity:0.15,


                    color:
                    "#ffd35c"


                }
            );


        }

    }





    debris(x,y){


        for(
            let i=0;
            i<6;
            i++
        ){


            this.emit(
                x,
                y,
                {


                    type:"debris",


                    size:
                    3+
                    Math.random()*5,


                    life:1,


                    vx:
                    (Math.random()-0.5)*5,


                    vy:
                    -Math.random()*5,


                    gravity:0.2,


                    color:
                    "#555"


                }
            );


        }

    }






    rain(){


        for(
            let i=0;
            i<20;
            i++
        ){


            this.emit(

                Math.random()
                *
                this.canvas.width,


                -10,


                {


                    type:"rain",


                    size:1,


                    life:1,


                    vx:-1,


                    vy:8,


                    gravity:0,


                    color:
                    "#9ecfff"


                }

            );


        }

    }






    update(dt){


        if(!this.enabled)
        return;



        for(
            let i=this.particles.length-1;
            i>=0;
            i--
        ){


            let p =
            this.particles[i];



            p.x +=
            p.vx;


            p.y +=
            p.vy;



            p.vy +=
            p.gravity;



            p.x +=
            this.wind;



            p.x +=
            Math.sin(
                performance.now()*0.005
            )
            *
            0.2;



            p.life -=
            dt;



            p.alpha =
            p.life /
            p.maxLife;



            p.size +=
            dt*10;



            p.rotation +=
            p.spin;



            if(
                p.life<=0
            ){

                this.particles.splice(
                    i,
                    1
                );

            }


        }


    }







    render(ctx){


        if(!this.enabled)
        return;



        for(
            const p of this.particles
        ){


            ctx.save();


            ctx.globalAlpha =
            Math.max(
                0,
                p.alpha
            )
            *
            0.45;



            ctx.fillStyle =
            p.color ||
            (
                p.type==="dust"
                ?
                "#8a7350"
                :
                "#777"
            );



            if(
                p.type==="rain"
            ){


                ctx.fillRect(
                    p.x,
                    p.y,
                    1,
                    12
                );


            }
            else
            {


                ctx.beginPath();


                ctx.arc(
                    p.x,
                    p.y,
                    p.size,
                    0,
                    Math.PI*2
                );


                ctx.fill();


            }



            ctx.restore();


        }


    }


}



window.ParticleSystem =
ParticleSystem;


console.log(
    "✅ ParticleSystem v1.2 Ready"
);
