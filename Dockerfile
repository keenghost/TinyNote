FROM node:20.18.1-alpine

ARG NPM_REGISTRY=https://registry.npmjs.org

WORKDIR /builddir

COPY . .

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories && \
    apk add --no-cache tzdata dumb-init && \
    echo 'if [ -n "$TZ" ]; then' >> /etc/profile && \
    echo '  export TZ=$TZ' >> /etc/profile && \
    echo "fi" >> /etc/profile && \
    npm install -g pnpm --registry=$NPM_REGISTRY && \
    pnpm install --registry=$NPM_REGISTRY && \
    pnpm build srv web && \
    mv /builddir/packages/srv/dist /tinynote && \
    cd /tinynote && \
    rm -rf /builddir && \
    pnpm store prune && \
    pnpm install --prod --registry=$NPM_REGISTRY

WORKDIR /tinynote

CMD ["dumb-init", "pnpm", "run", "start"]
