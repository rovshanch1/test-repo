const DEFAULT_BRIDGE_URL = "ws://127.0.0.1:17420";

let bridgeSocket = null;
let bridgeStatus = "disconnected";

function connectBridge(url = DEFAULT_BRIDGE_URL) {
  if (bridgeSocket && (bridgeSocket.readyState === WebSocket.OPEN || bridgeSocket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  bridgeSocket = new WebSocket(url);
  bridgeStatus = "connecting";

  bridgeSocket.addEventListener("open", () => {
    bridgeStatus = "connected";
  });

  bridgeSocket.addEventListener("close", () => {
    bridgeStatus = "disconnected";
  });

  bridgeSocket.addEventListener("error", () => {
    bridgeStatus = "error";
  });
}

function sendToBridge(payload) {
  connectBridge();

  if (!bridgeSocket || bridgeSocket.readyState !== WebSocket.OPEN) {
    return Promise.reject(new Error("Bridge not connected"));
  }

  bridgeSocket.send(JSON.stringify(payload));
  return Promise.resolve();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_SNAPSHOT") {
    sendToBridge({
      type: "PAGE_SNAPSHOT",
      payload: message.payload,
      sender: {
        tabId: sender.tab?.id ?? null,
        url: sender.tab?.url ?? message.payload?.url ?? null
      }
    })
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: error.message, status: bridgeStatus }));

    return true;
  }

  if (message.type === "BRIDGE_STATUS") {
    sendResponse({ status: bridgeStatus });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  connectBridge();
});
