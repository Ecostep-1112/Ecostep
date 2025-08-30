import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiArrowLeft, FiRefreshCw } from 'react-icons/fi';

const ChatBot = ({ isDarkMode, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! 에코스텝 고객센터입니다. 환경 보호와 앱 사용에 대해 무엇이든 물어보세요! 🌱', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5176/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      { id: 1, text: '안녕하세요! 에코스텝 고객센터입니다. 환경 보호와 앱 사용에 대해 무엇이든 물어보세요! 🌱', sender: 'bot', timestamp: new Date() }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const messageBgUser = isDarkMode ? 'bg-blue-600' : 'bg-blue-500';
  const messageBgBot = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const messageTextBot = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`flex-1 ${bgColor} flex flex-col`}>
      {/* Header */}
      <div className={`${headerBg} border-b ${borderColor} p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className={`mr-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className={`text-lg font-semibold ${textColor}`}>고객센터 챗봇</h1>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              24시간 언제든 문의하세요
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          title="대화 초기화"
        >
          <FiRefreshCw className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? `${messageBgUser} text-white`
                    : `${messageBgBot} ${messageTextBot} border ${borderColor}`
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              <p className={`text-xs mt-1 px-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className={`${messageBgBot} ${messageTextBot} border ${borderColor} rounded-2xl px-4 py-2`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`${headerBg} border-t ${borderColor} p-4`}>
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className={`flex-1 px-4 py-2 rounded-full ${inputBg} ${textColor} border ${borderColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className={`p-2 rounded-full ${
              inputMessage.trim() && !isTyping
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`
            } transition-colors`}
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;