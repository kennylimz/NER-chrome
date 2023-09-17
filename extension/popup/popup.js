function updateCheckboxState(checkboxId, isChecked) {
    const checkbox = document.getElementById(checkboxId);
    checkbox.checked = isChecked;
}

function handleCheckboxChange(event) {
    const checkboxId = event.target.id;
    const isChecked = event.target.checked;
    const checkboxState = {};
    checkboxState[checkboxId] = isChecked;
    chrome.storage.sync.set(checkboxState);
}
  
function loadCheckboxStates() {
    const checkboxIds = ['option1', 'option2', 'option3', 'option4', 'option5'];
    chrome.storage.sync.get(checkboxIds, function(result) {
        checkboxIds.forEach(function(checkboxId) {
            updateCheckboxState(checkboxId, result[checkboxId] || false);
        });
    });
}
  


function enableFeature(index) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'enableFunction'+index });
    });
}

function disableFeature(index) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'disableFunction'+index });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('option1').addEventListener('change', handleCheckboxChange);
    document.getElementById('option2').addEventListener('change', handleCheckboxChange);
    document.getElementById('option3').addEventListener('change', handleCheckboxChange);
    document.getElementById('option4').addEventListener('change', handleCheckboxChange);
    document.getElementById('option5').addEventListener('change', handleCheckboxChange);
    loadCheckboxStates();


    document.getElementById('scanPage').addEventListener('click', function() {
        console.log("Clicked");
        document.getElementById('option1').checked = false;
        document.getElementById('option2').checked = false;
        document.getElementById('option3').checked = false;
        document.getElementById('option4').checked = false;
        document.getElementById('option5').checked = false;
        let checkboxState = {};
        checkboxState['option1'] = false;
        checkboxState['option2'] = false;
        checkboxState['option3'] = false;
        checkboxState['option4'] = false;
        checkboxState['option5'] = false;
        chrome.storage.sync.set(checkboxState);
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'scanPage' });
        });
    });

    document.getElementById('option1').addEventListener('change', function() {
        if (this.checked) {
            enableFeature(1);
        } else {
            disableFeature(1);
        }
    });

    document.getElementById('option2').addEventListener('change', function() {
        if (this.checked) {
            enableFeature(2);
        } else {
            disableFeature(2);
        }
    });

    document.getElementById('option3').addEventListener('change', function() {
        if (this.checked) {
            enableFeature(3);
        } else {
            disableFeature(3);
        }
    });

    document.getElementById('option4').addEventListener('change', function() {
        if (this.checked) {
            enableFeature(4);
        } else {
            disableFeature(4);
        }
    });

    document.getElementById('option5').addEventListener('change', function() {
        if (this.checked) {
            enableFeature(5);
        } else {
            disableFeature(5);
        }
    });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "ready") {
        console.log('siuuuu!');
    }
});