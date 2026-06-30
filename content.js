(() => {

    if (window.__carfx_loaded__) return;
    window.__carfx_loaded__ = true;

    console.log("🚗 CarFX Content Script Loaded");

    const DEFAULTS = {
        enabled: true,
        interval: 40
    };

    let settings = { ...DEFAULTS };

    // ============================================================
    // UI CREATE
    // ============================================================

    const overlay = document.createElement("div");
    overlay.id = "carfx-overlay";

    const animation = document.createElement("div");
    animation.id = "carfx-animation";

    overlay.appendChild(animation);

    const toggle = document.createElement("div");
    toggle.id = "carfx-toggle";
    toggle.textContent = "🚗";

    const panel = document.createElement("div");
    panel.id = "carfx-panel";

    panel.innerHTML = `
        <h3>🚗 CarFX Pro</h3>

        <label>
            <input id="carfx-enabled" type="checkbox">
            Enable Animation
        </label>

        <label>Interval (10-300 sec)</label>

        <input id="carfx-interval" type="number" min="10" max="300">

        <button id="carfx-save">Save</button>
    `;

    document.documentElement.appendChild(overlay);
    document.documentElement.appendChild(toggle);
    document.documentElement.appendChild(panel);

    // ============================================================
    // PANEL TOGGLE
    // ============================================================

    toggle.addEventListener("click", () => {
        panel.classList.toggle("open");
    });

    // ============================================================
    // LOAD SETTINGS (SAFE)
    // ============================================================

    if (chrome?.storage?.local) {
        chrome.storage.local.get("carfx", (data) => {

            if (data?.carfx) {
                settings = { ...DEFAULTS, ...data.carfx };
            }

            const enabledEl = document.getElementById("carfx-enabled");
            const intervalEl = document.getElementById("carfx-interval");

            if (enabledEl) enabledEl.checked = settings.enabled;
            if (intervalEl) intervalEl.value = settings.interval;
        });
    }

    // ============================================================
    // SAVE SETTINGS (CRASH SAFE FIXED LINE 99 ISSUE)
    // ============================================================

    window.addEventListener("DOMContentLoaded", () => {

        const saveBtn = document.getElementById("carfx-save");

        if (!saveBtn) return;

        saveBtn.addEventListener("click", () => {

            const enabledEl = document.getElementById("carfx-enabled");
            const intervalEl = document.getElementById("carfx-interval");

            settings.enabled = enabledEl ? enabledEl.checked : true;

            settings.interval = Math.min(
                300,
                Math.max(
                    10,
                    Number(intervalEl?.value) || 40
                )
            );

            // SAFE STORAGE (NO CRASH)
            try {
                chrome.storage?.local?.set?.({
                    carfx: settings
                }, () => {
                    console.log("💾 CarFX settings saved");
                });
            } catch (e) {
                console.warn("Storage failed:", e);
            }

            alert("CarFX settings saved.");
        });

    });

    // ============================================================
    // ENGINE LOADER (SAFE)
    // ============================================================

    function loadEngine() {

        if (window.__carfx_engine_loaded__) return;
        window.__carfx_engine_loaded__ = true;

        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("js/engine.js");

        script.onload = () => {
            console.log("🚗 Engine Loaded");

            if (window.CarFXEngine) {
                const engine = new window.CarFXEngine();
                engine.init?.();
            }
        };

        script.onerror = () => {
            console.error("❌ Engine failed to load");
        };

        document.body.appendChild(script);
    }

    setTimeout(loadEngine, 500);

})();
