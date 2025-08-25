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
  // ドメイン判定: itcometrue.academy以外ではマイク機能を無効化
  const isItcometrueAcademy = window.location.hostname === 'itcometrue.academy';

  const [isOpen, setIsOpen] = useState(false);

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
        <iframe
          src="https://your-web-chat-url.example.com" 
          title="Embedded Chatbox"
          style={{
            position: 'fixed',
            bottom: '60px',
            right: '20px',
            width: size === 'large' ? '400px' : size === 'medium' ? '300px' : '250px',
            height: size === 'large' ? '600px' : size === 'medium' ? '450px' : '350px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
          }}
          allow="microphone; autoplay"
        />
      )}
    </>
  );
};

export default ChatBox;
