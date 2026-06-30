(() => {

    if (window.__carfx_loaded__) return;
    window.__carfx_loaded__ = true;

    console.log("🚗 CarFX Content Loaded");

    // =========================
    // TOGGLE BUTTON
    // =========================
    const toggle = document.createElement("div");
    toggle.innerText = "🚗";
    toggle.style.position = "fixed";
    toggle.style.top = "20px";
    toggle.style.right = "20px";
    toggle.style.zIndex = "999999";
    toggle.style.width = "50px";
    toggle.style.height = "50px";
    toggle.style.background = "red";
    toggle.style.color = "white";
    toggle.style.display = "flex";
    toggle.style.alignItems = "center";
    toggle.style.justifyContent = "center";
    toggle.style.borderRadius = "50%";
    toggle.style.cursor = "pointer";
    document.body.appendChild(toggle);

    // =========================
    // PANEL
    // =========================
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "80px";
    panel.style.right = "20px";
    panel.style.zIndex = "999999";
    panel.style.width = "200px";
    panel.style.padding = "10px";
    panel.style.background = "#111";
    panel.style.color = "white";
    panel.style.display = "none";

    panel.innerHTML = `
        <h3>CarFX Pro</h3>
        <button id="carfx-close">Close</button>
    `;

    document.body.appendChild(panel);

    toggle.onclick = () => {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
    };

    // close button
    setTimeout(() => {
        const closeBtn = document.getElementById("carfx-close");
        if (closeBtn) {
            closeBtn.onclick = () => panel.style.display = "none";
        }
    }, 500);

    // =========================
    // ENGINE START
    // =========================
    if (typeof CarFXEngine === "undefined") {
        console.error("❌ CarFXEngine not found");
        return;
    }

    const engine = new CarFXEngine();
    engine.init();

})();
