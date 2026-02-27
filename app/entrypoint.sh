#!/bin/sh
# Generate runtime env config from container environment
cat > /usr/share/nginx/html/env-config.js <<EOF
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF

exec nginx -g "daemon off;"
