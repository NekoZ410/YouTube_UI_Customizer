document.addEventListener("DOMContentLoaded", () => {
    // settings for utility customizations
    const utilsSettings = ["utilities-shortsToVideo"];

    // initialize utility settings
    chrome.storage.local.get(utilsSettings, (data) => {
        const defaultUtilsSettings = {};
        utilsSettings.forEach((id) => {
            defaultUtilsSettings[id] = data[id] !== undefined ? data[id] : false;
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = defaultUtilsSettings[id];
            }
        });

        chrome.storage.local.set(defaultUtilsSettings);
    });

    // update utility settings
    utilsSettings.forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener("change", (event) => {
                const newSettings = { [id]: event.target.checked };
                chrome.storage.local.set(newSettings);
            });
        }
    });
});