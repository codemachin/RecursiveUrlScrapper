FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY ./server ./server
ENV MONGOHOST=mongodb://vivek:qwerty1@ds113826.mlab.com:13826/vivek5409
EXPOSE 8080
CMD ["npm", "run", "start"]