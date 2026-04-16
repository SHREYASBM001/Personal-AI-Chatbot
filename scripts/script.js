import { getModel, startChatSession } from './gemini.js';

// Initialize the model and chat session
const model = getModel();
const chat = startChatSession(model);

// DOM elements
const chatUI = {
  messages: document.getElementById('chat-messages'),
  input: document.getElementById('user-input'),
  sendBtn: document.getElementById('send-button'),
  clearBtn: document.getElementById('clear-chat'),
  typingIndicator: document.getElementById('typing-indicator')
};

// Display welcome message
displayMessage('model', "Hello! I'm your AI assistant. How can I help you today?");

// Event listeners
chatUI.input.addEventListener('input', adjustInputHeight);
chatUI.sendBtn.addEventListener('click', handleSendMessage);
chatUI.clearBtn.addEventListener('click', resetConversation);
chatUI.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
});

async function handleSendMessage() {
  const userMessage = chatUI.input.value.trim();
  if (!userMessage) return;

  try {
    // Add user message to UI
    displayMessage('user', userMessage);
    clearInput();
    showTypingIndicator();

    // Send message to Gemini and get response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    // Add AI response to UI
    displayMessage('model', text);

  } catch (error) {
    console.error('Chat Error:', error);
    displayMessage('model', `Sorry, I encountered an error: ${error.message}`);
  } finally {
    hideTypingIndicator();
  }
}

// Helper functions
function displayMessage(role, text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}-message`;
  messageDiv.innerHTML = `
    <div class="avatar">
      <i class="fas fa-${role === 'model' ? 'robot' : 'user'}"></i>
    </div>
    <div class="content">
      ${formatMessageText(text)}
    </div>
  `;
  chatUI.messages.appendChild(messageDiv);
  chatUI.messages.scrollTop = chatUI.messages.scrollHeight;
}

function formatMessageText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function adjustInputHeight() {
  this.style.height = 'auto';
  this.style.height = `${this.scrollHeight}px`;
}

function clearInput() {
  chatUI.input.value = '';
  chatUI.input.style.height = 'auto';
}

function showTypingIndicator() {
  chatUI.typingIndicator.style.display = 'flex';
}

function hideTypingIndicator() {
  chatUI.typingIndicator.style.display = 'none';
}

function resetConversation() {
  chatUI.messages.innerHTML = '';
  displayMessage('model', "Hello again! How can I help you today?");
  // Reset chat history
  chat.history = [
    {
      role: "user",
      parts: [{ text: "You are a helpful AI assistant. Keep responses concise and friendly." }]
    },
    {
      role: "model",
      parts: [{ text: "Hello! I'm your AI assistant. How can I help you today?" }]
    }
  ];
}