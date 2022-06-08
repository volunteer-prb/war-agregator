FROM buildkite/puppeteer:10.0.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --productions

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["exec npm run start:prod"]