import React, { useState, useEffect, useRef } from 'react';
import { VoiceActivityDetection } from '@ricky0123/vad-web';
import './chatbox.css';

const ChatBox: React.FC = () => {
  // 開閉式をやめて常時表示に戻す
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'full'>('small');
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const vadRef = useRef<VoiceActivityDetection | null>(null);

  useEffect(() => {
    const initLive2D = () => {
      const Live2DCubismCore = (window as any).Live2DCubismCore;
      if (Live2DCubismCore && canvasRef.current) {
        const model = new Live2DCubismCore.Model('/models/hiyori/hiyori.model3.json');
        model.startMotion('idle');
        window.addEventListener('messageReceived', () => model.startMotion('talk'));
      }
    };
    initLive2D();
    const initVAD = async () => {
      vadRef.current = new VoiceActivityDetection({
        onSpeechEnd: async (audio) => {
          setIsRecording(false);
          const formData = new FormData();
          formData.append('audio', new Blob([audio], { type: 'audio/wav' }));
          try {
            const response = await fetch('https://api.itcometrue.academy/asr', {
              method: 'POST',
              body: formData,
            });
            const { text } = await response.json();
            handleMessage(text, true);
          } catch (error) {
            console.error('ASR error:', error);
          }
        },
      });
      await vadRef.current.init();
    };
    initVAD();
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
    return () => vadRef.current?.close();
  }, [messages]);

  const handleMessage = async (text: string, isUser: boolean) => {
    const newMessages = [...messages, { text, isUser }];
    setMessages(newMessages);
    localStorage.setItem('chatHistory', JSON.stringify(newMessages));
    if (isUser) {
      try {
        const response = await fetch('https://api.itcometrue.academy/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        const { reply } = await response.json();
        setMessages((prev) => [...prev, { text: reply, isUser: false }]);
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.onstart = () => window.dispatchEvent(new Event('messageReceived'));
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('API error:', error);
      }
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await vadRef.current?.stop();
      setIsRecording(false);
    } else {
      await vadRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div id="chatbox-root">
      <div className={`chatbox ${size}`}>
        <div className="size-controls">
          <button onClick={() => setSize('small')}>Small</button>
          <button onClick={() => setSize('medium')}>Medium</button>
          <button onClick={() => setSize('full')}>Full</button>
        </div>
        <canvas ref={canvasRef} className="live2d-canvas" />
        <div className="messages" ref={messagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.isUser ? 'user' : 'bot'}>
              {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleMessage(input, true)}
        />
        <button onClick={() => handleMessage(input, true)}>Send</button>
        <button onClick={toggleRecording}>{isRecording ? 'Stop' : 'Record'}</button>
      </div>
    </div>
  );
};

export default ChatBox;