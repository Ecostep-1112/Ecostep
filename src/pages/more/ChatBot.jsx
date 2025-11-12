import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, RotateCcw, ArrowUp } from 'lucide-react';
import { CapacitorHttp } from '@capacitor/core';

const ChatBot = ({ isDarkMode, onBack, platform, isKeyboardVisible }) => {
  // CSS 스타일을 컴포넌트 내부에 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide scrollbar for Chrome, Safari and Opera */
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 컴포넌트 마운트 시 대화 세션 초기화 (새로고침 시 초기화)
  useEffect(() => {
    // 🧹 컴포넌트가 마운트될 때 localStorage 초기화 (새로고침 시마다 초기화)
    const initialMessage = [{ id: 1, text: '안녕하세요. 에코스텝 고객센터입니다. 앱 사용에 대해 무엇이든 물어보세요.', sender: 'bot', timestamp: new Date() }];
    setMessages(initialMessage);
    localStorage.setItem('chatbot_messages', JSON.stringify(initialMessage));
  }, []);

  // Load saved messages from localStorage (더 이상 사용 안 함 - 항상 초기 상태로 시작)
  const loadMessages = () => {
    return [{ id: 1, text: '안녕하세요. 에코스텝 고객센터입니다. 앱 사용에 대해 무엇이든 물어보세요.', sender: 'bot', timestamp: new Date() }];
  };

  const [messages, setMessages] = useState(loadMessages());
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save messages to localStorage
    localStorage.setItem('chatbot_messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const waitingMessage = {
      id: Date.now() + 0.5,
      text: '잠시만 기다려 주세요.',
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, waitingMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = '32px';
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5176';
      console.log('API_URL:', API_URL); // 디버깅용
      console.log('Sending message:', inputMessage); // 디버깅용

      // Use Capacitor HTTP for better mobile compatibility
      const response = await CapacitorHttp.post({
        url: `${API_URL}/api/chatbot`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: { message: inputMessage }
      });

      const data = response.data;

      // Remove waiting message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== waitingMessage.id);
        const botMessage = {
          id: Date.now() + 1,
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        return [...filtered, botMessage];
      });
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      // Remove waiting message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== waitingMessage.id);
        const errorMessage = {
          id: Date.now() + 1,
          text: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          sender: 'bot',
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
    } finally {
      setIsTyping(false);
    }
  };

  // 엔터 키는 줄바꿈으로만 동작 (메시지 전송은 버튼만 사용)
  const handleKeyPress = (e) => {
    // 엔터 키 동작을 줄바꿈으로 허용 (기본 동작 유지)
  };

  const handleReset = () => {
    const initialMessage = [{ id: 1, text: '안녕하세요. 에코스텝 고객센터입니다. 앱 사용에 대해 무엇이든 물어보세요.', sender: 'bot', timestamp: new Date() }];
    setMessages(initialMessage);
    localStorage.setItem('chatbot_messages', JSON.stringify(initialMessage));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const messageBgUser = 'bg-gradient-to-r from-cyan-500 to-blue-500';
  const messageBgBot = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const messageTextBot = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
    <div className={`fixed top-[104px] bottom-0 left-0 right-0 z-40 ${bgColor} flex flex-col overflow-hidden`}>
      {/* Header - Fixed Position */}
      <div className={`flex-shrink-0 ${bgColor} border-b ${borderColor} py-3 px-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3"
          >
            <ChevronRight className={`w-5 h-5 rotate-180 ${textColor}`} />
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
          className={`px-2 py-1 rounded-lg border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
          title="대화 초기화"
        >
          <div className={`text-xs leading-tight ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <div>새로</div>
            <div>고침</div>
          </div>
        </button>
      </div>

      {/* Messages Container - No Scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`${message.sender === 'user' ? 'max-w-[70%] order-2' : 'max-w-[65%] order-1'}`}>
              <div
                className={`rounded-2xl px-3 py-2 ${
                  message.sender === 'user'
                    ? `${messageBgUser} text-white`
                    : `${messageBgBot} ${messageTextBot} border ${borderColor}`
                }`}
              >
                <p className={`text-[13px] whitespace-pre-wrap break-words text-left`} style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}>{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div
        className={`sticky bottom-0 z-10 flex-shrink-0 ${bgColor} pt-2.5 px-4 border-t ${borderColor}`}
        style={{
          paddingBottom: isKeyboardVisible ? '10px' : 'max(24px, env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요"
            className={`flex-1 px-3 py-1.5 rounded-2xl ${inputBg} ${textColor} border ${borderColor} focus:outline-none resize-none overflow-hidden scrollbar-hide text-[13px] placeholder:text-[13px]`}
            disabled={false}
            rows={1}
            style={{ minHeight: '30px', maxHeight: '120px', lineHeight: '1.2rem' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              inputMessage.trim() && !isTyping
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white'
                : `${isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`
            } transition-all`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;