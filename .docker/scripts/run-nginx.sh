#!/bin/sh
echo "Starting NGINX"
envsubst '
  ${CONFIGURATION}
  ${AUTH_CONFIG}
  ${FEATURE_FLAGS}
  ' </usr/share/nginx/html/index.html >/usr/share/nginx/html/tmp.html
mv /usr/share/nginx/html/tmp.html /usr/share/nginx/html/index.html
nginx -g 'daemon off;'
