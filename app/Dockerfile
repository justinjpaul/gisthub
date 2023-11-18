FROM node:18.0.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . ./

RUN npm install -g --silent

CMD ["npm", "start"]