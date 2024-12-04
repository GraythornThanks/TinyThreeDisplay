# 使用Python 3.11作为基础镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 安装系统依赖
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# 复制项目文件
COPY requirements.txt .
COPY app/ ./app/
COPY main.py .

# 安装Python依赖（支持使用国内源）
ARG USE_CHINESE_MIRRORS=false
RUN if [ "$USE_CHINESE_MIRRORS" = "true" ] ; then \
        pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && \
        pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn ; \
    fi && \
    pip install --no-cache-dir -r requirements.txt

# 创建上传目录
RUN mkdir -p /app/uploads/avatars && \
    chmod -R 755 /app/uploads

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"] 