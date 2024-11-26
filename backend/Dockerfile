FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Instala globalmente ferramentas necessárias (opcional)
RUN npm install -g sequelize-cli nodemon ts-node

# Copia todo o código fonte
COPY . .

# Executa o build do projeto TypeScript
RUN npm run build

# Expõe a porta
EXPOSE 8080

# Define o comando de inicialização (executa o JavaScript gerado pelo build)
CMD ["npm", "start"]
