/**
 * CallMind Widget SDK v2.0.0
 * Professional embeddable chat widget for websites
 * 
 * Features:
 * - Glassmorphism UI design
 * - Markdown & code block support
 * - Copy button on messages
 * - Mobile-optimized with swipe gestures
 * - Smooth animations
 * - Domain-restricted API keys
 * 
 * Usage:
 * <script 
 *   src="https://callmind.com/callmind-widget.js"
 *   data-agent-id="YOUR_AGENT_ID"
 *   data-api-key="YOUR_API_KEY"
 *   data-theme="light"
 * ></script>
 */

(function() {
  'use strict';

  const WIDGET_VERSION = '2.0.0';
  const WIDGET_ID = 'callmind-widget';
  
  const currentScript = document.currentScript || document.querySelector('script[src*="callmind-widget"]');
  
  if (!currentScript) {
    console.error('[CallMind Widget] Script tag not found');
    return;
  }

  // Parse configuration from data attributes
  const CONFIG = {
    agentId: currentScript.getAttribute('data-agent-id'),
    apiKey: currentScript.getAttribute('data-api-key'),
    apiUrl: currentScript.getAttribute('data-api-url') || 'https://api.iamspiderman.me',
    theme: currentScript.getAttribute('data-theme') || 'light',
    position: currentScript.getAttribute('data-position') || 'bottom-right',
    primaryColor: currentScript.getAttribute('data-primary-color') || '#3b82f6',
    greeting: currentScript.getAttribute('data-greeting') || 'Hello! How can I help you today?',
    title: currentScript.getAttribute('data-title') || 'Chat Support',
    placeholder: currentScript.getAttribute('data-placeholder') || 'Type your message...',
    autoOpen: currentScript.getAttribute('data-auto-open') === 'true',
  };

  // Merge with window.callmindConfig if provided (for user info, etc.)
  const externalConfig = window.callmindConfig || {};
  if (externalConfig.user) {
    CONFIG.user = externalConfig.user;
  }

  if (!CONFIG.agentId || !CONFIG.apiKey) {
    console.error('[CallMind Widget] Missing required attributes: data-agent-id and data-api-key');
    return;
  }

  // State
  let isOpen = false;
  let isMobile = window.innerWidth <= 640;
  let conversationId = null;
  let visitorId = localStorage.getItem('callmind_visitor_id') || 'v_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  let isLoading = false;
  let touchStartY = 0;

  localStorage.setItem('callmind_visitor_id', visitorId);

  // Simple markdown parser
  function parseMarkdown(text) {
    if (!text) return '';
    
    // Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="cm-code-block"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="cm-inline-code">$1</code>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // Line breaks
    html = html.replace(/\n/g, '<br>');
    
    return html;
  }

  // Inject professional styles
  function injectStyles() {
    const isDark = CONFIG.theme === 'dark';
    const styles = document.createElement('style');
    styles.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      #${WIDGET_ID} {
        --cm-primary: ${CONFIG.primaryColor};
        --cm-primary-light: ${CONFIG.primaryColor}20;
        --cm-bg: ${isDark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
        --cm-bg-solid: ${isDark ? '#111827' : '#ffffff'};
        --cm-text: ${isDark ? '#f9fafb' : '#111827'};
        --cm-text-secondary: ${isDark ? '#9ca3af' : '#6b7280'};
        --cm-border: ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.8)'};
        --cm-input-bg: ${isDark ? 'rgba(31, 41, 55, 0.8)' : 'rgba(249, 250, 251, 0.8)'};
        --cm-user-bg: ${CONFIG.primaryColor};
        --cm-bot-bg: ${isDark ? 'rgba(55, 65, 81, 0.6)' : 'rgba(243, 244, 246, 0.8)'};
        --cm-glass: ${isDark ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
        --cm-shadow: ${isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'};
        
        position: fixed;
        z-index: 2147483647;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }

      #${WIDGET_ID}.position-bottom-right { bottom: 20px; right: 20px; }
      #${WIDGET_ID}.position-bottom-left { bottom: 20px; left: 20px; }

      /* Launcher Button */
      .cm-launcher {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--cm-primary) 0%, ${adjustColor(CONFIG.primaryColor, -20)} 100%);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px ${CONFIG.primaryColor}40, 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .cm-launcher:hover {
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 12px 40px ${CONFIG.primaryColor}50, 0 4px 12px rgba(0,0,0,0.15);
      }

      .cm-launcher:active { transform: scale(0.95); }

      .cm-launcher svg {
        width: 28px;
        height: 28px;
        color: white;
        transition: transform 0.3s ease;
      }

      .cm-launcher-close { display: none; position: absolute; }
      
      .cm-launcher.open .cm-launcher-icon { transform: rotate(90deg) scale(0); }
      .cm-launcher.open .cm-launcher-close { 
        display: block; 
        transform: rotate(0) scale(1);
        animation: cm-fade-in 0.3s ease;
      }

      /* Chat Window */
      .cm-chat-window {
        position: absolute;
        bottom: 76px;
        ${CONFIG.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
        width: 400px;
        max-width: calc(100vw - 40px);
        height: 650px;
        max-height: calc(100vh - 120px);
        background: var(--cm-bg);
        border-radius: 24px;
        box-shadow: var(--cm-shadow), 0 0 0 1px var(--cm-border);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.9) translateY(20px);
        pointer-events: none;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }

      .cm-chat-window.open {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: all;
      }

      /* Header */
      .cm-header {
        padding: 20px 24px;
        background: linear-gradient(135deg, var(--cm-primary) 0%, ${adjustColor(CONFIG.primaryColor, -20)} 100%);
        color: white;
        position: relative;
        overflow: hidden;
      }

      .cm-header::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
        opacity: 0.5;
      }

      .cm-header-content {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .cm-header-title {
        font-weight: 700;
        font-size: 17px;
        letter-spacing: -0.01em;
      }

      .cm-header-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        opacity: 0.9;
        margin-top: 4px;
        font-weight: 500;
      }

      .cm-status-dot {
        width: 8px;
        height: 8px;
        background: #22c55e;
        border-radius: 50%;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
        animation: cm-pulse 2s infinite;
      }

      @keyframes cm-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(0.95); }
      }

      .cm-close-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        cursor: pointer;
        padding: 8px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        backdrop-filter: blur(10px);
      }

      .cm-close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

      /* Messages */
      .cm-messages {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        scroll-behavior: smooth;
      }

      .cm-message {
        display: flex;
        gap: 12px;
        max-width: 90%;
        animation: cm-message-in 0.3s ease;
      }

      @keyframes cm-message-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .cm-message-user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .cm-avatar {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-size: 16px;
        background: var(--cm-bot-bg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }

      .cm-message-user .cm-avatar {
        background: var(--cm-user-bg);
        color: white;
      }

      .cm-message-content {
        padding: 14px 18px;
        border-radius: 18px;
        font-size: 14.5px;
        line-height: 1.6;
        word-wrap: break-word;
        position: relative;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      }

      .cm-message-content a {
        color: var(--cm-primary);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: border-color 0.2s;
      }

      .cm-message-content a:hover { border-bottom-color: var(--cm-primary); }

      .cm-message-user .cm-message-content {
        background: var(--cm-user-bg);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .cm-message-bot .cm-message-content {
        background: var(--cm-bot-bg);
        color: var(--cm-text);
        border-bottom-left-radius: 4px;
      }

      /* Code blocks */
      .cm-code-block {
        background: ${isDark ? '#1f2937' : '#1e293b'};
        border-radius: 10px;
        padding: 16px;
        margin: 8px 0;
        overflow-x: auto;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #e2e8f0;
        position: relative;
      }

      .cm-inline-code {
        background: ${isDark ? 'rgba(55, 65, 81, 0.8)' : 'rgba(229, 231, 235, 0.8)'};
        padding: 2px 6px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 0.9em;
        color: var(--cm-text);
      }

      /* Copy button */
      .cm-copy-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(255,255,255,0.1);
        border: none;
        color: rgba(255,255,255,0.7);
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        opacity: 0;
        transition: all 0.2s;
      }

      .cm-code-block:hover .cm-copy-btn { opacity: 1; }
      .cm-copy-btn:hover { background: rgba(255,255,255,0.2); color: white; }
      .cm-copy-btn.copied { background: #22c55e; color: white; }

      /* Typing indicator */
      .cm-typing {
        display: flex;
        gap: 4px;
        padding: 18px 20px;
        background: var(--cm-bot-bg);
        border-radius: 18px;
        border-bottom-left-radius: 4px;
        width: fit-content;
        align-self: flex-start;
        margin-left: 48px;
      }

      .cm-typing-dot {
        width: 8px;
        height: 8px;
        background: var(--cm-text-secondary);
        border-radius: 50%;
        animation: cm-typing 1.4s infinite ease-in-out both;
      }

      .cm-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .cm-typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes cm-typing {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }

      /* Input area */
      .cm-input-area {
        padding: 20px 24px;
        background: var(--cm-bg);
        border-top: 1px solid var(--cm-border);
      }

      .cm-input-wrapper {
        display: flex;
        gap: 12px;
        background: var(--cm-input-bg);
        border: 1px solid var(--cm-border);
        border-radius: 16px;
        padding: 6px;
        transition: all 0.2s;
      }

      .cm-input-wrapper:focus-within {
        border-color: var(--cm-primary);
        box-shadow: 0 0 0 3px var(--cm-primary-light);
      }

      .cm-input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 12px 14px;
        font-size: 15px;
        color: var(--cm-text);
        outline: none;
        resize: none;
        font-family: inherit;
        min-height: 24px;
        max-height: 120px;
      }

      .cm-input::placeholder { color: var(--cm-text-secondary); }

      .cm-send-btn {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: var(--cm-primary);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        flex-shrink: 0;
      }

      .cm-send-btn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 4px 12px ${CONFIG.primaryColor}40;
      }

      .cm-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .cm-send-btn svg {
        width: 20px;
        height: 20px;
        color: white;
      }

      /* Welcome message */
      .cm-welcome {
        text-align: center;
        padding: 40px 20px;
        color: var(--cm-text-secondary);
      }

      .cm-welcome-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, var(--cm-primary) 0%, ${adjustColor(CONFIG.primaryColor, -20)} 100%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
        box-shadow: 0 8px 24px ${CONFIG.primaryColor}30;
      }

      /* Animations */
      @keyframes cm-fade-in {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }

      /* Mobile styles */
      @media (max-width: 640px) {
        #${WIDGET_ID} { bottom: 0 !important; right: 0 !important; left: 0 !important; }
        
        .cm-launcher {
          margin: 16px;
          width: 56px;
          height: 56px;
        }
        
        .cm-chat-window {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-width: 100%;
          height: 100%;
          max-height: 100%;
          border-radius: 0;
          transform: translateY(100%);
        }
        
        .cm-chat-window.open { transform: translateY(0); }
        
        .cm-header { padding: 16px 20px; }
        .cm-header-title { font-size: 16px; }
        
        .cm-messages { padding: 16px; }
        
        .cm-input-area {
          padding: 16px;
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
      }

      /* Scrollbar styling */
      .cm-messages::-webkit-scrollbar {
        width: 6px;
      }

      .cm-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .cm-messages::-webkit-scrollbar-thumb {
        background: var(--cm-border);
        border-radius: 3px;
      }

      .cm-messages::-webkit-scrollbar-thumb:hover {
        background: var(--cm-text-secondary);
      }
    `;
    document.head.appendChild(styles);
  }

  // Helper to darken/lighten color
  function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.className = `position-${CONFIG.position}`;

    widget.innerHTML = `
      <button class="cm-launcher" aria-label="Open chat">
        <svg class="cm-launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="cm-launcher-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="cm-chat-window">
        <div class="cm-header">
          <div class="cm-header-content">
            <div>
              <div class="cm-header-title">${escapeHtml(CONFIG.title)}</div>
              <div class="cm-header-status">
                <span class="cm-status-dot"></span>
                <span>Online now</span>
              </div>
            </div>
            <button class="cm-close-btn" aria-label="Close chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="cm-messages">
          <div class="cm-welcome">
            <div class="cm-welcome-icon">💬</div>
            <p>Start a conversation</p>
          </div>
        </div>

        <div class="cm-input-area">
          <div class="cm-input-wrapper">
            <textarea class="cm-input" placeholder="${escapeHtml(CONFIG.placeholder)}" rows="1"></textarea>
            <button class="cm-send-btn" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    return widget;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(role, content, isStreaming = false) {
    const container = document.querySelector(`#${WIDGET_ID} .cm-messages`);
    const welcome = container.querySelector('.cm-welcome');
    if (welcome) welcome.remove();

    const existingTyping = container.querySelector('.cm-typing');
    if (existingTyping) existingTyping.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `cm-message cm-message-${role}`;
    
    const avatar = role === 'user' ? '👤' : '🤖';
    const parsedContent = role === 'bot' ? parseMarkdown(content) : escapeHtml(content);
    
    msgDiv.innerHTML = `
      <div class="cm-avatar">${avatar}</div>
      <div class="cm-message-content">${parsedContent}</div>
    `;

    // Add copy button to code blocks
    if (role === 'bot') {
      const codeBlocks = msgDiv.querySelectorAll('.cm-code-block');
      codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'cm-copy-btn';
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.onclick = () => {
          const code = block.querySelector('code').textContent;
          navigator.clipboard.writeText(code);
          copyBtn.textContent = '✓ Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        };
        block.appendChild(copyBtn);
      });
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    
    return msgDiv;
  }

  function showTyping() {
    const container = document.querySelector(`#${WIDGET_ID} .cm-messages`);
    const existing = container.querySelector('.cm-typing');
    if (existing) return;

    const typing = document.createElement('div');
    typing.className = 'cm-typing';
    typing.innerHTML = `
      <div class="cm-typing-dot"></div>
      <div class="cm-typing-dot"></div>
      <div class="cm-typing-dot"></div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  async function sendMessage(text) {
    if (isLoading || !text.trim()) return;

    isLoading = true;
    const sendBtn = document.querySelector(`#${WIDGET_ID} .cm-send-btn`);
    const input = document.querySelector(`#${WIDGET_ID} .cm-input`);
    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    addMessage('user', text);
    showTyping();

    try {
      // Build request payload
      const payload = {
        agent_id: CONFIG.agentId,
        text: text,
        conversation_id: conversationId,
        visitor_id: visitorId,
        stream: true,
      };

      // Add user info if provided via window.callmindConfig
      if (CONFIG.user) {
        payload.user = CONFIG.user;
      }

      const response = await fetch(`${CONFIG.apiUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': CONFIG.apiKey,
          'X-Source': 'widget',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botResponse = '';
      let botMessageEl = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.conversation_id && !conversationId) {
                conversationId = parsed.conversation_id;
              }
              if (parsed.delta) {
                if (!botMessageEl) {
                  document.querySelector('.cm-typing')?.remove();
                  botMessageEl = addMessage('bot', parsed.delta, true);
                  botResponse = parsed.delta;
                } else {
                  botResponse += parsed.delta;
                  const contentEl = botMessageEl.querySelector('.cm-message-content');
                  contentEl.innerHTML = parseMarkdown(botResponse);
                  
                  // Re-add copy buttons
                  const codeBlocks = contentEl.querySelectorAll('.cm-code-block');
                  codeBlocks.forEach(block => {
                    if (!block.querySelector('.cm-copy-btn')) {
                      const copyBtn = document.createElement('button');
                      copyBtn.className = 'cm-copy-btn';
                      copyBtn.innerHTML = '📋 Copy';
                      copyBtn.onclick = () => {
                        const code = block.querySelector('code').textContent;
                        navigator.clipboard.writeText(code);
                        copyBtn.textContent = '✓ Copied!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                          copyBtn.innerHTML = '📋 Copy';
                          copyBtn.classList.remove('copied');
                        }, 2000);
                      };
                      block.appendChild(copyBtn);
                    }
                  });
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('[CallMind Widget] Error:', error);
      document.querySelector('.cm-typing')?.remove();
      addMessage('bot', `Sorry, I encountered an error: ${error.message}. Please try again.`);
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    const widget = document.getElementById(WIDGET_ID);
    const launcher = widget.querySelector('.cm-launcher');
    const chatWindow = widget.querySelector('.cm-chat-window');

    launcher.classList.toggle('open', isOpen);
    chatWindow.classList.toggle('open', isOpen);

    if (isOpen && chatWindow.querySelector('.cm-welcome')) {
      setTimeout(() => {
        addMessage('bot', CONFIG.greeting);
      }, 300);
    }

    if (isOpen) {
      setTimeout(() => widget.querySelector('.cm-input').focus(), 100);
    }
  }

  // Initialize
  function init() {
    if (document.getElementById(WIDGET_ID)) return;

    injectStyles();
    const widget = createWidget();

    const launcher = widget.querySelector('.cm-launcher');
    const closeBtn = widget.querySelector('.cm-close-btn');
    const sendBtn = widget.querySelector('.cm-send-btn');
    const input = widget.querySelector('.cm-input');
    const chatWindow = widget.querySelector('.cm-chat-window');

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', () => {
      const text = input.value.trim();
      if (text) sendMessage(text);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = input.value.trim();
        if (text) sendMessage(text);
      }
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    // Mobile swipe to close
    chatWindow.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    chatWindow.addEventListener('touchmove', (e) => {
      if (!isMobile) return;
      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY;
      if (diff > 100 && chatWindow.scrollTop === 0) {
        toggleChat();
      }
    }, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      isMobile = window.innerWidth <= 640;
    });

    if (CONFIG.autoOpen) {
      setTimeout(toggleChat, 1000);
    }

    console.log('[CallMind Widget] v' + WIDGET_VERSION + ' initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
