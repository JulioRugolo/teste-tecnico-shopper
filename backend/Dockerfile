FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g sequelize-cli

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
