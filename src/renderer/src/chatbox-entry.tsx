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
  let root = document.getElementById('chatbox-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'chatbox-root';
    document.body.appendChild(root);
  }
  createRoot(root).render(
    <>
  <ChatBox id="main" key="main" size="large" position={{position:'fixed',right:24,bottom:24,zIndex:12000}} />
    </>
  );
});
