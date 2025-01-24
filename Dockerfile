# Usando uma imagem base do Node.js
FROM node:18-alpine

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar os arquivos do projeto para o contêiner
COPY . .

# Instalar as dependências
RUN npm install

# Expõe a porta 3010
EXPOSE 3010

# Rodar o servidor da API
CMD ["node", "app.js"]
