// Live2Dモデルファイルの読み込み用ユーティリティ

// ベースURLを取得する関数
export const getBaseUrl = () => {
  // 環境変数で指定されている場合は優先
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  
  const isHttps = window.location.protocol === 'https:';
  const hostname = window.location.hostname;
  
  // itcometrue.academy の場合
  if (hostname === 'itcometrue.academy') {
    return 'https://itcometrue.academy';
  }
  
  // ローカル環境
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = import.meta.env.VITE_BACKEND_PORT || '12393';
    return isHttps ? `https://${hostname}:${port}` : `http://127.0.0.1:${port}`;
  }
  
  // その他の環境
  return isHttps ? `https://${hostname}` : `http://${hostname}`;
};

// Live2Dモデルファイルの完全URLを生成する関数
export const getLive2DModelUrl = (modelPath: string) => {
  const baseUrl = getBaseUrl();
  
  // パスの正規化
  const normalizedPath = modelPath.startsWith('/') ? modelPath : `/${modelPath}`;
  
  return `${baseUrl}${normalizedPath}`;
};

// Live2Dモデルディレクトリの完全URLを生成する関数
export const getLive2DModelDirectory = (modelName: string) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/live2d-models/${modelName}`;
};

// ファイル読み込み用のfetch関数（エラーハンドリング付き）
export const fetchLive2DFile = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // CORS対応
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Failed to fetch Live2D file:', url, error);
    throw error;
  }
};

// モデルファイルのJSONを読み込む関数
export const loadLive2DModelJson = async (modelPath: string) => {
  const url = getLive2DModelUrl(modelPath);
  console.log('Loading Live2D model from:', url);
  
  try {
    const response = await fetchLive2DFile(url);
    const modelData = await response.json();
    return modelData;
  } catch (error) {
    console.error('Failed to load Live2D model JSON:', modelPath, error);
    throw error;
  }
};

// デバッグ用：現在の設定を表示する関数
export const debugLive2DConfig = () => {
  const config = {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    baseUrl: getBaseUrl(),
    envBaseUrl: import.meta.env.VITE_BASE_URL,
    envBackendPort: import.meta.env.VITE_BACKEND_PORT,
  };
  
  console.log('Live2D Configuration:', config);
  return config;
};
