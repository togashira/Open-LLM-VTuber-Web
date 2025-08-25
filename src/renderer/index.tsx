import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './src/components/chatbox/chatbox';
import './index.css';

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);

  // Placeholder for Whisper integration and recording button logic
  // This should be expanded with actual recording and Whisper API calls

  return (
    <>
      <ChatBox id="main" size="large" position={{ position: 'fixed', right: 24, bottom: 24, zIndex: 12000 }} />
      {/* Add recording button here */}
      <button
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 13000,
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '8px',
          backgroundColor: isRecording ? 'red' : 'green',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => {
          // Toggle recording state
          setIsRecording(!isRecording);
          // TODO: Add Whisper integration logic here
        }}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);
