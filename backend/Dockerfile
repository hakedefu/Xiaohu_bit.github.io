FROM node:20-bullseye-slim

WORKDIR /app

# Prisma needs OpenSSL; Debian slim doesn't include it by default.
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Ensure npm uses the public npm registry (avoid private registry resolution issues)
COPY .npmrc ./
RUN npm config set registry https://registry.npmjs.org/

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run prisma:generate

RUN npm run build

EXPOSE 4000

CMD ["npm", "start"]
