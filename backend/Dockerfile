FROM node:20-alpine

WORKDIR /app

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
