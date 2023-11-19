FROM node:18.0.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY . ./

RUN npm install --silent

CMD ["npm", "start"]