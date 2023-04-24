# React Frontend Dockerfile

FROM node:16 as build-stage
WORKDIR /var/jenkins_home/workspace/gitlab/frontend
COPY package*.json ./
# ARG DISABLE_CACHE
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /var/jenkins_home/workspace/gitlab/frontend/build /usr/share/nginx/html
EXPOSE 3000
# EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]