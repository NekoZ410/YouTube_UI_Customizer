// settings
const styleSettings = {
    "text-video-title-home": {
        styleId: "text-video-title-home-display-full",
        css: `#video-title.ytd-video-renderer,
            #video-title.ytd-compact-video-renderer,
            #video-title.ytd-rich-grid-media,
            #video-title.ytd-rich-grid-slim-media,
            #video-title.ytd-grid-playlist-renderer,
            #video-title.ytd-reel-item-renderer {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-video-title-player": {
        styleId: "text-video-title-player-display-full",
        css: `yt-lockup-view-model.ytd-item-section-renderer .yt-lockup-metadata-view-model-wiz__title {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-video-title-playlist": {
        styleId: "text-video-title-playlist-display-full",
        css: `#video-title.ytd-playlist-panel-video-renderer {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-playlist-title-home": {
        styleId: "text-playlist-title-home-display-full",
        css: `ytd-rich-item-renderer yt-lockup-view-model.ytd-rich-item-renderer .yt-lockup-metadata-view-model-wiz__title {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-playlist-title-player": {
        styleId: "text-playlist-title-player-display-full",
        css: `.ytd-playlist-panel-renderer[modern-panels]:not([hide-header-text]),
            .title.ytd-playlist-panel-renderer {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-playlist-info": {
        styleId: "text-playlist-info-display-full",
        css: `.yt-content-metadata-view-model-wiz--medium-text,
            .yt-content-metadata-view-model-wiz__metadata-text {
                white-space: unset !important;
            }`,
    },
    "text-shorts-title": {
        styleId: "text-shorts-title-display-full",
        css: `.shortsLockupViewModelHostMetadataTitle {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-channel-info-player": {
        styleId: "text-channel-info-player-display-full",
        css: `#upload-info {
                margin-right: 5px !important;
                overflow: unset !important;
                flex: 0 1 auto !important;
                justify-content: center !important;
                display: flex !important;
            }
            #upload-info #owner-sub-count {
                flex-shrink: 0;
                white-space: nowrap;
            }`,
    },
    "text-joinMembership-button-player": {
        styleId: "text-joinMembership-button-player-display-full",
        css: `#owner {
                flex-direction: row !important;
                align-items: center !important;
                gap: 10px !important;
                display: flex !important;
            }
            ytd-video-owner-renderer,
            #subscribe-button {
                flex: 0 0 auto !important;
            }`,
    },
};

// global: inject or update a custom style into DOM
function injectCustomStyle(styleId, cssRules) {
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
        existingStyle.remove();
        // console.log(`Removed style: ${styleId}`);
    }

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = cssRules;
    (document.head || document.documentElement).appendChild(styleElement);
    // console.log(`Injected style: ${styleId}`);
}

// global: remove all styles from DOM
function removeAllStyles() {
    Object.values(styleSettings).forEach(({ styleId }) => {
        const style = document.getElementById(styleId);
        if (style) {
            style.remove();
        }
    });
}

// global: apply styles based on settings
function applyStyles(settings) {
    // console.log("Applying styles with settings:", settings);
    removeAllStyles();
    Object.keys(styleSettings).forEach((id) => {
        if (settings[id] === true) {
            const { styleId, css } = styleSettings[id];
            injectCustomStyle(styleId, css);
        }
    });
}

// global: init and caching settings on load
let cachedSettings = {};
chrome.storage.local.get(Object.keys(styleSettings), (settings) => {
    cachedSettings = Object.keys(styleSettings).reduce(
        (acc, id) => ({
            ...acc,
            [id]: settings[id] !== undefined ? settings[id] : true,
        }),
        {}
    );
    console.log("Initial settings:", cachedSettings); // init settings

    // check if settings have changed
    chrome.storage.local.get(Object.keys(styleSettings), (existing) => {
        if (JSON.stringify(existing) !== JSON.stringify(cachedSettings)) {
            chrome.storage.local.set(cachedSettings, () => {
                console.log("Saved updated settings");
                applyStyles(cachedSettings);
            });
        } else {
            applyStyles(cachedSettings);
        }
    });
});

// global: listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
        Object.keys(changes).forEach((key) => {
            cachedSettings[key] = changes[key].newValue;
        });
        // console.log("Storage changed, updating styles with:", cachedSettings);
        applyStyles(cachedSettings);
    }
});

// global: listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "update_styles") {
        // check changedId error
        if (request.changedId && !styleSettings[request.changedId]) {
            console.error(`Invalid changedId: ${request.changedId}`);
            // sendResponse({ status: "Error: Invalid style ID" });
            return true;
        }

        // update style when changedId is provided
        if (request.changedId) {
            chrome.storage.local.get([request.changedId], (settings) => {
                cachedSettings[request.changedId] = settings[request.changedId];
                console.log(`Updating style for ${request.changedId}:`, settings); // only keep update logs for clearness
                const { styleId, css } = styleSettings[request.changedId];
                if (settings[request.changedId] === true) {
                    injectCustomStyle(styleId, css);
                } else {
                    const style = document.getElementById(styleId);
                    if (style) style.remove();
                }
                // sendResponse({ status: "Style updated" });
            });
            return true; // keep message channel open for async
        } else {
            // update all styles if changedId is not provided
            chrome.storage.local.get(Object.keys(styleSettings), (settings) => {
                cachedSettings = { ...settings };
                // console.log("Received update_styles with settings:", settings);
                applyStyles(settings);
                // sendResponse({ status: "Styles updated" });
            });
            return true; // keep message channel open for async
        }
    }
    return false;
});
