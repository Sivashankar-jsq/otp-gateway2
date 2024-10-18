FROM node:18-buster-slim as base

WORKDIR /app
RUN yarn set version berry
RUN yarn --version
COPY .yarn/cache/ .yarn/cache/
COPY .yarn/plugins/ .yarn/plugins/
COPY .yarn/releases/ .yarn/releases/

FROM base as install-deps
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./

FROM install-deps as build
COPY src src
COPY tsconfig.json ./
RUN yarn build

FROM base as prod-deps
COPY package.json yarn.lock .pnp.cjs .yarnrc.yml ./
RUN yarn workspaces focus --all --production
RUN yarn

FROM base as release
ENV NODE_ENV production
USER node

COPY --from=prod-deps /app/.yarn .yarn
COPY --from=prod-deps /app/.pnp.cjs .pnp.cjs
COPY --from=build /app/build build


EXPOSE 8080 8081
CMD ["node", "-r", "./.pnp.cjs", "build/index.js"]
