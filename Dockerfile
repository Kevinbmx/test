#FROM node:10-alpine as build-stage
FROM node as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --no-optional
RUN npm audit fix
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
# primero correr esto   docker build . -t ninostore_vuejs my-app
#correr esto en el cmd --- docker run -d -p 8000:80 ninostore_vuejs---
