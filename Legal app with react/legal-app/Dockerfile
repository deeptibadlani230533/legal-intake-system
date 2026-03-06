FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN NODE_OPTIONS=--max-old-space-size=2048 npm run build

RUN npm install -g serve

EXPOSE 5173

CMD serve -s dist -l 5173