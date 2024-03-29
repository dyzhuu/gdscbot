FROM node:18-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV TZ=Pacific/Auckland

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["npm", "run", "start"]