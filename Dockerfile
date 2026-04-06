FROM node:20 AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 80

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS prod

COPY nginx.prod.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80