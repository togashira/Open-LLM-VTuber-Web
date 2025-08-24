import React, { useState, useEffect, useRef } from 'react';
import { Live2D } from '../canvas/live2d';
import { MicVAD } from '@ricky0123/vad-web';
import './chatbox.css';

const ChatBox: React.FC = () => {
  // 開閉式ChatBox
  const [isOpen, setIsOpen] = useState(true);
  // 開閉状態をローカルストレージで保持（リロード時も維持）
  useEffect(() => {
    const saved = localStorage.getItem('chatbox_isOpen');
    if (saved !== null) setIsOpen(saved === 'true');
  }, []);
  useEffect(() => {
    localStorage.setItem('chatbox_isOpen', String(isOpen));
  }, [isOpen]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [size, setSize] = useState<'small' | 'medium' | 'full'>('small');
  const [isRecording, setIsRecording] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const vadRef = useRef<MicVAD | null>(null);

  useEffect(() => {
    const initVAD = async () => {
      const vadInstance = await MicVAD.new({
        onSpeechEnd: async (audio) => {
          setIsRecording(false);
          const formData = new FormData();
          // Convert Float32Array or SharedArrayBuffer audio to ArrayBuffer for Blob
          let audioBuffer: ArrayBuffer;
          if (audio.buffer instanceof SharedArrayBuffer) {
            // Convert SharedArrayBuffer to ArrayBuffer copy
            audioBuffer = new Uint8Array(audio.buffer).buffer;
          } else if (audio.buffer instanceof ArrayBuffer) {
            audioBuffer = audio.buffer;
          } else {
            audioBuffer = audio;
          }
          formData.append('audio', new Blob([audioBuffer], { type: 'audio/wav' }));
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
      vadRef.current = vadInstance;
    };
    initVAD();
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    const saved = localStorage.getItem('chatHistory');
    if (saved) setMessages(JSON.parse(saved));
    return () => {
      // MicVAD does not have close method, so just nullify
      vadRef.current = null;
    };
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
      // MicVAD does not have stop method, so just nullify or implement alternative if available
      vadRef.current = null;
      setIsRecording(false);
    } else {
      // MicVAD does not have start method, so re-initialize or handle accordingly
      const vadInstance = await MicVAD.new({
        onSpeechEnd: async (audio) => {
          setIsRecording(false);
          const formData = new FormData();
          // Convert Float32Array audio to ArrayBuffer for Blob
          const audioBuffer = audio.buffer ? audio.buffer : audio;
          formData.append('audio', new Blob([audioBuffer], { type: 'audio/wav' }));
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
      vadRef.current = vadInstance;
      setIsRecording(true);
    }
  };

  return (
    <div id="chatbox-root">
      <button
        className={`toggle-btn${isOpen ? ' open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000 }}
        aria-label={isOpen ? 'Close Chatbox' : 'Open Chatbox'}
      >
        <img src="https://itcometruechatboxs3.s3.ap-northeast-1.amazonaws.com/icon.png" alt="Open Chatbox" style={{ width: 40, height: 40 }} />
      </button>
      {isOpen && (
        <div className={`chatbox ${size}`}>
          {/* バージョンバナー */}
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#0078d4',
              color: '#fff',
              borderRadius: '8px',
              padding: '2px 10px',
              fontSize: '12px',
              zIndex: 10001,
              opacity: 0.85,
            }}
          >
            v{__APP_VERSION__}
          </div>
          {/* サイズ変更UIは非表示化 */}
          <Live2D isPet={false} />
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
      )}
    </div>
  );
};

export default ChatBox;
