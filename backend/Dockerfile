FROM node:20.2.0-alpine3.17
RUN addgroup app && adduser -S -G app app
USER app

COPY --chown=app:app package*.json /app/
WORKDIR /app

RUN npm install

COPY --chown=app:app . .

EXPOSE 3000

CMD ["node", "index.js"]