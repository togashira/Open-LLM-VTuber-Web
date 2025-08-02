/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useContext, useCallback } from 'react';
import { wsService } from '@/services/websocket-service';
import { useLocalStorage } from '@/hooks/utils/use-local-storage';

// リリース用固定設定
const DEFAULT_WS_URL = 'wss://itcometrue.academy/client-ws'; // リリース用固定値
const DEFAULT_BASE_URL = 'https://itcometrue.academy'; // リリース用固定値

export interface HistoryInfo {
  uid: string;
  latest_message: {
    role: 'human' | 'ai';
    timestamp: string;
    content: string;
  } | null;
  timestamp: string | null;
}

interface WebSocketContextProps {
  sendMessage: (message: object) => void;
  wsState: string;
  reconnect: () => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
}

export const WebSocketContext = React.createContext<WebSocketContextProps>({
  sendMessage: wsService.sendMessage.bind(wsService),
  wsState: 'CLOSED',
  reconnect: () => wsService.connect(DEFAULT_WS_URL),
  wsUrl: DEFAULT_WS_URL,
  setWsUrl: () => {},
  baseUrl: DEFAULT_BASE_URL,
  setBaseUrl: () => {},
});

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

export const defaultWsUrl = DEFAULT_WS_URL;
export const defaultBaseUrl = DEFAULT_BASE_URL;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  // LocalStorageの値を無視して、強制的にデフォルト値を使用
  const [wsUrl, setWsUrl] = useLocalStorage('wsUrl', DEFAULT_WS_URL);
  const [baseUrl, setBaseUrl] = useLocalStorage('baseUrl', DEFAULT_BASE_URL);
  
  // 強制的にデフォルト値にリセット
  React.useEffect(() => {
    if (wsUrl !== DEFAULT_WS_URL) {
      setWsUrl(DEFAULT_WS_URL);
    }
    if (baseUrl !== DEFAULT_BASE_URL) {
      setBaseUrl(DEFAULT_BASE_URL);
    }
  }, [wsUrl, baseUrl, setWsUrl, setBaseUrl]);
  
  const handleSetWsUrl = useCallback((url: string) => {
    setWsUrl(url);
    wsService.connect(url);
  }, [setWsUrl]);

  const value = {
    sendMessage: wsService.sendMessage.bind(wsService),
    wsState: 'CLOSED',
    reconnect: () => wsService.connect(DEFAULT_WS_URL), // 常にデフォルト値を使用
    wsUrl: DEFAULT_WS_URL, // 常にデフォルト値を使用
    setWsUrl: handleSetWsUrl,
    baseUrl: DEFAULT_BASE_URL, // 常にデフォルト値を使用
    setBaseUrl,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
