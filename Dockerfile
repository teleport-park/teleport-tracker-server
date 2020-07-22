FROM node:12 AS env-image

## BUILDING
FROM env-image AS build-image
WORKDIR app
COPY . .
RUN npm install
RUN npm run build
RUN ls -la

### RUNNER
FROM build-image AS run-image
#
## Configuration vars
ENV APP_PORT 80
#
ENV NODE_ENV "production"
ENV DEBUG "*"
#
#COPY --from=build-image /export /tmp/export
#RUN ls /tmp/export/*.tgz | head -1 | xargs npm install && rm -r /tmp/export
#
#WORKDIR "node_modules/@teleport-park/tracker-server"

WORKDIR app
CMD npm start
