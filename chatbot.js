(function () {
  // Inject Chatbot UI HTML
  const chatbotHtml = `
    <div id="ai-chatbot-widget" class="chatbot-widget">
      <button id="chatbot-toggle" class="chatbot-toggle-btn" aria-label="Open AI Assistant">
        <svg class="icon-chat" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="icon-close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="chatbot-badge">AI</span>
      </button>

      <div id="chatbot-panel" class="chatbot-panel" style="display: none;">
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <span class="avatar">PK</span>
            <div>
              <h3>Pranav's AI Assistant</h3>
              <p><span class="online-dot"></span> Online | Grounded Knowledge</p>
            </div>
          </div>
          <button id="chatbot-close-btn" class="chatbot-close-btn" aria-label="Close Chat">&times;</button>
        </div>

        <div id="chatbot-messages" class="chatbot-messages">
          <div class="chat-message bot">
            <div class="message-content">
              Hi! I'm Pranav's portfolio assistant — ask me about his projects, skills, or experience, or grab his resume below.
            </div>
            <div class="chat-quick-actions">
              <button class="quick-btn" data-query="Can I see his Java/Backend resume?">📄 Backend Resume</button>
              <button class="quick-btn" data-query="Can I see his AI/ML resume?">🤖 AI/ML Resume</button>
              <button class="quick-btn" data-query="What projects has he built with LangChain?">⚡ LangChain Projects</button>
              <button class="quick-btn" data-query="Does he know Spring Boot?">☕ Spring Boot Skills</button>
            </div>
          </div>
        </div>

        <div class="chatbot-footer">
          <form id="chatbot-form" class="chatbot-form">
            <input type="text" id="chatbot-input" placeholder="Ask about Pranav's background..." autocomplete="off" />
            <button type="submit" id="chatbot-send" aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', chatbotHtml);

  // DOM Elements
  const toggleBtn = document.getElementById('chatbot-toggle');
  const panel = document.getElementById('chatbot-panel');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const iconChat = toggleBtn.querySelector('.icon-chat');
  const iconClose = toggleBtn.querySelector('.icon-close');
  const messagesContainer = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? 'flex' : 'none';
    iconChat.style.display = isOpen ? 'none' : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    if (isOpen) {
      input.focus();
      scrollToBottom();
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendMessage(sender, text, html = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    if (html) {
      contentDiv.innerHTML = html;
    } else {
      // Basic markdown parsing for bold & links
      let parsed = text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>');
      contentDiv.innerHTML = parsed;
    }

    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-content">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  async function handleSend(userText) {
    if (!userText.trim()) return;

    appendMessage('user', userText);
    input.value = '';
    showTypingIndicator();

    try {
      // Determine endpoint URL (works locally & on Vercel / serverless)
      const endpoint = '/api/chat';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      removeTypingIndicator();

      if (res.ok) {
        const data = await res.json();
        appendMessage('bot', data.reply || "No response received.");
      } else {
        const data = await res.json().catch(() => ({}));
        appendMessage('bot', data.reply || "Sorry, I ran into an issue connecting to the AI backend. Please email Pranav directly at kakdepranav993@gmail.com!");
      }
    } catch (err) {
      removeTypingIndicator();
      console.warn("API Call fallback:", err);

      // Offline / Static fallback response
      const lower = userText.toLowerCase();
      let fallback = "Pranav Kakde is a final-year B.E. IT student (2026, 8.7 CGPA) with expertise in Spring Boot, React, and AI/ML (LangChain, RAG). You can download his resumes directly using the hero buttons!";
      if (lower.includes('resume')) {
        fallback = "You can download Pranav's resumes right here:\n\n📄 [Download Java/Backend Resume](resumes/Pranav_Kakde_Java_Backend_Resume.pdf)\n🤖 [Download AI/ML & GenAI Resume](resumes/Pranav_Kakde_AIML_GenAI_Resume.pdf)";
      }
      appendMessage('bot', fallback);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSend(input.value);
  });

  // Handle Quick Action Buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-btn')) {
      const query = e.target.getAttribute('data-query');
      if (query) {
        handleSend(query);
      }
    }
  });
})();
