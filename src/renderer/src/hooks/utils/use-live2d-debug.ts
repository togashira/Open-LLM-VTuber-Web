// Live2Dデバッグ用ツール
import { useWebSocket } from '@/context/websocket-context';

export const useLive2DDebug = () => {
  const { baseUrl, wsUrl } = useWebSocket();

  const debugInfo = {
    currentLocation: window.location.href,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    wsUrl,
    baseUrl,
    isItcometrueAcademy: window.location.hostname === 'itcometrue.academy',
  };

  const testModelUrl = (modelPath: string) => {
    const fullUrl = modelPath.startsWith('http') ? modelPath : baseUrl + modelPath;
    console.log('Testing model URL:', {
      originalPath: modelPath,
      fullUrl,
      baseUrl,
    });
    return fullUrl;
  };

  const testLive2DConnection = async () => {
    console.group('🔍 Live2D Connection Test');
    console.log('Debug Info:', debugInfo);
    
    // Test common model paths
    const testPaths = [
      '/live2d-models/mao_pro/mao_pro.model3.json',
      '/live2d-models/mao_pro',
      'live2d-models/mao_pro/mao_pro.model3.json'
    ];

    for (const path of testPaths) {
      const fullUrl = testModelUrl(path);
      try {
        const response = await fetch(fullUrl, { method: 'HEAD' });
        console.log(`✅ ${path} -> ${response.status}`, fullUrl);
      } catch (error) {
        console.log(`❌ ${path} -> Error`, fullUrl, error);
      }
    }
    
    console.groupEnd();
  };

  return {
    debugInfo,
    testModelUrl,
    testLive2DConnection,
  };
};
