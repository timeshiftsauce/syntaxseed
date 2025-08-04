@echo off
REM SyntaxSeed 头像配置脚本 (Windows)
REM 使用方法: setup-avatar.bat [avatar-file-path]

setlocal

set "AVATAR_FILE=%~1"
set "CUSTOM_ASSETS_DIR=.\custom-assets"
set "TARGET_FILE=%CUSTOM_ASSETS_DIR%\avatar.jpg"

REM 检查参数
if "%AVATAR_FILE%"=="" (
    echo 使用方法: %0 ^<头像文件路径^>
    echo 示例: %0 C:\path\to\your\avatar.jpg
    exit /b 1
)

REM 检查文件是否存在
if not exist "%AVATAR_FILE%" (
    echo 错误: 文件 '%AVATAR_FILE%' 不存在
    exit /b 1
)

REM 创建目录
echo 创建自定义资源目录...
if not exist "%CUSTOM_ASSETS_DIR%" mkdir "%CUSTOM_ASSETS_DIR%"

REM 复制头像文件
echo 复制头像文件...
copy "%AVATAR_FILE%" "%TARGET_FILE%" >nul

echo ✅ 头像配置完成！
echo 📁 头像文件位置: %TARGET_FILE%
echo.
echo 接下来的步骤：
echo 1. 确保 docker-compose.prod.simple.yml 中已配置文件挂载
echo 2. 运行: docker-compose -f docker-compose.prod.simple.yml up -d
echo 3. 访问你的网站查看新头像
echo.
echo 或者设置环境变量 AVATAR_URL 使用远程 URL：
echo set AVATAR_URL=https://your-domain.com/avatar.jpg

endlocal