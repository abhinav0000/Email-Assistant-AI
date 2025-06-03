console.log("email assistant extension - content script loaded");
function getEmailContent (){
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for(const selector of selectors){
        const content = document.querySelector(selector);
        if(content){
            return content.innerText.trim();
        }else{
            return '';
        }
    }
};
function createAIButton(){

    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'Reply with AI';
    button.setAttribute('role','button');
    button.setAttribute('data-tooltip','Generate AI reply');
    return button;

};
function findComposeToolbar(){
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];

    for(const selector of selectors){
    const toolbar = document.querySelector(selector);
    if(toolbar){
        return toolbar;
    }
    }
    return null;
};
function injectButton() {
    const existing = document.querySelector('.ai-reply-wrapper');
    if (existing) existing.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found");

    // Wrapper div to simulate Gmail-style split button
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-reply-wrapper';
    wrapper.style.display = 'inline-flex';
    wrapper.style.borderRadius = '999px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.border = '1px solid #1a73e8';
    wrapper.style.marginRight = '8px';
    wrapper.style.boxShadow = '0 1px 1px rgba(0,0,0,0.1)';
    wrapper.style.fontFamily = 'Roboto, sans-serif';

    // Main button
    const mainBtn = document.createElement('div');
    mainBtn.textContent = 'Reply with AI';
    mainBtn.style.padding = '8px 16px';
    mainBtn.style.backgroundColor = '#1a73e8';
    mainBtn.style.color = '#fff';
    mainBtn.style.cursor = 'pointer';
    mainBtn.style.fontSize = '14px';
    mainBtn.style.display = 'flex';
    mainBtn.style.alignItems = 'center';
    mainBtn.style.userSelect = 'none';

    // Dropdown toggle
    const dropdownBtn = document.createElement('div');
    dropdownBtn.innerHTML = '&#9662;'; // ▼
    dropdownBtn.style.padding = '0 12px';
    dropdownBtn.style.backgroundColor = '#1a73e8';
    dropdownBtn.style.color = '#fff';
    dropdownBtn.style.cursor = 'pointer';
    dropdownBtn.style.display = 'flex';
    dropdownBtn.style.alignItems = 'center';
    dropdownBtn.style.userSelect = 'none';
    dropdownBtn.style.borderLeft = '1px solid rgba(255,255,255,0.3)';

    // Dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'tone-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.background = '#fff';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    dropdown.style.display = 'none';
    dropdown.style.zIndex = '9999';

    const tones = ['Professional', 'Friendly', 'Formal', 'Casual'];
    tones.forEach(tone => {
        const option = document.createElement('div');
        option.textContent = tone;
        option.style.padding = '8px 12px';
        option.style.cursor = 'pointer';
        option.style.whiteSpace = 'nowrap';
        option.addEventListener('click', () => {
            selectedTone = tone.toLowerCase();
            dropdown.style.display = 'none';
        });
        option.addEventListener('mouseover', () => {
            option.style.backgroundColor = '#f1f1f1';
        });
        option.addEventListener('mouseout', () => {
            option.style.backgroundColor = '#fff';
        });
        dropdown.appendChild(option);
    });

    // Track selected tone
    let selectedTone = 'professional';

    // Toggle dropdown visibility
    dropdownBtn.addEventListener('click', () => {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        const rect = dropdownBtn.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.left = `${rect.left + window.scrollX}px`;
    });

    // Button click
    mainBtn.addEventListener('click', async () => {
        try {
            mainBtn.textContent = 'Generating...';
            mainBtn.style.opacity = 0.7;
            const emailContent = getEmailContent();

            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailContent, tone: selectedTone })
            });

            if (!response.ok) throw new Error('API Request Failed');
            const generatedReply = await response.text();

            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.error('Compose box not found');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to generate the reply');
        } finally {
            mainBtn.textContent = 'Reply with AI';
            mainBtn.style.opacity = 1;
        }
    });

    // Append all elements
    wrapper.appendChild(mainBtn);
    wrapper.appendChild(dropdownBtn);
    document.body.appendChild(dropdown); // dropdown must go on body for correct positioning
    toolbar.insertBefore(wrapper, toolbar.firstChild);
};
const observer = new MutationObserver((mutations) => {
    for(const mutation of mutations){
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        if(hasComposeElements){
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});