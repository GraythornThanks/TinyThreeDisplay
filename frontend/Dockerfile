# 构建阶段
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV VITE_API_URL=/api/v1
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# 创建上传目录
RUN mkdir -p /usr/share/nginx/html/uploads/avatars

# 复制Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 设置权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 