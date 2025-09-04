document.addEventListener("DOMContentLoaded", () => {
    // settings for player customizations
    const defaultPlayerSettings = {
        "player-controls-background-height-enabled": true,
        "player-controls-background-height": 12,
        "player-controls-background-height-unit": "px",
        "player-controls-background-color-enabled": true,
        "player-controls-background-color": "#484848",
        "player-controls-background-colorAlpha": 0.3,
    };

    // initialize player settings
    const settingIds = Object.keys(defaultPlayerSettings);
    chrome.storage.local.get(settingIds, (savedPlayerSettings) => {
        const currentSettings = {
            ...defaultPlayerSettings,
            ...savedPlayerSettings,
        };

        document.getElementById("player-controls-background-height-enabled").checked = currentSettings["player-controls-background-height-enabled"];
        document.getElementById("player-controls-background-height").value = currentSettings["player-controls-background-height"];
        document.getElementById("player-controls-background-height-unit").value = currentSettings["player-controls-background-height-unit"];
        document.getElementById("player-controls-background-color-enabled").checked = currentSettings["player-controls-background-color-enabled"];
        document.getElementById("player-controls-background-color").value = currentSettings["player-controls-background-color"];
        document.getElementById("player-controls-background-colorAlpha").value = currentSettings["player-controls-background-colorAlpha"];
    });

    // save and send message
    const saveAndSendMessage = (id, value) => {
        chrome.storage.local.set({ [id]: value }, () => {
            sendUpdateStylesMessage();
        });
    };

    // listen for changes and update settings
    const heightEnabledCheckbox = document.getElementById("player-controls-background-height-enabled");
    const heightInput = document.getElementById("player-controls-background-height");
    const heightUnitDropdown = document.getElementById("player-controls-background-height-unit");
    const colorEnabledCheckbox = document.getElementById("player-controls-background-color-enabled");
    const colorInput = document.getElementById("player-controls-background-color");
    const alphaInput = document.getElementById("player-controls-background-colorAlpha");

    heightEnabledCheckbox.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, e.target.checked);
    });

    heightInput.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, parseFloat(e.target.value));
    });

    heightUnitDropdown.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, e.target.value);
    });

    colorEnabledCheckbox.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, e.target.checked);
    });

    colorInput.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, e.target.value);
    });

    alphaInput.addEventListener("change", (e) => {
        saveAndSendMessage(e.target.id, parseFloat(e.target.value));
    });

    // reset buttons
    document.getElementById("player-controls-background-height-reset").addEventListener("click", () => {
        chrome.storage.local.set(
            {
                "player-controls-background-height": defaultPlayerSettings["player-controls-background-height"],
                "player-controls-background-height-unit": defaultPlayerSettings["player-controls-background-height-unit"],
            },
            () => {
                document.getElementById("player-controls-background-height").value = defaultPlayerSettings["player-controls-background-height"];
                document.getElementById("player-controls-background-height-unit").value = defaultPlayerSettings["player-controls-background-height-unit"];
                sendUpdateStylesMessage();
            }
        );
    });

    document.getElementById("player-controls-background-color-reset").addEventListener("click", () => {
        chrome.storage.local.set(
            {
                "player-controls-background-color": defaultPlayerSettings["player-controls-background-color"],
                "player-controls-background-colorAlpha": defaultPlayerSettings["player-controls-background-colorAlpha"],
            },
            () => {
                document.getElementById("player-controls-background-color").value = defaultPlayerSettings["player-controls-background-color"];
                document.getElementById("player-controls-background-colorAlpha").value = defaultPlayerSettings["player-controls-background-colorAlpha"];
                sendUpdateStylesMessage();
            }
        );
    });
});
