FROM node:19.9.0-alpine

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

RUN npm install -g @babel/core @babel/cli

COPY . .

RUN npm run build

ENV NODE_ENV=PRODUCT 

CMD [ "npm", "run", "product" ]


# docker build --tag node-docker .
# docker run -p 8080:8080 -d node-docker