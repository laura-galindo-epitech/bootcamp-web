# ---- Base image ----
FROM node:20-alpine
WORKDIR /app

# Install dependencies for Alpine
RUN apk add --no-cache libc6-compat

# ---- Copy package files from subfolder ----
COPY web/package.json web/package-lock.json* ./web/

# Install dependencies
WORKDIR /app/web
RUN npm ci

# ---- Copy the full app ----
COPY web ./web

# ---- Build ----
RUN npm run build

# ---- Expose port ----
EXPOSE 3000
ENV NODE_ENV=production

# ---- Start the app ----
CMD ["npm", "run", "start"]
