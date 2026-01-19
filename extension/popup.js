const sendButton = document.getElementById("send");
const statusEl = document.getElementById("status");

function setStatus(text) {
  statusEl.textContent = `Status: ${text}`;
}

function getActiveTab() {
  return chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

async function sendSnapshot() {
  sendButton.disabled = true;
  setStatus("collecting page data...");

  try {
    const tab = await getActiveTab();
    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    const response = await chrome.tabs.sendMessage(tab.id, { type: "REQUEST_SNAPSHOT" });
    const result = await chrome.runtime.sendMessage({
      type: "PAGE_SNAPSHOT",
      payload: response.payload
    });

    if (!result.ok) {
      throw new Error(result.error ?? "Failed to send");
    }

    setStatus("sent successfully");
  } catch (error) {
    setStatus(`error - ${error.message}`);
  } finally {
    sendButton.disabled = false;
  }
}

sendButton.addEventListener("click", sendSnapshot);

chrome.runtime.sendMessage({ type: "BRIDGE_STATUS" }).then((response) => {
  setStatus(response.status ?? "unknown");
});
