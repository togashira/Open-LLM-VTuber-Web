// windowにinitChatBoxを追加する型定義
declare global {
  interface Window {
    initChatBox: () => void;
  }
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/chatbox/chatbox';


import { createRoot } from 'react-dom/client';
window.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('chatbox-root')) {
    const root = document.createElement('div');
    root.id = 'chatbox-root';
    document.body.appendChild(root);
  }
  window.initChatBox = () => {
    const root = document.getElementById('chatbox-root');
    if (root) {
      createRoot(root).render(<ChatBox />);
    }
  };
  if (window.location.search.includes('auto')) {
    window.initChatBox();
  }
});
