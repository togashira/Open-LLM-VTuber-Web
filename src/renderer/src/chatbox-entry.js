import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/ChatBox';

const initChatBox = () => {
  const container = document.createElement('div');
  container.id = 'itcometrue-chatbox';
  document.body.appendChild(container);
  ReactDOM.createRoot(container).render(<ChatBox />);
};

window.initChatBox = initChatBox;
initChatBox();