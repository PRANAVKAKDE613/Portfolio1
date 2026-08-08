(function () {
  // Embed Grounded Knowledge Base for client-side fallback (on static hosts like GitHub Pages)
  const KB = {
    name: "Pranav Kakde",
    college: "Pimpri Chinchwad College of Engineering and Research (PCCOER), Pune",
    cgpa: "8.7 / 10",
    gradYear: "2026",
    degree: "B.E. in Information Technology",
    email: "kakdepranav993@gmail.com",
    linkedin: "https://www.linkedin.com/in/pranav-kakde-351a26205/",
    github: "https://github.com/PRANAVKAKDE613",
    leetcode: "200+ problems solved",
    resumes: {
      backend: "resumes/Pranav_Kakde_Java_Backend_Resume.pdf",
      aiml: "resumes/Pranav_Kakde_AIML_GenAI_Resume.pdf"
    }
  };

  // Client-Side Grounded Knowledge Base Responder
  function getGroundedResponse(query) {
    const q = query.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|greetings|hola|hi there|hello there)/.test(q)) {
      return `Hi there! 👋 I'm Pranav's AI portfolio assistant. I can answer questions about his software engineering background, projects, technical skills, or help you download his resumes. How can I help you today?`;
    }

    // Resumes
    if (q.includes("resume") || q.includes("cv") || q.includes("download") || q.includes("profile pdf")) {
      return `You can download either of Pranav's tailored resumes directly:\n\n📄 [Download Java / Backend Resume](${KB.resumes.backend})\n🤖 [Download AI/ML & GenAI Resume](${KB.resumes.aiml})`;
    }

    // LangChain / GenAI / AI/ML
    if (q.includes("langchain") || q.includes("genai") || q.includes("rag") || q.includes("agent") || q.includes("llm") || q.includes("ai/ml") || q.includes("techsight")) {
      return `Pranav has deep experience in AI/ML & GenAI Engineering! Here are his featured AI projects:\n\n• **TechSight – Agentic Financial Analyst**: Multi-agent system (LangChain, LangGraph, GPT-4o-mini) with ChromaDB & AWS S3. Achieved **94% RAG retrieval accuracy** evaluated via RAGAs.\n• **Unified LLM Gateway**: Multi-provider proxy (FastAPI, Redis) with 2-layer caching (**85% latency cut**).\n• **MedRAG**: Clinical document processing with OCR & FAISS.\n• **FinMCP**: MCP server connecting yFinance & SEC EDGAR to LLM agents.\n• **Violence Detection with XAI**: CNN-LSTM & Grad-CAM computer vision model (**92.4% accuracy**).`;
    }

    // Spring Boot / Java / Backend
    if (q.includes("spring") || q.includes("java") || q.includes("backend") || q.includes("full-stack") || q.includes("chat") || q.includes("budgetwise") || q.includes("irctc")) {
      return `Pranav specializes in Java & Spring Boot Full-Stack Development! His key backend projects include:\n\n• **Real-Time Chat App**: Spring Boot, React, MongoDB, STOMP/SockJS WebSockets supporting **100+ concurrent connections** with sub-50ms message storage.\n• **BudgetWise**: Smart Personal Finance Manager built with Spring Boot, React, MySQL & JWT securing **15+ REST endpoints**.\n• **IRCTC Backend**: ACID-compliant railway reservation system in Java JDBC & MySQL with automated waitlist queueing.\n• **FundChain**: Decentralized Ethereum crowdfunding dApp in Solidity & React.`;
    }

    // Internship / Experience / Education / CGPA
    if (q.includes("internship") || q.includes("experience") || q.includes("education") || q.includes("college") || q.includes("cgpa") || q.includes("gpa") || q.includes("acm")) {
      return `Here is Pranav's academic & extracurricular background:\n\n• **Degree**: B.E. in Information Technology at PCCOER, Pune (Graduating 2026)\n• **CGPA**: **8.7 / 10**\n• **Leadership**: Technical Contributor at ACM PCCOER Technical Club (Agile sprint planning, web development)\n• **Awards**: **2nd Place** at Concept Carnival 2023 for Harvest Hub (agri-supply chain dApp)\n• **Problem Solving**: **200+ LeetCode problems** solved`;
    }

    // Skills / Languages / Stack
    if (q.includes("skill") || q.includes("stack") || q.includes("language") || q.includes("tool") || q.includes("python") || q.includes("database")) {
      return `Pranav's core technical toolkit:\n\n• **Languages**: Java, Python, JavaScript, TypeScript, C, SQL\n• **Backend**: Spring Boot, Spring Security, REST APIs, Microservices, Node.js, Express.js, React.js, WebSockets (STOMP/SockJS)\n• **AI/ML**: LangChain, LangGraph, LLM Agents, RAG, FastAPI, PyTorch, TensorFlow, OpenCV, ChromaDB, FAISS\n• **Cloud & DBs**: MySQL, MongoDB, PostgreSQL, Redis, AWS (S3, Glue, Redshift), Docker, Git`;
    }

    // Salary / Personal / Contact Redirect
    if (q.includes("salary") || q.includes("pay") || q.includes("money") || q.includes("personal") || q.includes("contact") || q.includes("hire") || q.includes("email")) {
      return `I'm strictly grounded in Pranav's technical background, projects, and skills. For hiring discussions, interview scheduling, or salary details, please contact Pranav directly:\n\n📧 **Email**: [kakdepranav993@gmail.com](mailto:kakdepranav993@gmail.com)\n💼 **LinkedIn**: [Pranav Kakde on LinkedIn](${KB.linkedin})`;
    }

    // Default Grounded Overview
    return `Pranav Kakde is a final-year B.E. IT student at PCCOER Pune (2026 grad, **8.7 CGPA**) with dual focus in **Java/Spring Boot Backend Development** and **AI/ML Engineering** (LangChain, LLM Agents, RAG).\n\nYou can ask me about his projects (*TechSight, BudgetWise, ChatApp, Unified LLM Gateway*), technical skills, or download his resumes below!`;
  }

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

    // Small natural response delay
    await new Promise(resolve => setTimeout(resolve, 400));

    try {
      // Try API endpoint first if available
      const endpoint = '/api/chat';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      removeTypingIndicator();

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          appendMessage('bot', data.reply);
          return;
        }
      }

      // If backend returns 404 (static GitHub Pages host), use grounded responder fallback
      const reply = getGroundedResponse(userText);
      appendMessage('bot', reply);

    } catch (err) {
      removeTypingIndicator();
      // On static host or network issue, serve instant grounded answer
      const reply = getGroundedResponse(userText);
      appendMessage('bot', reply);
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
