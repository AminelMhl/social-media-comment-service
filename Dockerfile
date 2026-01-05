FROM node:20-alpine

WORKDIR /usr/src/app

RUN addgroup -g 1001 nodegrp \
    && adduser -D -u 1001 -G nodegrp nodeuser

COPY package.json tsconfig.json tsconfig.build.json ./

RUN npm install

COPY src ./src

RUN npm run build

RUN chown -R nodeuser:nodegrp /usr/src/app

USER nodeuser

CMD ["npm", "start"]
