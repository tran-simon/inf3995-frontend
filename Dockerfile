FROM node

WORKDIR /root/frontend

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./

ENV REACT_APP_BACKEND_URL=http://0.0.0.0:5000
ENV PORT=3000

EXPOSE 3000

CMD ["yarn", "start"]
