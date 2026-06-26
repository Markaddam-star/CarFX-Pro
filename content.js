
// ===============================
// CarFX Pro v0.1
// Foundation
// ===============================

(() => {
    if (window.carFXLoaded) return;
    window.carFXLoaded = true;

    const settings = {
        enabled: true,
        interval: 40
    };

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "carfx-overlay";

    const animation = document.createElement("div");
    animation.id = "carfx-animation";

    overlay.appendChild(animation);

    // Floating Button
    const toggle = document.createElement("div");
    toggle.id = "carfx-toggle";
    toggle.textContent = "🚗";

    // Settings Panel
    const panel = document.createElement("div");
    panel.id = "carfx-panel";

    panel.innerHTML = `
        <h3>CarFX Pro</h3>

        <label>
            Animation Interval (seconds)
        </label>

        <input
            id="carfx-interval"
            type="number"
            min="10"
            max="300"
            value="40">

        <button id="carfx-save">
            Save
        </button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    // Toggle panel
    toggle.onclick = () => {
        panel.classList.toggle("open");
    };

    // Save settings
    panel.querySelector("#carfx-save").onclick = () => {

        settings.interval =
            parseInt(
                document.querySelector("#carfx-interval").value
            ) || 40;

        chrome.storage.local.set({
            carfx: settings
        });

        alert("Settings Saved");
    };

    // Load settings
    chrome.storage.local.get("carfx", data => {

        if (data.carfx) {

            Object.assign(settings, data.carfx);

            document.querySelector("#carfx-interval").value =
                settings.interval;
        }

    });

})();
