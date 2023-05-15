// Create context menu items on extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "generateLoremIpsumWords",
    title: "Words",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "generateLoremIpsumSentences",
    title: "Sentences",
    contexts: ["editable"],
  });

  chrome.contextMenus.create({
    id: "generateLoremIpsumParagraphs",
    title: "Paragraphs",
    contexts: ["editable"],
  });
});

// Listen for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const length = info.menuItemId;

  if (length.startsWith("generateLoremIpsum"))
    chrome.tabs.sendMessage(tab.id, {
      action: "generateLoremIpsum",
      length
    });
});