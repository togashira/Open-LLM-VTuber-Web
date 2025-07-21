#!/bin/bash

echo "🚀 Open LLM VTuber - Release Checklist v1.2.0"
echo ""

# 現在のブランチ確認
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "web-release" ]; then
    echo "⚠️  Warning: Not on main or web-release branch"
fi

echo ""
echo "✅ Pre-release checklist:"
echo ""

# 1. ビルドテスト
echo "1️⃣ Running build tests..."
npm run typecheck
if [ $? -eq 0 ]; then
    echo "   ✅ TypeScript check passed"
else
    echo "   ❌ TypeScript check failed"
    exit 1
fi

npm run lint:fix
echo "   ✅ Linting completed"

# 2. Web版ビルドテスト
echo ""
echo "2️⃣ Testing web build..."
npm run build:web
if [ $? -eq 0 ]; then
    echo "   ✅ Web build successful"
else
    echo "   ❌ Web build failed"
    exit 1
fi

# 3. Electron版ビルドテスト
echo ""
echo "3️⃣ Testing Electron build..."
npm run build
if [ $? -eq 0 ]; then
    echo "   ✅ Electron build successful"
else
    echo "   ❌ Electron build failed"
    exit 1
fi

# 4. 設定ファイル確認
echo ""
echo "4️⃣ Checking configuration files..."
FILES_TO_CHECK=(
    ".env.example"
    ".env.production" 
    "HTTPS_DEPLOY.md"
    "BACKEND_CONFIG.md"
    "CHANGELOG.md"
    "nginx.conf"
    "docker-compose.yml"
    "https-setup.sh"
    "generate-certs.sh"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file missing"
        exit 1
    fi
done

# 5. Git状態確認
echo ""
echo "5️⃣ Checking Git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "   ⚠️  Uncommitted changes detected:"
    git status --short
    echo ""
    read -p "   Continue with uncommitted changes? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   ❌ Release cancelled"
        exit 1
    fi
else
    echo "   ✅ Working directory clean"
fi

# 6. バージョン確認
echo ""
echo "6️⃣ Version information:"
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "   📦 Package version: $CURRENT_VERSION"
echo "   🏷️  Git tags:"
git tag --sort=-version:refname | head -5

echo ""
echo "🎯 Release summary for v$CURRENT_VERSION:"
echo "   • HTTPS Web Deploy Support"
echo "   • Live2D Model File Loading Fix"
echo "   • itcometrue.academy Environment Support"
echo "   • Complete Docker deployment setup"
echo "   • Enhanced configuration management"

echo ""
echo "📋 Next steps:"
echo "   1. git add ."
echo "   2. git commit -m 'Release v$CURRENT_VERSION: HTTPS Web Deploy Support'"
echo "   3. git tag v$CURRENT_VERSION"
echo "   4. git push origin $CURRENT_BRANCH"
echo "   5. git push origin v$CURRENT_VERSION"

echo ""
echo "🌐 Deployment commands:"
echo "   • Development: ./https-setup.sh"
echo "   • Production:  docker-compose up -d --build"
echo "   • itcometrue:  ./https-setup.sh (option 6)"

echo ""
echo "✅ Release check completed successfully!"
