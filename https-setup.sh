#!/bin/bash

echo "=== Open LLM VTuber Web - HTTPS Setup Tool ==="
echo ""

# 必要なコマンドの確認
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "エラー: $1 がインストールされていません。"
        return 1
    fi
    return 0
}

# 依存関係の確認
echo "1. 依存関係の確認..."
check_command "node" || exit 1
check_command "npm" || exit 1
check_command "openssl" || exit 1

echo "✓ 必要なコマンドが利用可能です"
echo ""

# Node.jsとnpmのバージョン確認
echo "2. バージョン情報:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# package.jsonの存在確認
if [ ! -f "package.json" ]; then
    echo "エラー: package.json が見つかりません。プロジェクトルートで実行してください。"
    exit 1
fi

# 依存関係のインストール
echo "3. 依存関係のインストール..."
if [ ! -d "node_modules" ]; then
    echo "npm install を実行しています..."
    npm install
    if [ $? -ne 0 ]; then
        echo "エラー: npm install に失敗しました。"
        exit 1
    fi
else
    echo "✓ node_modules が既に存在します"
fi
echo ""

# SSL証明書の生成
echo "4. SSL証明書の生成..."
if [ ! -f "certs/server.crt" ] || [ ! -f "private/server.key" ]; then
    echo "SSL証明書を生成しています..."
    ./generate-certs.sh
    if [ $? -ne 0 ]; then
        echo "エラー: SSL証明書の生成に失敗しました。"
        exit 1
    fi
else
    echo "✓ SSL証明書が既に存在します"
fi
echo ""

# 環境変数ファイルの作成
echo "5. 環境変数ファイルの確認..."
if [ ! -f ".env" ]; then
    echo ".env ファイルを作成しています..."
    cp .env.example .env
    echo "✓ .env ファイルが作成されました"
    echo ""
    echo "📝 バックエンド接続設定:"
    echo "   デフォルト: 127.0.0.1:12393"
    echo "   設定ファイル: .env"
    echo "   詳細は BACKEND_CONFIG.md を参照してください"
else
    echo "✓ .env ファイルが既に存在します"
fi
echo ""

# バックエンド接続チェック
echo "6. バックエンド接続確認..."
BACKEND_HOST=${VITE_BACKEND_HOST:-127.0.0.1}
BACKEND_PORT=${VITE_BACKEND_PORT:-12393}
echo "バックエンド接続先: ${BACKEND_HOST}:${BACKEND_PORT}"

if command -v curl &> /dev/null; then
    if curl -s --connect-timeout 3 http://${BACKEND_HOST}:${BACKEND_PORT} > /dev/null 2>&1; then
        echo "✓ バックエンドに接続できます"
    else
        echo "⚠️  バックエンドに接続できません"
        echo "   バックエンドが ${BACKEND_HOST}:${BACKEND_PORT} で起動しているか確認してください"
    fi
else
    echo "ℹ️  curl が利用できないため、バックエンド接続を確認できません"
fi
echo ""

# メニュー表示
show_menu() {
    echo "=== 実行オプション ==="
    echo "1) HTTPS開発サーバーを起動"
    echo "2) Webアプリをビルド"
    echo "3) HTTPSプレビューサーバーを起動"
    echo "4) Docker Composeでデプロイ"
    echo "5) バックエンド接続設定を確認"
    echo "6) itcometrue.academy用設定をコピー"
    echo "7) 終了"
    echo ""
    read -p "選択してください (1-7): " choice
}

# メインループ
while true; do
    show_menu
    case $choice in
        1)
            echo "HTTPS開発サーバーを起動しています..."
            echo "アクセス先: https://localhost:3000"
            echo "停止するには Ctrl+C を押してください"
            npm run dev:web:https
            ;;
        2)
            echo "Webアプリケーションをビルドしています..."
            npm run build:web
            if [ $? -eq 0 ]; then
                echo "✓ ビルドが完了しました (dist/web/)"
            else
                echo "エラー: ビルドに失敗しました"
            fi
            ;;
        3)
            echo "HTTPSプレビューサーバーを起動しています..."
            echo "まずビルドを実行します..."
            npm run build:web
            if [ $? -eq 0 ]; then
                echo "プレビューサーバーを起動中..."
                echo "アクセス先: https://localhost:4173"
                echo "停止するには Ctrl+C を押してください"
                npm run preview:web:https
            else
                echo "エラー: ビルドに失敗しました"
            fi
            ;;
        4)
            echo "Docker Composeでデプロイしています..."
            if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
                docker-compose up -d --build
                if [ $? -eq 0 ]; then
                    echo "✓ デプロイが完了しました"
                    echo "アクセス先:"
                    echo "  HTTP:  http://localhost"
                    echo "  HTTPS: https://localhost"
                    echo ""
                    echo "停止するには: docker-compose down"
                else
                    echo "エラー: Docker Composeの実行に失敗しました"
                fi
            else
                echo "エラー: DockerまたはDocker Composeがインストールされていません"
            fi
            ;;
        5)
            echo "バックエンド接続設定を確認中..."
            echo ""
            echo "📋 現在の設定:"
            if [ -f ".env" ]; then
                echo "環境変数ファイル (.env):"
                grep -E "VITE_BACKEND|BACKEND" .env || echo "  バックエンド設定なし（デフォルト値を使用）"
            else
                echo "  .env ファイルが存在しません"
            fi
            echo ""
            echo "📡 接続先:"
            BACKEND_HOST=${VITE_BACKEND_HOST:-127.0.0.1}
            BACKEND_PORT=${VITE_BACKEND_PORT:-12393}
            echo "  WebSocket: ws://${BACKEND_HOST}:${BACKEND_PORT}/client-ws"
            echo "  HTTP API:  http://${BACKEND_HOST}:${BACKEND_PORT}"
            echo ""
            echo "📖 詳細情報:"
            echo "  - バックエンド設定ガイド: cat BACKEND_CONFIG.md"
            echo "  - 環境変数テンプレート: cat .env.example"
            echo ""
            if command -v curl &> /dev/null; then
                echo "🔍 接続テスト中..."
                if curl -s --connect-timeout 3 http://${BACKEND_HOST}:${BACKEND_PORT} > /dev/null 2>&1; then
                    echo "✅ バックエンドに接続できました"
                else
                    echo "❌ バックエンドに接続できません"
                    echo "   以下を確認してください:"
                    echo "   1. バックエンドが起動しているか"
                    echo "   2. ポート ${BACKEND_PORT} が開いているか"
                    echo "   3. ファイアウォール設定"
                fi
            fi
            ;;
        6)
            echo "itcometrue.academy用設定をコピーしています..."
            if [ -f ".env.production" ]; then
                cp .env.production .env
                echo "✅ .env.production から .env にコピーしました"
                echo ""
                echo "📋 設定内容:"
                cat .env
                echo ""
                echo "🌐 この設定での接続先:"
                echo "  WebSocket: wss://itcometrue.academy/client-ws"
                echo "  Base URL:  https://itcometrue.academy"
                echo "  Model URL: https://itcometrue.academy/live2d-models/mao_pro"
                echo ""
                echo "💡 この設定は itcometrue.academy での動作実績があります"
                echo "📝 Live2Dモデルファイルの読み込みもHTTPS経由で行われます"
            else
                echo "❌ .env.production ファイルが見つかりません"
            fi
            ;;
        7)
            echo "終了します。"
            exit 0
            ;;
        *)
            echo "無効な選択です。1-7を選択してください。"
            ;;
    esac
    echo ""
    read -p "Enterキーを押して続行..."
    echo ""
done
