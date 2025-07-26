// wait DOM init
document.addEventListener("DOMContentLoaded", () => {
    // settings
    const settings = [
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

    // display version from manifest
    const manifest = chrome.runtime.getManifest();
    document.getElementById("version").textContent = manifest.version;
    // console.log("Extension version:", manifest.version);

    // initialize default, update checkboxes
    chrome.storage.local.get(settings, (data) => {
        const defaultSettings = {};
        settings.forEach((id) => {
            defaultSettings[id] = data[id] !== undefined ? data[id] : true;
            document.getElementById(id).checked = defaultSettings[id];
        });
        // console.log("Loaded settings:", defaultSettings);
        chrome.storage.local.set(defaultSettings, () => {
            // console.log("Initialized default settings");

            // send message to apply initial styles
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]?.url.includes("youtube.com")) {
                    chrome.tabs.sendMessage(tabs[0].id, { message: "update_styles" }, (response) => {
                        console.log("Initial message sent to content script:", response);
                    });
                } else {
                    // console.log("Not on YouTube, no initial message sent");
                }
            });
        });
    });

    // update settings
    settings.forEach((id) => {
        document.getElementById(id).addEventListener("change", (event) => {
            const newSettings = { [id]: event.target.checked };
            // console.log(`Updating ${id} to ${event.target.checked}`);
            chrome.storage.local.set(newSettings, () => {
                // console.log(`Saved ${id}: ${event.target.checked}`);

                // send message to update styles
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]?.url.includes("youtube.com")) {
                        chrome.tabs.sendMessage(tabs[0].id, { message: "update_styles", changedId: id }, (response) => {
                            console.log("Message sent to content script:", response);
                        });
                    } else {
                        // console.log("Not on YouTube, no message sent");
                    }
                });
            });
        });
    });
});
