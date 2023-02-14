FROM node:18-alpine AS build
# We need devDependencies:
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
RUN mkdir -p /usr/src/app \
  && chown node:node /usr/src/app
WORKDIR /usr/src/app
RUN npm install -g @vscode/vsce@2.15.0
USER node
COPY package*.json /usr/src/app/
RUN npm ci && npm cache clean --force
COPY ./ /usr/src/app/
RUN vsce package --out extension.vsix

FROM scratch
COPY --from=build /usr/src/app/extension.vsix /
