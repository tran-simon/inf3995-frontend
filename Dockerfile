FROM node

WORKDIR /root/frontend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY tsconfig.json ./
COPY src/ ./src/
COPY public/ ./public/

ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
