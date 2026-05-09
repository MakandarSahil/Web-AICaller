/**
 * CallMind Widget SDK - Iframe Mode v2.0.0
 * Sandboxed iframe version for CSS/JS isolation
 * 
 * This version loads the widget in an iframe for complete isolation
 * from parent page styles and scripts. Use this when:
 * - Parent site has aggressive CSS that breaks the widget
 * - Security requirements demand script isolation
 * - Multiple widgets on same page needed
 * 
 * Usage:
 * <script src="https://callmind.com/callmind-widget-iframe.js"
 *   data-agent-id="YOUR_AGENT_ID"
 *   data-api-key="YOUR_API_KEY"
 *   data-theme="light"
 * ></script>
 */

(function() {
  'use strict';
  
  const currentScript = document.currentScript || document.querySelector('script[src*="callmind-widget-iframe"]');
  
  if (!currentScript) {
    console.error('[CallMind Iframe Widget] Script tag not found');
    return;
  }
  
  // Parse configuration
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
    iframeSrc: currentScript.getAttribute('data-iframe-src') || 'https://callmind.com/callmind-widget-iframe.html',
  };
  
  // Merge with window.callmindConfig if provided
  const externalConfig = window.callmindConfig || {};
  if (externalConfig.user) {
    CONFIG.user = externalConfig.user;
  }
  
  if (!CONFIG.agentId || !CONFIG.apiKey) {
    console.error('[CallMind Iframe Widget] Missing required attributes: data-agent-id and data-api-key');
    return;
  }
  
  // Build iframe URL with parameters
  const params = new URLSearchParams({
    agentId: CONFIG.agentId,
    apiKey: CONFIG.apiKey,
    apiUrl: CONFIG.apiUrl,
    theme: CONFIG.theme,
    position: CONFIG.position,
    primaryColor: CONFIG.primaryColor,
    greeting: CONFIG.greeting,
    title: CONFIG.title,
    placeholder: CONFIG.placeholder,
  });
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `${CONFIG.iframeSrc}?${params.toString()}`;
  iframe.style.cssText = `
    position: fixed;
    ${CONFIG.position === 'bottom-left' ? 'left: 0;' : 'right: 0;'}
    bottom: 0;
    width: 420px;
    height: 700px;
    max-width: 100vw;
    max-height: 100vh;
    border: none;
    background: transparent;
    z-index: 999999;
    overflow: hidden;
    display: block;
  `;
  
  // Hide initially if not auto-open (iframe handles its own visibility)
  if (!CONFIG.autoOpen) {
    iframe.style.width = '100px';
    iframe.style.height = '100px';
  }
  
  // Listen for messages from iframe
  window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'callmind-ready') {
      console.log('[CallMind Iframe Widget] Ready');
    }
    
    // Handle resize messages from iframe
    if (e.data && e.data.type === 'callmind-resize') {
      if (e.data.isOpen) {
        iframe.style.width = '420px';
        iframe.style.height = '700px';
      } else {
        iframe.style.width = '100px';
        iframe.style.height = '100px';
      }
    }
  });
  
  // Append to body
  document.body.appendChild(iframe);
  
  console.log('[CallMind Iframe Widget] Loaded v2.0.0');
})();
