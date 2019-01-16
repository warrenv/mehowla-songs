FROM node:10.15.0

RUN echo 'PS1="\u@${PROJECT_NAME:-noProject}/${SERVICE_NAME:-noService}:\w# "' >> ~/.bashrc

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . /usr/src/app/

CMD [ "npm", "start" ]
