# Changelog

## [1.2.0] - 2025-07-21

### 🚀 Added
- **HTTPS Web Deploy Support**: Complete HTTPS web application deployment capability
- **Live2D Model File Loading Fix**: Fixed Live2D model file loading issues in production environment
- **Environment-based Auto Configuration**: Automatic URL detection based on deployment environment
- **itcometrue.academy Environment Support**: Tested and optimized for itcometrue.academy deployment

### 🔧 Enhanced
- **WebSocket Context**: Improved URL generation with environment variable support
- **Nginx Configuration**: Added Live2D model file proxy settings with CORS support
- **Docker Compose**: Enhanced production deployment with backend service integration
- **SSL Certificate Management**: Automated certificate generation and deployment scripts

### 📝 Configuration Files
- Added `.env.production` for itcometrue.academy production settings
- Enhanced `.env.example` with comprehensive environment variable documentation
- Added `BACKEND_CONFIG.md` for detailed backend connection documentation
- Added `HTTPS_DEPLOY.md` for complete HTTPS deployment guide

### 🛠️ Developer Tools
- Added `https-setup.sh` interactive setup tool
- Added `generate-certs.sh` SSL certificate generation script
- Added `useLive2DDebug` hook for connection debugging
- Enhanced Live2D component with debug capabilities

### 🎯 Connection Settings
- **Development**: `ws://127.0.0.1:12393` → `http://127.0.0.1:12393`
- **Production**: `wss://itcometrue.academy/client-ws` → `https://itcometrue.academy`
- **Model Files**: Proper HTTPS loading for Live2D assets

### 📦 Scripts Added
- `dev:web:https`: HTTPS development server
- `build:web:production`: Production web build
- `preview:web:https`: HTTPS preview server

### 🐛 Fixed
- Live2D model file loading from backend (`/live2d-models/mao_pro`)
- Mixed content issues in HTTPS environment
- Proper URL construction for backend resources

### 🔐 Security
- HTTPS enforcement with automatic HTTP→HTTPS redirects
- Security headers implementation (HSTS, CORS, XSS protection)
- SSL/TLS optimization for production deployment

### 📚 Documentation
- Complete deployment guide for HTTPS web applications
- Backend configuration examples with real-world settings
- Docker deployment instructions
- Troubleshooting guide for common issues

---

## [1.1.0] - Previous Release
- Initial Electron application functionality
