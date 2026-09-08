FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist/investment-web/browser ./browser

EXPOSE 8080

CMD ["sh", "-c", "serve -s browser -l ${PORT:-8080}"]