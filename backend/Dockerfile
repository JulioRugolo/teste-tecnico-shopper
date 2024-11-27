# Use uma imagem leve do Node.js
FROM node:18-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie apenas os arquivos essenciais para instalar dependências
COPY package*.json tsconfig.json ./

# Instale as dependências
RUN npm install --legacy-peer-deps

# Copie o restante dos arquivos do projeto
COPY . .

# Compile o TypeScript
RUN npm run build

# Expõe a porta do servidor
EXPOSE 8080

# Comando para rodar o servidor em produção
CMD ["npm", "start"]
