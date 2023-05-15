// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "generateLoremIpsum") {
    const length = request.length;
    const inputElement = document.activeElement;

    if (inputElement.tagName === "INPUT" || inputElement.tagName === "TEXTAREA") {
      try {
        const loremIpsumText = await generateLoremIpsum(length);
        insertTextIntoInputElement(inputElement, loremIpsumText);
      } catch (error) {
        console.error("Error generating Lorem Ipsum text:", error);
      }
    }
  }
});

// Generate Lorem Ipsum text
async function generateLoremIpsum(length) {
  try {
    const paragraphs = await getLoremIpsumParagraphs();

    if (length === "generateLoremIpsumWords") {
      const words = paragraphs.map((paragraph) => paragraph.split(" ")).flat();
      const randomWordIndex = getRandomIndex(words.length);
      // Make sure we don't go out of bounds
      if ((randomWordIndex + 10) > words.length) randomWordIndex -= 10;
      return words.slice(randomWordIndex, randomWordIndex + 10).join(" ");
    }
    if (length === "generateLoremIpsumSentences") {
      const sentences = paragraphs.flatMap((paragraph) => paragraph.split(". "));
      const randomSentenceIndex = getRandomIndex(sentences.length);
      if (randomSentenceIndex + 4 > sentences.length - 1) randomSentenceIndex -= 10;
      return sentences.slice(randomSentenceIndex, randomSentenceIndex+10).join(". ") + ".";
    }
    if (length === "generateLoremIpsumParagraphs") {
      const randomParagraphIndex = getRandomIndex(paragraphs.length);
      if (randomParagraphIndex + 5 > paragraphs.length - 1) randomParagraphIndex -= 5;
      return paragraphs.slice(randomParagraphIndex, randomParagraphIndex + 5).join("\n\n");
    }

    return "";

  } catch (error) {
    throw new Error("Error generating Lorem Ipsum text:", error);
  }
}

// Insert text into input element
function insertTextIntoInputElement(inputElement, text) {
  const selectionStart = inputElement.selectionStart;
  const selectionEnd = inputElement.selectionEnd;

  inputElement.value =
    inputElement.value.substring(0, selectionStart) +
    text +
    inputElement.value.substring(selectionEnd);

  // Move cursor after inserted text
  const newSelectionStart = selectionStart + text.length;
  inputElement.setSelectionRange(newSelectionStart, newSelectionStart);
  inputElement.focus();
}

// Get an array of paragraphs from lorem-ipsum.txt file
async function getLoremIpsumParagraphs() {
  try {
    const response = await fetch(chrome.runtime.getURL("./lorem-ipsum.txt"));
    const text = await response.text();
    return text.split("\n\n");
  } catch (error) {
    console.error("Error fetching lorem ipsum file:", error);
    return [];
  }
}

function getRandomIndex(maxIndex) {
  return Math.floor(Math.random() * maxIndex);
}