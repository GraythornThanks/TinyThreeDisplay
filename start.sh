#!/bin/bash

# 检查是否安装了必要的软件
check_dependencies() {
    echo "检查依赖..."
    
    if ! command -v docker &> /dev/null; then
        echo "错误: 未安装 Docker"
        echo "请访问 https://docs.docker.com/get-docker/ 安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        echo "错误: 未安装 Docker Compose"
        echo "请访问 https://docs.docker.com/compose/install/ 安装 Docker Compose"
        exit 1
    fi
}

# 检查配置文件
check_config() {
    echo "检查配置..."
    
    if [ ! -f "backend/.env" ]; then
        echo "未找到配置文件，正在创建..."
        if [ -f "backend/.env.example" ]; then
            cp backend/.env.example backend/.env
            echo "已创建配置文件，请编辑 backend/.env 设置合适的配置"
            exit 1
        else
            echo "错误: 未找到配置文件模板"
            exit 1
        fi
    fi
}

# 启动服务
start_services() {
    echo "启动服务..."
    
    # 停止可能正在运行的容器
    docker-compose down

    # 构建并启动容器
    docker-compose up --build -d

    echo "服务启动完成！"
    echo "前端地址: http://localhost:5173"
    echo "后端地址: http://localhost:8000"
    echo "API文档: http://localhost:8000/docs"
}

# 主函数
main() {
    echo "ThreeDisplay 启动脚本"
    echo "===================="
    
    check_dependencies
    check_config
    start_services
}

# 执行主函数
main 