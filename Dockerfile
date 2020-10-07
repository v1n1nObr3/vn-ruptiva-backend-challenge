FROM node:12.18.4

WORKDIR /backend

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "build/index.js"]
