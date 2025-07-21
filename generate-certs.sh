#!/bin/bash

# SSL証明書ディレクトリを作成
mkdir -p certs private

# 自己署名証明書を生成（開発用）
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout private/server.key \
    -out certs/server.crt \
    -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Development/CN=localhost"

# Let's Encryptの証明書を使用する場合のコメント例
# certbot certonly --standalone -d yourdomain.com
# cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem certs/server.crt
# cp /etc/letsencrypt/live/yourdomain.com/privkey.pem private/server.key

echo "SSL証明書が生成されました。"
echo "証明書: certs/server.crt"
echo "秘密鍵: private/server.key"
echo ""
echo "本番環境では、信頼できる認証局からの証明書を使用してください。"
