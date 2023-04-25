# React Frontend Dockerfile
FROM node:16.19 as build-stage
WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
# react 등 필요한 API 설치하기
# RUN npm install react-scripts@2.1.3 -g
# 소스를 작업폴더로 복사하고 빌드
COPY . /app
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]