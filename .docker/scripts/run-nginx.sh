#!/bin/sh
echo "Starting NGINX"
envsubst '
  ${PRESERVATION_API_SCOPE}
  ${PRESERVATION_API_URL}
  ${SEARCH_API_SCOPE}
  ${SEARCH_API_URL}
  ${IPO_API_SCOPE}
  ${IPO_API_URL}
  ${PROCOSYS_API_SCOPE}
  ${PROCOSYS_API_URL}
  ${LIBRARY_API_SCOPE}
  ${LIBRARY_API_URL}
  ${INSTRUMENTATION_KEY}
  ${CLIENT_ID}
  ${SCOPES}
  ${FEATURE_FLAGS}
  ${HEADER_COLOR}
  ' </usr/share/nginx/html/index.html >/usr/share/nginx/html/tmp.html
mv /usr/share/nginx/html/tmp.html /usr/share/nginx/html/index.html
nginx -g 'daemon off;'
