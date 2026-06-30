(() => {

    if (window.__carfx_loaded__) return;
    window.__carfx_loaded__ = true;

    console.log("🚗 CarFX Content Loaded");

    if (typeof CarFXEngine === "undefined") {
        console.error("❌ CarFXEngine not found");
        return;
    }

    try {

        const engine = new CarFXEngine();

        engine.init();

        console.log("✅ CarFX Engine Started");

    } catch (err) {

        console.error("❌ Engine Error:", err);

    }

})();
