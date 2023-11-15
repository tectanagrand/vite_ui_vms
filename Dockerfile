FROM node:18-alpine

WORKDIR /usr/src/app

COPY package.json ./

COPY package-lock.json ./

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install 

COPY . .

EXPOSE 3000

CMD npm start --host 0.0.0.0 --port 3000 --disableHostCheck true