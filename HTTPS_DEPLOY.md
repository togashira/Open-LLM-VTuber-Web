# HTTPS Web Deploy Guide

このプロジェクトをHTTPS対応のWebアプリケーションとしてデプロイするためのガイドです。

## 開発環境でのHTTPS実行

### 1. 依存関係のインストール
```bash
npm install
```

### 2. HTTPS開発サーバーの起動
```bash
# HTTPSで開発サーバーを起動
npm run dev:web:https

# または環境変数を使用
HTTPS=true npm run dev:web
```

### 3. プレビューサーバーでのHTTPS確認
```bash
# Webアプリケーションをビルド
npm run build:web

# HTTPSでプレビューサーバーを起動
npm run preview:web:https
```

## 本番環境でのHTTPSデプロイ

### Docker Composeを使用したデプロイ

1. **SSL証明書の準備**
   ```bash
   # 開発用自己署名証明書を生成
   ./generate-certs.sh
   
   # または本番用証明書を配置
   # certs/server.crt - SSL証明書
   # private/server.key - 秘密鍵
   ```

2. **Docker Composeでデプロイ**
   ```bash
   # アプリケーションをビルドして起動
   docker-compose up -d --build
   ```

3. **アクセス確認**
   - HTTP: http://localhost (HTTPSにリダイレクト)
   - HTTPS: https://localhost

### 手動デプロイ

1. **アプリケーションのビルド**
   ```bash
   npm run build:web
   ```

2. **静的ファイルの配置**
   ```bash
   # dist/webディレクトリの内容をWebサーバーのドキュメントルートにコピー
   cp -r dist/web/* /var/www/html/
   ```

3. **Nginxの設定**
   ```bash
   # nginx.confをNginxの設定ディレクトリにコピー
   sudo cp nginx.conf /etc/nginx/sites-available/vtuber-web
   sudo ln -s /etc/nginx/sites-available/vtuber-web /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## SSL証明書の設定

### 開発環境（自己署名証明書）
```bash
./generate-certs.sh
```

### 本番環境（Let's Encrypt）
```bash
# Certbotをインストール
sudo apt install certbot python3-certbot-nginx

# 証明書を取得
sudo certbot --nginx -d yourdomain.com

# 自動更新の設定
sudo crontab -e
# 以下を追加: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成し、必要に応じて値を変更してください。

```bash
cp .env.example .env
```

### バックエンド接続設定

バックエンドとの接続は以下の環境変数で制御されます：

```bash
# デフォルト設定（ローカル開発）
VITE_BACKEND_HOST=127.0.0.1
VITE_BACKEND_PORT=12393

# 本番環境設定例
VITE_BACKEND_HOST=yourdomain.com
VITE_BACKEND_PORT=12393

# カスタムURL（完全指定）
VITE_WS_URL=wss://api.yourdomain.com:12393/client-ws
VITE_BASE_URL=https://api.yourdomain.com:12393
```

**重要**: バックエンドは `0.0.0.0:12393` でリッスンしている必要があります。
詳細は [BACKEND_CONFIG.md](./BACKEND_CONFIG.md) を参照してください。

## セキュリティ設定

このデプロイメント設定には以下のセキュリティ機能が含まれています：

- **HTTPS強制**: HTTPアクセスは自動的にHTTPSにリダイレクト
- **セキュリティヘッダー**:
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security: HSTS有効
  - Cross-Origin-Embedder-Policy: require-corp
  - Cross-Origin-Opener-Policy: same-origin
- **SSL/TLS設定**: TLS 1.2以上、強力な暗号化スイート
- **Gzip圧縮**: パフォーマンス向上のため
- **キャッシュ制御**: 静的アセットの適切なキャッシュ

## トラブルシューティング

### SSL証明書エラー
- 自己署名証明書の場合、ブラウザで警告が表示されますが「詳細設定」→「安全ではないページに移動」で続行できます
- 本番環境では信頼できる認証局からの証明書を使用してください

### ポート競合
- 443ポートが使用中の場合は、docker-compose.ymlでポートを変更してください
- 例: `"8443:443"`

### CORS エラー
- 必要に応じてnginx.confのCORS設定を調整してください

## パフォーマンス最適化

- Gzip圧縮が有効
- 静的アセットのキャッシュ設定済み
- HTTP/2対応
- 必要に応じてCDNの使用を検討してください
