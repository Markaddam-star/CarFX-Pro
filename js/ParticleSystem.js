/**
 * ============================================================
 * CarFX Pro Ultimate
 * ParticleSystem.js v1.1
 *
 * Cinematic Particle Engine
 * ============================================================
 *
 * Features:
 * ✔ Smoke particles
 * ✔ Tire dust
 * ✔ Gravity
 * ✔ Turbulence
 * ✔ Fade animation
 * ✔ Speed based effects
 * ✔ Future weather ready
 * ============================================================
 */


class ParticleSystem {


    constructor(canvas){

        this.canvas = canvas;

        this.particles = [];

        console.log(
            "💨 ParticleSystem v1.1 Loaded"
        );

    }



    emit(
        x,
        y,
        options = {}
    ){

        const particle = {


            x:x,

            y:y,


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
                "smoke"



        };


        this.particles.push(
            particle
        );


    }



    smoke(x,y){

        for(
            let i=0;
            i<4;
            i++
        ){

            this.emit(
                x,
                y,
                {

                    type:"smoke",

                    size:
                        8 +
                        Math.random()*10,


                    life:
                        0.8 +
                        Math.random()*0.8,


                    vx:
                        (Math.random()-0.5)*1.5,


                    vy:
                        -Math.random()*2,


                    gravity:
                        -0.01

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
                        4 +
                        Math.random()*6,


                    life:
                        0.5,


                    vx:
                        (Math.random()-0.5)*2,


                    vy:
                        -Math.random(),


                    gravity:
                        0.05

                }
            );

        }

    }



    update(dt){


        for(
            let i=this.particles.length-1;
            i>=0;
            i--
        ){

            let p =
                this.particles[i];



            // movement

            p.x += p.vx;

            p.y += p.vy;



            // gravity

            p.vy +=
                p.gravity;



            // turbulence

            p.x +=
                Math.sin(
                    performance.now()*0.005
                ) * 0.2;



            // lifetime

            p.life -= dt;



            p.alpha =
                p.life /
                p.maxLife;



            p.size +=
                dt * 10;



            if(
                p.life <=0
            ){

                this.particles.splice(
                    i,
                    1
                );

            }

        }


    }




    render(ctx){


        for(
            const p of this.particles
        ){


            ctx.save();


            ctx.globalAlpha =
                Math.max(
                    0,
                    p.alpha
                ) * 0.45;



            if(
                p.type === "dust"
            ){

                ctx.fillStyle =
                    "#8a7350";

            }
            else
            {

                ctx.fillStyle =
                    "#777";

            }



            ctx.beginPath();


            ctx.arc(

                p.x,

                p.y,

                p.size,

                0,

                Math.PI*2

            );


            ctx.fill();


            ctx.restore();


        }


    }


}


window.ParticleSystem =
    ParticleSystem;


console.log(
    "✅ ParticleSystem v1.1 Loaded Successfully"
);
