// settings for text customizations
const textStyleSettings = {
    "text-video-title-home": {
        styleId: "text-video-title-home-display-full",
        css: `#contents #content .yt-lockup-metadata-view-model__title:not([href*="&list="]) {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-video-title-playerSidebar": {
        styleId: "text-video-title-playerSidebar-display-full",
        css: `#items #contents .yt-lockup-metadata-view-model__title:not([href*="&list="]) {
                display: block !important;
                max-height: unset !important;
            }
            #items #contents .yt-lockup-view-model__content-image:not([href*="&list="]) .ytThumbnailViewModelHost {
                align-self: center;
            }`,
    },
    "text-video-title-playlistPanel": {
        styleId: "text-video-title-playlistPanel-display-full",
        css: `#video-title.ytd-playlist-panel-video-renderer {
                display: block !important;
                max-height: unset !important;
            }                
            #items #thumbnail-container {
                align-self: anchor-center;
            }`,
    },

    "text-playlist-title-home": {
        styleId: "text-playlist-title-home-display-full",
        css: `#contents #content  .yt-lockup-metadata-view-model__title[href*="&list="] {
                display: block !important;
                max-height: unset !important;
            }`,
    },
    "text-playlist-title-playerSidebar": {
        styleId: "text-playlist-title-playerSidebar-display-full",
        css: `#items #contents .yt-lockup-metadata-view-model__title[href*="&list="] {
                display: block !important;
                max-height: unset !important;
            }
            #items #contents .yt-lockup-view-model__content-image[href*="&list="] .ytThumbnailViewModelHost {
                align-self: center;
            }
            #items #contents .yt-lockup-view-model__content-image[href*="&list="] .ytCollectionThumbnailViewModelHost {
                align-content: center;
            }`,
    },
    "text-playlist-title-playlistPanel": {
        styleId: "text-playlist-title-playlistPanel-display-full",
        css: `.title.ytd-playlist-panel-renderer {
                display: block !important;
                max-height: unset !important;
            }
            #next-video-title yt-formatted-string {
                white-space: unset !important;
            }
            #publisher-container yt-formatted-string {
                white-space: unset;
                max-height: unset;
            }`,
    },
    "text-playlist-info-all": {
        styleId: "text-playlist-info-all-display-full",
        css: `#contents .yt-content-metadata-view-model > .yt-content-metadata-view-model__metadata-row:first-child .yt-core-attributed-string[role="text"] {
                white-space: unset !important;
            }`,
    },

    "text-shorts-title-all": {
        styleId: "text-shorts-title-all-display-full",
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

// init and caching settings on load
chrome.storage.local.get(Object.keys(textStyleSettings), (settings) => {
    let cachedSettings = Object.keys(textStyleSettings).reduce(
        (acc, id) => ({
            ...acc,
            [id]: settings[id] !== undefined ? settings[id] : true,
        }),
        {}
    );

    // check if settings have changed
    chrome.storage.local.get(Object.keys(textStyleSettings), (existing) => {
        if (JSON.stringify(existing) !== JSON.stringify(cachedSettings)) {
            chrome.storage.local.set(cachedSettings, () => {
                applyStyles(cachedSettings, textStyleSettings);
            });
        } else {
            applyStyles(cachedSettings, textStyleSettings);
        }
    });
});

// setup storage listener for text styles
setupStorageListener(textStyleSettings);
