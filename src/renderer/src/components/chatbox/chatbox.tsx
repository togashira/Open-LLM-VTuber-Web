import React, { useState, useEffect, useRef } from 'react';
import { MicVAD } from '@ricky0123/vad-web';
import './chatbox.css';
import { Live2D } from '../canvas/live2d';

interface ChatBoxProps {
  id: string;
  position?: React.CSSProperties;
  size?: 'large' | 'medium' | 'small' | 'small-alt';
}

const ChatBox: React.FC<ChatBoxProps> = ({ id, position, size = 'large' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const vadRef = useRef<MicVAD | null>(null);

  // localStorageから履歴復元
  useEffect(() => {
    const saved = localStorage.getItem(`${id}_chatHistory`);
    if (saved) setMessages(JSON.parse(saved));
  }, [id]);
  // 履歴保存
  useEffect(() => {
    localStorage.setItem(`${id}_chatHistory`, JSON.stringify(messages));
  }, [messages, id]);

  // VAD初期化
  useEffect(() => {
    const initVAD = async () => {
      const vadInstance = await MicVAD.new({
        onSpeechEnd: async (audio) => {
          setIsRecording(false);
          const formData = new FormData();
          let audioBuffer: ArrayBuffer;
          // SharedArrayBufferの場合はArrayBufferに変換
          if (typeof SharedArrayBuffer !== 'undefined' && audio.buffer instanceof SharedArrayBuffer) {
            // SharedArrayBuffer→ArrayBufferへコピー
            const tmp = new Uint8Array(audio.buffer);
            audioBuffer = tmp.slice().buffer;
          } else if (audio.buffer instanceof ArrayBuffer) {
            audioBuffer = audio.buffer;
          } else {
            audioBuffer = new ArrayBuffer(0);
          }
          if (audioBuffer) {
            formData.append('audio', new Blob([audioBuffer], { type: 'audio/wav' }));
          }
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
    return () => {
      vadRef.current = null;
    };
  }, [id]);

  // メッセージ送信
  const handleMessage = (text: string, isUser: boolean) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { text, isUser }]);
    setInput('');
    setTimeout(() => {
      if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 0);
  };

  // 録音トグル
  const toggleRecording = async () => {
    if (isRecording) {
      vadRef.current = null;
      setIsRecording(false);
    } else {
      const vadInstance = await MicVAD.new({
        onSpeechEnd: async (audio) => {
          setIsRecording(false);
          const formData = new FormData();
          let audioBuffer2: ArrayBuffer;
          if (typeof SharedArrayBuffer !== 'undefined' && audio.buffer instanceof SharedArrayBuffer) {
            const tmp = new Uint8Array(audio.buffer);
            audioBuffer2 = tmp.slice().buffer;
          } else if (audio.buffer instanceof ArrayBuffer) {
            audioBuffer2 = audio.buffer;
          } else {
            audioBuffer2 = new ArrayBuffer(0);
          }
          formData.append('audio', new Blob([audioBuffer2], { type: 'audio/wav' }));
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

  // Guard for Live2DCubismCore usage to prevent errors if runtime is not loaded (Cubism4専用)
  const safeUseCubismCore = (callback: () => void) => {
    if (typeof (window as any).Live2DCubismCore === 'undefined') {
      console.warn('[ChatBox] Live2DCubismCore is not defined yet. Skipping Cubism4 dependent code.');
      return;
    }
    callback();
  };

  // まず開閉UIのみ即時描画
  return (
    <>
      <button
        className="toggle-btn"
        style={position}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close Chatbox' : 'Open Chatbox'}
      >
        {isOpen ? '×' : '💬'}
      </button>
      {isOpen && (
        <ChatBoxBody />
      )}
    </>
  );

  // 本体描画部分を遅延ロード用のサブコンポーネントに分離
  function ChatBoxBody() {
    return (
      <div className={`chatbox chatbox-${size}`} style={position}>
        <div style={{padding:8}}>
          <b>ChatBox {id}</b>
        </div>
        <Live2D isPet={false} />
        <div className="messages" ref={messagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={msg.isUser ? 'user' : 'bot'}>
              {msg.text}
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:4,padding:8}}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleMessage(input, true); }}
            style={{flex:1}}
            placeholder="メッセージを入力..."
          />
          <button onClick={() => handleMessage(input, true)}>送信</button>
          <button onClick={toggleRecording}>{isRecording ? 'Stop' : 'Record'}</button>
        </div>
      </div>
    );
  }
};

export default ChatBox;
