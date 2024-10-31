FROM registry.cn-beijing.aliyuncs.com/wa/dev:node_20 AS building

WORKDIR /app
ADD . /app

RUN pnpm install && pnpm run build:test

FROM registry.cn-beijing.aliyuncs.com/wa/dev:nginx_alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=building /app/dist/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
