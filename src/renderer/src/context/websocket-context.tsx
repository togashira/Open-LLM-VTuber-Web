/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useContext, useCallback } from 'react';
import { wsService } from '@/services/websocket-service';
import { useLocalStorage } from '@/hooks/utils/use-local-storage';

// 環境変数から設定を取得、フォールバックとしてローカル設定を使用
const getDefaultWsUrl = () => {
  // 環境変数で完全なURLが指定されている場合は優先
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  // HTTPS環境かどうかを判定
  const isHttps = window.location.protocol === 'https:';
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_BACKEND_PORT || '12393';
  
  // 本番環境（HTTPS）では wss:// を使用
  // ただし、ポート指定なしでドメイン直接接続
  if (isHttps) {
    // itcometrue.academy のような本番ドメインの場合はポートなし
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `wss://${hostname}/client-ws`;
    }
    return `wss://${hostname}:${port}/client-ws`;
  }
  
  // 開発環境では ws:// を使用
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `ws://127.0.0.1:${port}/client-ws`;
  }
  
  // その他の環境
  return `ws://${hostname}:${port}/client-ws`;
};

const getDefaultBaseUrl = () => {
  // 環境変数で完全なURLが指定されている場合は優先
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  
  const isHttps = window.location.protocol === 'https:';
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_BACKEND_PORT || '12393';
  
  // itcometrue.academy の場合の実績に基づく設定
  // Live2Dモデルファイルのアクセスを考慮してHTTPSに変更
  if (hostname === 'itcometrue.academy') {
    return `https://${hostname}`;
  }
  
  if (isHttps) {
    // ローカルHTTPS環境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `https://${hostname}:${port}`;
    }
    // その他のHTTPS環境（通常はHTTPS）
    return `https://${hostname}`;
  }
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://127.0.0.1:${port}`;
  }
  
  return `http://${hostname}:${port}`;
};

const DEFAULT_WS_URL = getDefaultWsUrl();
const DEFAULT_BASE_URL = getDefaultBaseUrl();

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
  const [wsUrl, setWsUrl] = useLocalStorage('wsUrl', DEFAULT_WS_URL);
  const [baseUrl, setBaseUrl] = useLocalStorage('baseUrl', DEFAULT_BASE_URL);
  const handleSetWsUrl = useCallback((url: string) => {
    setWsUrl(url);
    wsService.connect(url);
  }, [setWsUrl]);

  const value = {
    sendMessage: wsService.sendMessage.bind(wsService),
    wsState: 'CLOSED',
    reconnect: () => wsService.connect(wsUrl),
    wsUrl,
    setWsUrl: handleSetWsUrl,
    baseUrl,
    setBaseUrl,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
