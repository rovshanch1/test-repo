# test-repo
A simpler test for leraning GitHub

## MetaTrader Site Reader Extension
This repo now contains a simple Google Chrome extension that reads the current page and forwards a summary to a **local bridge** that can talk to MetaTrader (MT4/MT5). Chrome extensions cannot call MetaTrader directly, so you must run a local service that listens for WebSocket messages and forwards them to a MetaTrader Expert Advisor (EA).

### Files
- `extension/manifest.json`: Chrome extension manifest (MV3).
- `extension/content.js`: Collects a page snapshot when requested.
- `extension/background.js`: Sends snapshots to a local WebSocket bridge.
- `extension/popup.html` + `extension/popup.js`: UI to trigger sending.

### How it works
1. The popup button requests a snapshot from the content script.
2. The background service worker sends the snapshot to `ws://127.0.0.1:17420`.
3. Your local bridge should forward that JSON payload into MetaTrader (for example to an EA via a local socket or file).

### Install (Developer Mode)
1. Open Chrome → `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` folder.
4. Open any webpage and click the extension icon → **Send to MetaTrader**.

### Sample payload
```json
{
  "type": "PAGE_SNAPSHOT",
  "payload": {
    "title": "Example Domain",
    "url": "https://example.com",
    "selection": "",
    "bodyText": "Example Domain ...",
    "capturedAt": "2024-01-01T00:00:00.000Z"
  },
  "sender": {
    "tabId": 123,
    "url": "https://example.com"
  }
}
```

> ⚠️ You must supply the local WebSocket bridge and the MetaTrader EA side. This extension only sends data out to the bridge.
