@echo off
echo ThreeDisplay 启动脚本
echo ====================

REM 检查依赖
echo 检查依赖...
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未安装 Docker
    echo 请访问 https://docs.docker.com/get-docker/ 安装 Docker
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未安装 Docker Compose
    echo 请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose
    pause
    exit /b 1
)

REM 检查配置文件
echo 检查配置...
if not exist backend\.env (
    echo 未找到配置文件，正在创建...
    if exist backend\.env.example (
        copy backend\.env.example backend\.env
        echo 已创建置文件，请编辑 backend\.env 设置合适的配置
        pause
        exit /b 1
    ) else (
        echo 错误: 未找到配置文件模板
        pause
        exit /b 1
    )
)

REM 启动服务
echo 启动服务...

REM 停止可能正在运行的容器
docker-compose down

REM 构建并启动容器
docker-compose up --build -d

echo 服务启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8000
echo API文档: http://localhost:8000/docs

pause 