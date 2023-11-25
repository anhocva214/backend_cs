FROM node:18.17.1

WORKDIR /usr/src/app

COPY package*.json .
RUN npm install 
COPY . .

ARG DOCKER_ENV=local
ENV NODE_ENV=$DOCKER_ENV

CMD ["npm", "run","start"]
