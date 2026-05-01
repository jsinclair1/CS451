import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hi there! I am your ExpenseApp AI assistant. How can I help you analyze your finances today?' }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');

    // Simulate AI response delay
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: "I am currently running in frontend-only mode! Once connected to the backend, I'll be able to analyze your spending trends and answer that." 
      }]);
    }, 1200);
  };

  return (
    <div className="floating-chat-wrapper">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="d-flex align-items-center gap-2">
              <Sparkles size={18} />
              <h6 className="m-0 fw-bold">AI Assistant</h6>
            </div>
            <button className="btn p-0 text-white" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender}`}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-footer" onSubmit={handleSend}>
            <input
              type="text"
              className="form-control chat-input"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn chat-send-btn" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        className={`floating-chat-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Ask AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
}