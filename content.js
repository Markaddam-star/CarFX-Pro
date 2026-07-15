console.log("✅ content.js loaded");

/**
 * ============================================================
 * CarFX Pro Ultimate
 * content.js v2.5
 *
 * Single Engine Loader + GTA Toggle System
 * ============================================================
 */


(() => {


    if(window.__carfx_loaded__)
        return;


    window.__carfx_loaded__ = true;


    console.log(
        "🚗 CarFX Loaded"
    );



    // ============================================================
    // ENGINE START
    // ============================================================


    console.log(
    "ENGINE CHECK:",
    window.CarFXEngine
);


if(!window.CarFXEngine){

    console.error(
        "❌ CarFXEngine missing"
    );

    return;

}



window.carFXEngine =
    new window.CarFXEngine();


window.carFXEngine.init();


console.log(
    "🚗 CarFX Engine Instance Created"
);



    





    // ============================================================
    // TOGGLE BUTTON
    // ============================================================


    let running = true;



    const toggle =
        document.createElement(
            "div"
        );



    toggle.innerHTML =
        "⏸";



    Object.assign(
        toggle.style,
        {

            position:"fixed",

            top:"20px",

            right:"20px",

            width:"56px",

            height:"56px",

            borderRadius:"50%",

            background:"#ff0000",

            color:"#fff",

            display:"flex",

            alignItems:"center",

            justifyContent:"center",

            fontSize:"24px",

            fontWeight:"bold",

            cursor:"pointer",

            zIndex:"1000001",

            boxShadow:
            "0 0 18px rgba(255,0,0,.6)",

            userSelect:"none"

        }
    );



    document.body.appendChild(
        toggle
    );





    // ============================================================
    // CONTROL PANEL
    // ============================================================


    const panel =
        document.createElement(
            "div"
        );



    Object.assign(
        panel.style,
        {

            position:"fixed",

            top:"90px",

            right:"20px",

            width:"220px",

            background:"#111",

            color:"#fff",

            padding:"15px",

            borderRadius:"12px",

            display:"none",

            zIndex:"1000000",

            boxShadow:
            "0 0 20px rgba(0,0,0,.5)"

        }
    );



    panel.innerHTML = `

        <h3 style="margin-top:0;">
        🚗 CarFX Pro
        </h3>


        <button id="carfx-playpause"
        style="width:100%;padding:10px;margin-bottom:10px;">
        Pause Animation
        </button>


        <button id="carfx-close"
        style="width:100%;padding:10px;">
        Close
        </button>

    `;



    document.body.appendChild(
        panel
    );





    // ============================================================
    // OPEN PANEL
    // ============================================================


    toggle.onclick = () => {


        panel.style.display =
            panel.style.display === "none"
            ?
            "block"
            :
            "none";


    };





    // ============================================================
    // BUTTON EVENTS
    // ============================================================


    const playBtn =
        panel.querySelector(
            "#carfx-playpause"
        );


    const closeBtn =
        panel.querySelector(
            "#carfx-close"
        );



    playBtn.onclick = () => {


        if(running){


            window.carFXEngine.stop();



            playBtn.innerText =
                "Play Animation";


            toggle.innerHTML =
                "▶";


            toggle.style.background =
                "#16a34a";


        }
        else{


           window.carFXEngine.start();



            playBtn.innerText =
                "Pause Animation";


            toggle.innerHTML =
                "⏸";


            toggle.style.background =
                "#ff0000";


        }



        running =
            !running;


    };





    closeBtn.onclick = () => {


        panel.style.display =
            "none";


    };



})();
