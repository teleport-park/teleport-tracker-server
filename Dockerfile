FROM node:12 AS env-image

## BUILDING UI
FROM teleportpark/tracker-ui AS ui-image
WORKDIR dist

## BUILDING APP
FROM env-image AS build-image
WORKDIR app
COPY . .
RUN npm install
RUN npm run build

COPY --from=ui-image /dist/* ./assets/ui/

### RUNNER
FROM build-image AS run-image
## Configuration vars
ENV APP_PORT 80
ENV NODE_ENV "production"
ENV DEBUG "*"

WORKDIR app
CMD npm start
