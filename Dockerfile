FROM node:13 AS base

WORKDIR /app
RUN npm install
RUN npm run build
COPY  dist/main.js dist/main.js

#################################

FROM base AS dev

COPY bashrc /root/.bashrc
RUN npm install -g nodemon

#################################

FROM base AS prod

EXPOSE 8080
CMD node app.js
