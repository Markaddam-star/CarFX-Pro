(() => {
    if (window.__carfx_loaded__) return;
    window.__carfx_loaded__ = true;

    const DEFAULTS = {
        enabled: true,
        interval: 40
    };

    let settings = { ...DEFAULTS };

    // ---------- Overlay ----------
    const overlay = document.createElement("div");
    overlay.id = "carfx-overlay";

    const animation = document.createElement("div");
    animation.id = "carfx-animation";

    overlay.appendChild(animation);

    // ---------- Floating Button ----------
    const toggle = document.createElement("div");
    toggle.id = "carfx-toggle";
    toggle.textContent = "🚗";

    // ---------- Settings Panel ----------
    const panel = document.createElement("div");
    panel.id = "carfx-panel";

    panel.innerHTML = `
        <h3>🚗 CarFX Pro</h3>

        <label>
            <input id="carfx-enabled" type="checkbox">
            Enable Animation
        </label>

        <label>
            Interval (10-300 sec)
        </label>

        <input
            id="carfx-interval"
            type="number"
            min="10"
            max="300">

        <button id="carfx-save">
            Save
        </button>
    `;

    document.documentElement.appendChild(overlay);
    document.documentElement.appendChild(toggle);
    document.documentElement.appendChild(panel);

    // ---------- Open / Close Panel ----------
    toggle.addEventListener("click", () => {
        panel.classList.toggle("open");
    });

    // ---------- Load Settings ----------
    chrome.storage.local.get("carfx", (data) => {

        if (data.carfx) {
            settings = {
                ...DEFAULTS,
                ...data.carfx
            };
        }

        document.getElementById("carfx-enabled").checked =
            settings.enabled;

        document.getElementById("carfx-interval").value =
            settings.interval;

    });

    // ---------- Save Settings ----------
    document
        .getElementById("carfx-save")
        .addEventListener("click", () => {

            settings.enabled =
                document.getElementById("carfx-enabled").checked;

            settings.interval =
                Math.min(
                    300,
                    Math.max(
                        10,
                        Number(
                            document.getElementById("carfx-interval").value
                        ) || 40
                    )
                );

            chrome.storage.local.set({
                carfx: settings
            });

            alert("CarFX settings saved.");
        });

})();
