FROM node:9.2.0
ENV NODE_ENV production
ADD package.json /package.json
RUN npm install --production --silent && npm install -g react-scripts --silent
EXPOSE 3000