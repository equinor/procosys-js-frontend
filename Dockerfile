FROM node:20 as build
WORKDIR /app
COPY . .
RUN npm i -g pnpm@9.0.5
RUN pnpm install

RUN pnpm bundle

FROM docker.io/nginxinc/nginx-unprivileged:alpine

WORKDIR /app

COPY --from=build /app/dist /usr/share/nginx/html
COPY .docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY .docker/scripts/ /etc/scripts/

USER 0
RUN chown -R nginx /etc/nginx/conf.d \
    && chown -R nginx /app \
    && chown -R nginx /usr/share/nginx/html \
    && chmod +x run-nginx.sh 

 
USER 101
EXPOSE 5000

CMD ["sh","/etc/scripts/run-nginx.sh"]
