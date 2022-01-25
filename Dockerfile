FROM node:17-alpine As development

# Get node-pre-gyp errors without python.  
# Basing on alpine smaller than node:17 image
RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:17-alpine As production

RUN apk add --update python3 make g++\
   && rm -rf /var/cache/apk/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
