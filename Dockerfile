FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV TZ=Pacific/Auckland

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD ["npm", "run", "start"]