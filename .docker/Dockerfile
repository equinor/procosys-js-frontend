# build environment
FROM node:14.4.0 as build
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build --mode=production

# production environment
FROM nginx:1.19.0-alpine
## add permissions for nginx user
RUN apk add python3
RUN chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid
COPY --chown=nginx:nginx --from=build /app/build /usr/share/nginx/html
COPY --chown=nginx:nginx .docker/nginx/ /etc/nginx/
COPY --chown=nginx:nginx .docker/scripts/ /etc/scripts/
EXPOSE 5000
USER nginx
CMD ["sh","/etc/scripts/startup.sh"]
