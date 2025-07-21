# マルチステージビルド
FROM node:20-alpine AS builder

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production --ignore-scripts

# ソースコードをコピー
COPY . .

# Webアプリケーションをビルド
RUN npm run build:web

# 本番環境用のNginxイメージ
FROM nginx:alpine

# カスタムnginx設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ビルドされたアプリケーションをコピー
COPY --from=builder /app/dist/web /usr/share/nginx/html

# SSL証明書用のディレクトリを作成
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# 自己署名証明書を生成（開発用）
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/server.key \
    -out /etc/ssl/certs/server.crt \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Development/CN=localhost"

# nginxユーザーに権限を付与
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
