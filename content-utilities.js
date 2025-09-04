// utilities: shortsToVideo
function convertShortsToVideo(isEnabled) {
    if (isEnabled) {
        const currentURL = window.location.href;

        if (currentURL.includes("/shorts/")) {
            const videoId = currentURL.split("/shorts/")[1].split("?")[0];
            const newURL = `https://www.youtube.com/watch?v=${videoId}`;
            window.location.replace(newURL);
        }
    }
}

// init and caching settings on load
chrome.storage.local.get("utilities-shortsToVideo", (result) => {
    convertShortsToVideo(result["utilities-shortsToVideo"]);
});

// utilities: navigation shorts to video
window.addEventListener("popstate", () => {
    chrome.storage.local.get("utilities-shortsToVideo", (result) => {
        convertShortsToVideo(result["utilities-shortsToVideo"]);
    });
});
const observer = new MutationObserver(() => {
    // check if the URL has changed
    const newURL = window.location.href;
    if (newURL !== observer.lastUrl) {
        observer.lastUrl = newURL;
        chrome.storage.local.get("utilities-shortsToVideo", (result) => {
            convertShortsToVideo(result["utilities-shortsToVideo"]);
        });
    }
});
observer.lastUrl = window.location.href;
observer.observe(document.body, { childList: true, subtree: true });

// listening for changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes["utilities-shortsToVideo"] !== undefined) {
        convertShortsToVideo(changes["utilities-shortsToVideo"].newValue);
    }
});
