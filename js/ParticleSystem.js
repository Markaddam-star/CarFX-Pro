// ============================================================
// CarFX Pro Ultimate
// ParticleSystem.js v1.0
//
// Cinematic Particle Engine Foundation
// ============================================================

class ParticleSystem {

    constructor(canvas){

        this.canvas = canvas;

        this.particles = [];

        console.log(
            "💨 ParticleSystem v1.0 Loaded"
        );

    }


    emit(
        x,
        y,
        options = {}
    ){

        const particle = {

            x: x,

            y: y,

            vx:
                options.vx ||
                (Math.random() - 0.5) * 2,

            vy:
                options.vy ||
                (Math.random() - 0.5) * 2,


            size:
                options.size ||
                5,


            life:
                options.life ||
                1,


            maxLife:
                options.life ||
                1,


            alpha: 1,


            type:
                options.type ||
                "smoke"

        };


        this.particles.push(
            particle
        );

    }



    smoke(
        x,
        y
    ){

        for(
            let i = 0;
            i < 5;
            i++
        ){

            this.emit(
                x,
                y,
                {

                    type:"smoke",

                    size:
                        5 +
                        Math.random()*8,

                    life:
                        0.8 +
                        Math.random()*0.5,

                    vx:
                        (Math.random()-0.5)*2,

                    vy:
                        -Math.random()*2

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


            p.x +=
                p.vx;


            p.y +=
                p.vy;


            p.life -= dt;


            p.alpha =
                p.life /
                p.maxLife;


            p.size +=
                dt * 8;



            if(
                p.life <= 0
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
                p.alpha * 0.5;


            if(
                p.type === "smoke"
            ){

                ctx.fillStyle =
                    "#777";

            }
            else{

                ctx.fillStyle =
                    "#aaa";

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
    "✅ ParticleSystem v1.0 Loaded Successfully"
);
