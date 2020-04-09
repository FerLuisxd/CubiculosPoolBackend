FROM node:13

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm install
RUN npm run start
COPY . .
EXPOSE 8080
EXPOSE 3000
# CMD ['npm','run',"start"]

