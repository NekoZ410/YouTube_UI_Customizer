// settings for player customizations
const playerStyleSettings = {
    "player-controls-background-height": {
        styleId: "player-controls-background-height-custom",
        generateCss: (settings) => {
            const height = settings["player-controls-background-height"];
            const unit = settings["player-controls-background-height-unit"];
            return `.ytp-gradient-bottom {
                        height: ${height}${unit} !important;
                    }`;
        },
    },
    "player-controls-background-color": {
        styleId: "player-controls-background-color-custom",
        generateCss: (settings) => {
            const color = settings["player-controls-background-color"];
            const alpha = settings["player-controls-background-colorAlpha"];

            // hex to rgb value
            const hexToRgb = (hex) => {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
            };

            const rgbColor = hexToRgb(color);

            return `.ytp-gradient-bottom {
                        background-image: none !important;
                        background-color: rgba(${rgbColor}, ${alpha}) !important;
                    }`;
        },
    },
};

// apply player styles based on settings
function applyPlayerStyles(settings) {
    // reset styles
    removeAllStyles(playerStyleSettings);

    // height
    if (settings["player-controls-background-height-enabled"]) {
        const { styleId, generateCss } = playerStyleSettings["player-controls-background-height"];
        const css = generateCss(settings);
        injectCustomStyle(styleId, css);
    }

    // background-color
    if (settings["player-controls-background-color-enabled"]) {
        const { styleId, generateCss } = playerStyleSettings["player-controls-background-color"];
        const css = generateCss(settings);
        injectCustomStyle(styleId, css);
    }
}

// init and caching settings on load
chrome.storage.local.get(
    Object.keys(playerStyleSettings).flatMap((key) => [key + "-enabled", key, key + "-alpha"]),
    (settings) => {
        const defaultSettings = {
            "player-controls-background-height-enabled": true,
            "player-controls-background-height": 12,
            "player-controls-background-height-unit": "px",
            "player-controls-background-color-enabled": true,
            "player-controls-background-color": "#484848",
            "player-controls-background-colorAlpha": 0.3,
        };
        const currentSettings = { ...defaultSettings, ...settings };
        chrome.storage.local.set(currentSettings, () => {
            applyPlayerStyles(currentSettings);
        });
    }
);

// listen for changes and update settings
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
        const relevantKeys = [
            "player-controls-background-height-enabled",
            "player-controls-background-height",
            "player-controls-background-height-unit",
            "player-controls-background-color-enabled",
            "player-controls-background-color",
            "player-controls-background-colorAlpha",
        ];
        const hasRelevantChange = relevantKeys.some((key) => changes[key] !== undefined);

        if (hasRelevantChange) {
            chrome.storage.local.get(relevantKeys, (fullSettings) => {
                applyPlayerStyles(fullSettings);
            });
        }
    }
});
