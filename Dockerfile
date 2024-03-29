FROM node:18.17-slim

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile && yarn run build

EXPOSE 3000

CMD ["yarn", "start"]
