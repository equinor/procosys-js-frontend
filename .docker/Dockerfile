# build environment
FROM node:12.12-alpine as build
WORKDIR /app
COPY . /app
RUN ls -la
COPY package.json /app/package.json
RUN ls -la
#RUN yarn install
#RUN yarn build --mode=production

# production environment
# FROM nginx:1.16.1-alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY .docker/nginx/ /etc/nginx/
# EXPOSE 80
# CMD ["nginx-debug", "-g", "daemon off;"]