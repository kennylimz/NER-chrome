// // Copyright 2022 Google LLC
// //
// // Licensed under the Apache License, Version 2.0 (the "License");
// // you may not use this file except in compliance with the License.
// // You may obtain a copy of the License at
// //
// //     https://www.apache.org/licenses/LICENSE-2.0
// //
// // Unless required by applicable law or agreed to in writing, software
// // distributed under the License is distributed on an "AS IS" BASIS,
// // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// // See the License for the specific language governing permissions and
// // limitations under the License.

// const article = document.querySelector('article');

// // `document.querySelector` may return null if the selector doesn't match anything.
// if (article) {
//   const text = article.textContent;
//   /**
//    * Regular expression to find all "words" in a string.
//    *
//    * Here, a "word" is a sequence of one or more non-whitespace characters in a row. We don't use the
//    * regular expression character class "\w" to match against "word characters" because it only
//    * matches against the Latin alphabet. Instead, we match against any sequence of characters that
//    * *are not* a whitespace characters. See the below link for more information.
//    *
//    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
//    */
//   const wordMatchRegExp = /[^\s]+/g;
//   const words = text.matchAll(wordMatchRegExp);
//   // matchAll returns an iterator, convert to array to get word count
//   const wordCount = [...words].length;
//   const readingTime = Math.round(wordCount / 200);
//   const badge = document.createElement('p');
//   // Use the same styling as the publish information in an article's header
//   badge.classList.add('color-secondary-text', 'type--caption');
//   badge.textContent = `⏱️ ${readingTime} min read`;

//   // Support for API reference docs
//   const heading = article.querySelector('h1');
//   // Support for article docs with date
//   const date = article.querySelector('time')?.parentNode;

//   // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
//   (date ?? heading).insertAdjacentElement('afterend', badge);
// }

let myDict = null;

function highlightWord(keyWord,color) {
    const regex = new RegExp(keyWord, "g");
    const traverseNodes = node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const matches = node.textContent.match(regex);
            if (matches) {
                const frag = document.createDocumentFragment();
                const parts = node.textContent.split(regex);
                parts.forEach((part, index) => {
                    if (index > 0) {
                        const span = document.createElement("span");
                        span.style.backgroundColor = color;
                        span.textContent = matches[index - 1];
                        frag.appendChild(span);
                    }
                    frag.appendChild(document.createTextNode(part));
                });

                node.parentNode.replaceChild(frag, node);
            }
        } else {
            node.childNodes.forEach(traverseNodes);
        }
    };
    traverseNodes(document.body);
}

function removeHighlights(color) {
    const spans = document.querySelectorAll(`span[style='background-color: ${color};']`);
    spans.forEach(span => {
        const text = document.createTextNode(span.textContent);
        span.parentNode.replaceChild(text, span);
    });
}

function extractAndSendTextToServer() {
    console.log("Sending all text to server...");
    
    // Extract all text content from the website
    const allText = document.body.innerText;

    // Create an object to send to the server
    const data = {
        text: allText
    };

    chrome.runtime.sendMessage({action: 'ready'});

    // Send the data to the server
    fetch('http://127.0.0.1:80/backend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
        myDict = response.data;
        alert('Highlight ready!');
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// window.addEventListener("load", function() {
//     extractAndSendTextToServer();
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);
    if (message.action === 'scanPage') {
        extractAndSendTextToServer();
    }
    else if (message.action.startsWith('enable')) {
        if (myDict === null){
            alert("Please scan first.");
            return;
        }
        let lastDigit = parseInt(message.action.charAt(message.action.length-1));
        switch (lastDigit) {
            case 1:
                myDict.geo.forEach(function(word) {
                    highlightWord(word,"aqua");
                });
                break;
            case 2:
                myDict.org.forEach(function(word) {
                    highlightWord(word,"chartreuse");
                });
                break;
            case 3:
                myDict.per.forEach(function(word) {
                    highlightWord(word,"khaki");
                });
                break;
            case 4:
                myDict.gpe.forEach(function(word) {
                    highlightWord(word,"silver");
                });
                break;
            case 5:
                myDict.tim.forEach(function(word) {
                    highlightWord(word,"pink");
                });
                break;
        }
    }
    else if (message.action.startsWith('disable')) {
        if (myDict === null){
            alert("Please scan first.");
            return;
        }
        let lastDigit = parseInt(message.action.charAt(message.action.length-1));
        switch (lastDigit) {
            case 1:
                myDict.geo.forEach(function(word) {
                    removeHighlights("aqua");
                });
                break;
            case 2:
                myDict.org.forEach(function(word) {
                    removeHighlights("chartreuse");
                });
                break;
            case 3:
                myDict.per.forEach(function(word) {
                    removeHighlights("khaki");
                });
                break;
            case 4:
                myDict.gpe.forEach(function(word) {
                    removeHighlights("silver");
                });
                break;
            case 5:
                myDict.tim.forEach(function(word) {
                    removeHighlights("pink");
                });
                break;
        }
    }
});

  
