#!/bin/sh

# Docker 容器启动脚本 - 支持运行时环境变量替换

set -e

# 默认值
VITE_AVATAR_URL=${VITE_AVATAR_URL:-"/avatar.jpg"}
VITE_API_BASEURL=${VITE_API_BASEURL:-"/api"}
VITE_staticHost=${VITE_staticHost:-"./"}

echo "🚀 启动 SyntaxSeed 前端容器..."
echo "📸 头像 URL: $VITE_AVATAR_URL"
echo "🔗 API 地址: $VITE_API_BASEURL"

# 创建运行时配置文件
cat > /usr/share/nginx/html/config.js << EOF
window.__RUNTIME_CONFIG__ = {
  VITE_AVATAR_URL: '$VITE_AVATAR_URL',
  VITE_API_BASEURL: '$VITE_API_BASEURL',
  VITE_staticHost: '$VITE_staticHost'
};
EOF

echo "✅ 运行时配置已生成"

# 启动 nginx
exec nginx -g 'daemon off;'