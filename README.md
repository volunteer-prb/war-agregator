# war-aggregator

Service for aggregate news about war in Ukraine

## Getting started

- Make sure you have [NVM](https://github.com/nvm-sh/nvm) installed
- Run `nvm use` to use correct NPM version
  - You might have to install is separately with `nvm install`
- Run `npm install` in the root directory to install all dependencies
- Install pre-commit hooks `npm run prepare`

### Frontend setup

- Run `docker-compose up` at backend folder to start backend
- Run frontend `npm start` to start FE

### Backend setup

- Run `docker-compose up -d db` and `docker-compose up -d storage` to bootstrap database and file storage
- Run `npm run migrate` to setup database at backend
- Run `npm start` at backend

Please, run `npm run gen:api` at frontend to update API schema typings

Backend .env

```
UPDATE_INTERVAL=15000

DATABASE_URL=postgresql://test_user:test_password@localhost:5433/prb?schema=public

POSTGRES_USER=test_user
POSTGRES_PASSWORD=test_password
MINIO_ROOT_USER=test_user
MINIO_ROOT_PASSWORD=test_password
MINIO_END_POINT=http://localhost
MINIO_PORT=9000
GETAWAY_END_POINT=http://localhost
```
