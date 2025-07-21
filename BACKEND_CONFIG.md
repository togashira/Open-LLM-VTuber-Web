# バックエンド接続設定ガイド

このファイルでは、フロントエンド（Web）とバックエンドの接続設定について説明します。

## 現在の設定

バックエンドは以下のポートで動作することが前提になっています：
- **ポート**: 12393
- **WebSocketエンドポイント**: `/client-ws`
- **APIエンドポイント**: `/api/` (必要に応じて)

## 実際の運用実績

### itcometrue.academy での設定例（実績）

この設定は実際に動作確認済みです：

```bash
# .env.production ファイル
NODE_ENV=production
VITE_BACKEND_HOST=itcometrue.academy
VITE_WS_URL=wss://itcometrue.academy/client-ws
VITE_BASE_URL=https://itcometrue.academy
```

**接続先**:
- **WebSocket**: `wss://itcometrue.academy/client-ws`
- **HTTP API**: `https://itcometrue.academy`
- **Live2Dモデル**: `https://itcometrue.academy/live2d-models/mao_pro`

**ポイント**:
- WebSocketはHTTPS (wss://) で接続
- Base URLもHTTPS (https://) で接続（モデルファイル読み込み対応）
- ポート番号は指定しない（標準ポート使用）
- Live2Dモデルファイルの読み込みが正常に動作

## 環境別設定

```bash
# .env ファイル
VITE_BACKEND_PORT=12393
VITE_BACKEND_HOST=127.0.0.1
```

**接続先**:
- WebSocket: `ws://127.0.0.1:12393/client-ws`
- HTTP API: `http://127.0.0.1:12393`

### 2. HTTPS開発環境

```bash
# .env ファイル
HTTPS=true
VITE_BACKEND_PORT=12393
VITE_BACKEND_HOST=localhost
```

**接続先**:
- WebSocket: `wss://localhost:12393/client-ws`
- HTTP API: `https://localhost:12393`

### 3. 本番環境（Docker Compose）

```bash
# .env ファイル
NODE_ENV=production
VITE_BACKEND_PORT=12393
VITE_BACKEND_HOST=yourdomain.com
```

**接続先**:
- WebSocket: `wss://yourdomain.com/client-ws` (nginxプロキシ経由)
- HTTP API: `https://yourdomain.com/api/` (nginxプロキシ経由)

## バックエンド設定例

バックエンド側で以下の設定が必要です：

### conf.yaml例
```yaml
server:
  host: "0.0.0.0"  # 外部からのアクセスを許可
  port: 12393
  
websocket:
  endpoint: "/client-ws"
  
cors:
  allowed_origins:
    - "http://localhost:3000"    # 開発環境
    - "https://localhost:3000"   # HTTPS開発環境
    - "https://yourdomain.com"   # 本番環境
    - "https://localhost"        # Docker HTTPS環境
  allowed_methods:
    - "GET"
    - "POST"
    - "PUT"
    - "DELETE"
    - "OPTIONS"
  allowed_headers:
    - "Content-Type"
    - "Authorization"
    - "X-Requested-With"

ssl:
  enabled: true  # 本番環境ではHTTPS対応
  cert_file: "/path/to/cert.pem"
  key_file: "/path/to/key.pem"
```

## 環境変数での上書き

自動設定をカスタマイズしたい場合は、以下の環境変数で上書きできます：

```bash
# 完全なURLを指定
VITE_WS_URL=wss://custom-backend.com:12393/client-ws
VITE_BASE_URL=https://custom-backend.com:12393

# またはホストとポートを個別に指定
VITE_BACKEND_HOST=custom-backend.com
VITE_BACKEND_PORT=12393
```

## トラブルシューティング

### 1. WebSocket接続エラー
- バックエンドが `0.0.0.0:12393` でリッスンしているか確認
- CORS設定でフロントエンドのオリジンが許可されているか確認
- ファイアウォールでポート12393が開いているか確認

### 2. HTTPS環境での接続エラー
- HTTPSサイトからはWSS接続のみ可能（WS接続は不可）
- バックエンドもHTTPS対応が必要、またはnginxプロキシ経由で接続

### 3. Docker環境での接続エラー
- バックエンドコンテナが`app-network`に接続されているか確認
- nginxの設定で正しいバックエンドホスト名が指定されているか確認

## セキュリティ考慮事項

1. **CORS設定**: 本番環境では信頼できるオリジンのみ許可
2. **SSL/TLS**: 本番環境では必ずHTTPS/WSSを使用
3. **認証**: 必要に応じてWebSocketやAPIに認証を実装
4. **レート制限**: DoS攻撃を防ぐためレート制限を実装
