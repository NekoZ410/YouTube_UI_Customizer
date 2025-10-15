document.addEventListener("DOMContentLoaded", () => {
    // settings for UI customizations
    const defaultUISettings = {
        "ui-videosPerRow-home-toggle": true,
        "ui-videosPerRow-home": 3,
        "ui-shortsPerRow-home-toggle": true,
        "ui-shortsPerRow-home": 5,
        "ui-postsPerRow-home-toggle": true,
        "ui-postsPerRow-home": 3,
        "ui-newsPerRow-home-toggle": true,
        "ui-newsPerRow-home": 3,
    };

    // initialize UI settings
    const settingIds = Object.keys(defaultUISettings);
    chrome.storage.local.get(settingIds, (savedUISettings) => {
        const currentSettings = {
            ...defaultUISettings,
            ...savedUISettings,
        };

        const initOption = (id) => {
            const enabledCheckbox = document.getElementById(`${id}-toggle`);
            const inputElement = document.getElementById(id);
            if (enabledCheckbox) {
                enabledCheckbox.checked = currentSettings[`${id}-toggle`];
            }
            if (inputElement) {
                inputElement.value = currentSettings[id];
                inputElement.disabled = !currentSettings[`${id}-toggle`];
            }
        };

        initOption("ui-videosPerRow-home");
        initOption("ui-shortsPerRow-home");
        initOption("ui-postsPerRow-home");
        initOption("ui-newsPerRow-home");
    });

    // save and handle changes for UI
    const handleUiChange = (e) => {
        const id = e.target.id;
        let value;

        if (id.endsWith("-toggle")) {
            value = e.target.checked;
            const inputId = id.replace("-toggle", "");
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                inputElement.disabled = !value;
            }
        } else {
            value = parseInt(e.target.value, 10);
            const min = parseInt(e.target.min, 10);
            if (isNaN(value) || value < min) {
                value = defaultUISettings[id];
                e.target.value = value;
            }
        }
        chrome.storage.local.set({ [id]: value });
    };

    const attachListeners = (id) => {
        const enabledCheckbox = document.getElementById(`${id}-toggle`);
        const inputElement = document.getElementById(id);
        const resetButton = document.getElementById(`${id}-reset`);

        if (enabledCheckbox) {
            enabledCheckbox.addEventListener("change", handleUiChange);
        }
        if (inputElement) {
            inputElement.addEventListener("change", handleUiChange);
        }
        if (resetButton) {
            resetButton.addEventListener("click", () => {
                chrome.storage.local.set(
                    {
                        [`${id}-toggle`]: defaultUISettings[`${id}-toggle`],
                        [id]: defaultUISettings[id],
                    },
                    () => {
                        const enabledCheckbox = document.getElementById(`${id}-toggle`);
                        const inputElement = document.getElementById(id);

                        if (enabledCheckbox) {
                            enabledCheckbox.checked = defaultUISettings[`${id}-toggle`];
                        }
                        if (inputElement) {
                            inputElement.value = defaultUISettings[id];
                            inputElement.disabled = !defaultUISettings[`${id}-toggle`];
                        }
                    }
                );
            });
        }
    };

    attachListeners("ui-videosPerRow-home");
    attachListeners("ui-shortsPerRow-home");
    attachListeners("ui-postsPerRow-home");
    attachListeners("ui-newsPerRow-home");
});
