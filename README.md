# open-llm-vtuber-electron

An Electron application with React and TypeScript - **Now with HTTPS Web Deploy Support!**

> 🚀 **v1.2.0**: Full HTTPS web application deployment capability with Live2D model file loading support

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Web版（HTTPS対応）

このアプリケーションはWebアプリケーションとしてもビルド・デプロイできます。

### 開発環境

```bash
# Web版開発サーバー（HTTP）
$ npm run dev:web

# Web版開発サーバー（HTTPS）
$ npm run dev:web:https
```

### Web版ビルド

```bash
# Web版をビルド
$ npm run build:web

# プレビューサーバーで確認（HTTP）
$ npm run preview:web

# プレビューサーバーで確認（HTTPS）
$ npm run preview:web:https
```

### HTTPS公開

詳細なHTTPS公開手順については、[HTTPS_DEPLOY.md](./HTTPS_DEPLOY.md) を参照してください。

#### 簡単セットアップ
```bash
# インタラクティブなHTTPS設定ツールを実行
$ ./https-setup.sh
```

#### Docker Composeを使用
```bash
# SSL証明書を生成
$ ./generate-certs.sh

# HTTPS対応でデプロイ
$ docker-compose up -d --build
```

アクセス先:
- HTTP: http://localhost （HTTPSにリダイレクト）
- HTTPS: https://localhost
