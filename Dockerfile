FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json tsconfig.json tsconfig.build.json ./

RUN npm install

COPY src ./src

RUN npm run build

CMD ["npm", "start"]

