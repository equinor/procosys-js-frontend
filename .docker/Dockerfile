# build environment
FROM node:20.2.0 as build
WORKDIR /app
COPY . /app
RUN npm i -g pnpm@9.0.5
RUN pnpm install
RUN pnpm build --mode=production

# production environment
FROM nginx:1.25.0-alpine
## add permissions for nginx user
RUN apk add python3
COPY --from=build /app/build /usr/share/nginx/html
COPY .docker/nginx/ /etc/nginx/
COPY  .docker/scripts/ /etc/scripts/
EXPOSE 5000
CMD ["sh","/etc/scripts/startup.sh"]
