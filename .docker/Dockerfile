# build environment
FROM node:12.12-alpine as build
WORKDIR /app
COPY . /app
RUN yarn install
#ENV PATH /app/node_modules/.bin:$PATH
RUN yarn build --mode=production

# production environment
FROM nginx:1.16.1-alpine
#RUN rm /etc/nginx/conf.d/default.conf
#RUN rm /etc/nginx/conf.d/examplessl.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY .docker/nginx/ /etc/nginx/
EXPOSE 80
CMD ["nginx-debug", "-g", "daemon off;"]
