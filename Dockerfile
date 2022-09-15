FROM --platform=linux/amd64 node:18-alpine

COPY . .

RUN yarn install --prod

CMD [ "yarn", "start" ]

