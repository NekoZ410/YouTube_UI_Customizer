document.addEventListener("DOMContentLoaded", () => {
    // settings for text customizations
    const textSettings = [
        "text-video-title-home",
        "text-video-title-player",
        "text-video-title-playlist",
        "text-playlist-title-home",
        "text-playlist-title-player",
        "text-playlist-info",
        "text-shorts-title",
        "text-channel-info-player",
        "text-joinMembership-button-player",
    ];

    // initialize text settings
    chrome.storage.local.get(textSettings, (data) => {
        const defaultTextSettings = {};
        textSettings.forEach((id) => {
            defaultTextSettings[id] = data[id] !== undefined ? data[id] : true;
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = defaultTextSettings[id];
            }
        });

        chrome.storage.local.set(defaultTextSettings, () => {
            sendUpdateStylesMessage();
        });
    });

    // update settings
    textSettings.forEach((id) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener("change", (event) => {
                const newSettings = { [id]: event.target.checked };
                chrome.storage.local.set(newSettings, () => {
                    sendUpdateStylesMessage(id);
                });
            });
        }
    });
});
