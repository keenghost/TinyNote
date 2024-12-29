FROM node:20.18.1-alpine

ARG NPM_REGISTRY=https://registry.npmjs.org

WORKDIR /tinynote

COPY . .

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk add --no-cache tzdata dumb-init && \
    echo 'if [ -n "$TZ" ]; then' >> /etc/profile && \
    echo '  export TZ=$TZ' >> /etc/profile && \
    echo "fi" >> /etc/profile && \
    npm install -g pnpm --registry=$NPM_REGISTRY && \
    pnpm install --registry=$NPM_REGISTRY && \
    pnpm build srv web && \
    rm -rf /tinynote/packages/web/node_modules && \
    rm -rf /tinynote/packages/srv/node_modules && \
    rm -rf /tinynote/node_modules && \
    pnpm store prune && \
    pnpm install --prod --ignore-scripts --registry=$NPM_REGISTRY

WORKDIR /tinynote/packages/srv/dist

CMD ["dumb-init", "pnpm", "run", "start"]
