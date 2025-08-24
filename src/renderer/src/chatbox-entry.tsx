// windowにinitChatBoxを追加する型定義
declare global {
  interface Window {
    initChatBox: () => void;
  }
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/chatbox/chatbox';


const initChatBox = () => {
  let container = document.getElementById('chatbox-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'chatbox-root';
    document.body.appendChild(container);
  }
  ReactDOM.createRoot(container).render(<ChatBox />);
};

window.initChatBox = initChatBox;
initChatBox();
