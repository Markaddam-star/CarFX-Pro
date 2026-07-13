console.log("🔊 AudioManager START");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * AudioManager.js v1.0
 *
 * Engine Audio Foundation System
 * ============================================================
 */

class AudioManager {

    constructor() {

        this.ctx = null;

        this.master = null;

        this.engineOsc = null;
        this.engineGain = null;

        this.started = false;

        this.volume = 0.35;

        this.engineRPM = 800;
        this.targetRPM = 800;

        this.speed = 0;

        this.braking = false;
        this.skidding = false;
        this.engineStarted = false;

        this.sounds = {

            police: null,
            rain: null,
            wind: null

        };

        console.log("🔊 AudioManager v1.0 Ready");
    }


    init() {

    if (this.started) {
        console.log("🔊 Audio already running");
        return;
    }


        try {

            this.ctx = new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


            this.master = this.ctx.createGain();

            this.master.gain.value = this.volume;


            this.engineOsc = this.ctx.createOscillator();

            this.engineGain = this.ctx.createGain();


            this.engineOsc.type = "sawtooth";

            this.engineOsc.frequency.value = 80;


            this.engineGain.gain.value = 0.05;


            this.engineOsc
                .connect(this.engineGain);


            this.engineGain
                .connect(this.master);


            this.master.connect(this.ctx.destination);


if(!this.engineStarted){

    this.engineOsc.start();

    this.engineStarted = true;

}


this.started = true;


            console.log("🔊 Audio Engine Started");


        } catch(e){

            console.warn(
                "Audio unavailable",
                e
            );

        }

    }



    update(dt, data = {}) {


        if(!this.started) return;


        if(data.speed !== undefined){

            this.speed = data.speed;

        }


        if(data.rpm !== undefined){

            this.targetRPM = data.rpm;

        }


        // smooth RPM

        this.engineRPM +=
            (this.targetRPM - this.engineRPM)
            * 0.08;



        this.updateEngineSound();


    }



    updateEngineSound(){


        if(!this.engineOsc) return;


        let rpmFrequency =
            60 +
            (this.engineRPM / 40);



        let intensity =
            Math.min(
                this.speed / 200,
                1
            );


        this.engineOsc.frequency
        .setTargetAtTime(
            rpmFrequency,
            this.ctx.currentTime,
            0.05
        );


        this.engineGain.gain
        .setTargetAtTime(
            0.03 + intensity * 0.08,
            this.ctx.currentTime,
            0.1
        );


    }




    playBrake(){

        console.log("🛑 Brake sound hook");

        // future brake audio

    }



    playSkid(){

        if(this.skidding)
            return;


        this.skidding = true;


        console.log("🔥 Skid sound hook");


        setTimeout(()=>{

            this.skidding=false;

        },500);


    }



    playPoliceSiren(){

        console.log(
            "🚨 Police siren hook ready"
        );

    }



    playRain(){

        console.log(
            "🌧 Weather audio hook ready"
        );

    }




    setVolume(value){

        this.volume=value;


        if(this.master){

            this.master.gain.value=value;

        }

    }




    mute(){

        this.setVolume(0);

    }




    unmute(){

        this.setVolume(0.35);

    }

    // ===============================
// AUDIO CONTROL
// ===============================

pause(){

    if(!this.ctx) return;

    this.ctx.suspend();

    console.log(
        "🔇 Audio Paused"
    );

}


resume(){

    if(!this.ctx) return;

    this.ctx.resume();

    console.log(
        "🔊 Audio Resumed"
    );

}


stop(){

    if(this.engineOsc){

        try{
            this.engineOsc.stop();
        }
        catch(e){}

        this.engineOsc = null;

    }


    if(this.ctx){

        this.ctx.close();

        this.ctx = null;

    }


    this.master = null;
    this.engineGain = null;

    this.engineStarted = false;
    this.started = false;


    console.log(
        "🔇 Audio Stopped"
    );

}

}



window.AudioManager = AudioManager;


console.log(
    "✅ AudioManager v1.0 Loaded Successfully"
);
