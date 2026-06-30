(() => {

    if (window.__carfx_loaded__) return;
    window.__carfx_loaded__ = true;

    console.log("🚗 CarFX Content Loaded");

    const panel = document.createElement("div");
    panel.innerHTML = "<h3>CarFX Loading...</h3>";
    document.body.appendChild(panel);

    function loadEngine() {

        if (window.__carfx_engine_loaded__) return;
        window.__carfx_engine_loaded__ = true;

        const script = document.createElement("script");

        const url = chrome.runtime.getURL("js/engine.js");

        console.log("🚗 Engine URL:", url);

        script.src = url;

        script.onload = () => {
            console.log("🚗 Engine loaded OK");

            if (window.CarFXEngine) {
                const engine = new window.CarFXEngine();
                engine.init?.();
            } else {
                console.error("❌ CarFXEngine missing on window");
            }
        };

        script.onerror = () => {
            console.error("❌ Engine failed to load:", url);
        };

        document.body.appendChild(script);
    }

    setTimeout(loadEngine, 500);

})();
