@echo off
REM Railway 后端部署脚本 (Windows)

echo.
echo ========================================
echo Railway 后端部署 - 一键启动
echo ========================================
echo.

setlocal enabledelayedexpansion

REM 检查是否已安装Railway CLI
where railway >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Railway CLI
    echo.
    echo 请按以下步骤安装:
    echo 1. 访问: https://railway.app
    echo 2. 使用GitHub账户登录
    echo 3. 点击 "New Project"
    echo 4. 选择 "Deploy from GitHub repo"
    echo 5. 选择 Xiaohu_bit.github.io 仓库
    echo.
    echo 然后在项目设置中:
    echo - 添加 PostgreSQL 数据库
    echo - 设置环境变量（见下面的说明）
    echo - 点击 Deploy
    echo.
    pause
    exit /b 1
)

echo ✅ Railway CLI 已检测到
echo.
echo 现在将配置后端部署...
echo.

REM 显示部署步骤
echo ========================================
echo 必要的环境变量配置
echo ========================================
echo.
echo 请在 Railway 项目中设置以下环境变量:
echo.
echo 1. DATABASE_URL
echo    (Railway自动生成的PostgreSQL连接字符串)
echo.
echo 2. JWT_SECRET
echo    示例: !RANDOM!!RANDOM!!RANDOM!!RANDOM!
echo.
echo 3. CORS_ORIGIN
echo    值: https://hakedefu.github.io
echo.
echo 4. NODE_ENV
echo    值: production
echo.
echo 5. PORT
echo    值: 4000
echo.
echo ========================================
echo.

REM 提示用户手动配置
echo 📝 请手动完成以下步骤:
echo.
echo 1. 访问 https://railway.app
echo 2. 登录你的Railway账户
echo 3. 打开 Xiaohu_bit.github.io 项目
echo 4. 添加新的服务或更新现有服务
echo 5. 配置上述环境变量
echo 6. 选择部署
echo.

echo ✅ 部署步骤已显示
echo.
echo 等待部署完成后 (通常需要5-10分钟):
echo 1. 访问前端: https://hakedefu.github.io
echo 2. 记下Railway提供的后端URL
echo 3. 更新 frontend/.env.production
echo.

pause
