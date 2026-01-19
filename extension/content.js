function collectPageSnapshot() {
  const title = document.title || "";
  const url = window.location.href;
  const selection = window.getSelection()?.toString() ?? "";
  const bodyText = document.body?.innerText ?? "";
  const trimmedBody = bodyText.length > 5000 ? `${bodyText.slice(0, 5000)}...` : bodyText;

  return {
    title,
    url,
    selection,
    bodyText: trimmedBody,
    capturedAt: new Date().toISOString()
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "REQUEST_SNAPSHOT") {
    sendResponse({ payload: collectPageSnapshot() });
  }
});
