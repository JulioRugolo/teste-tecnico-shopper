FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]
