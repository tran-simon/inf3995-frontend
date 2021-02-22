FROM node

WORKDIR /root/frontend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

ENV REACT_APP_BACKEND_URL=http://inf3995-backend:5000
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
