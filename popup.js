
document.addEventListener("DOMContentLoaded", () => {

    const enabled = document.getElementById("enabled");
    const interval = document.getElementById("interval");
    const save = document.getElementById("save");

    chrome.storage.local.get("carfx", (data) => {

        if (data.carfx) {
            enabled.checked = data.carfx.enabled;
            interval.value = data.carfx.interval;
        }

    });

    save.addEventListener("click", () => {

        chrome.storage.local.set({

            carfx: {
                enabled: enabled.checked,
                interval: Number(interval.value)
            }

        }, () => {

            alert("Settings Saved!");

        });

    });

});
