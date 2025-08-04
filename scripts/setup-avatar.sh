#!/bin/bash

# SyntaxSeed 头像配置脚本
# 使用方法: ./scripts/setup-avatar.sh [avatar-file-path]

set -e

AVATAR_FILE="$1"
CUSTOM_ASSETS_DIR="./custom-assets"
TARGET_FILE="$CUSTOM_ASSETS_DIR/avatar.jpg"

# 检查参数
if [ -z "$AVATAR_FILE" ]; then
    echo "使用方法: $0 <头像文件路径>"
    echo "示例: $0 /path/to/your/avatar.jpg"
    exit 1
fi

# 检查文件是否存在
if [ ! -f "$AVATAR_FILE" ]; then
    echo "错误: 文件 '$AVATAR_FILE' 不存在"
    exit 1
fi

# 创建目录
echo "创建自定义资源目录..."
mkdir -p "$CUSTOM_ASSETS_DIR"

# 复制头像文件
echo "复制头像文件..."
cp "$AVATAR_FILE" "$TARGET_FILE"

# 设置权限
chmod 644 "$TARGET_FILE"

echo "✅ 头像配置完成！"
echo "📁 头像文件位置: $TARGET_FILE"
echo ""
echo "接下来的步骤："
echo "1. 确保 docker-compose.prod.simple.yml 中已配置文件挂载"
echo "2. 运行: docker-compose -f docker-compose.prod.simple.yml up -d"
echo "3. 访问你的网站查看新头像"
echo ""
echo "或者设置环境变量 AVATAR_URL 使用远程 URL："
echo "export AVATAR_URL=https://your-domain.com/avatar.jpg"