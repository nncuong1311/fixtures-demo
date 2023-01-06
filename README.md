## Prerequisite
- Docker
- Nodejs
- Git
- Clone repository from Github to local

## Setup database
Run following command in terminal to create a docker container for Mysql server

`docker run --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=P@ssword -d mysql`

Mysql server will be ready in 1-2 minutes

## Start service
After Mysql server is ready, open repository root folder in terminal, run command `npm run start` to initialize demo data and start service

- Service will be ready to use with url http://localhost:9000
- API document: http://localhost:9000/documentation/static/index.html
- Database diagram: http://localhost:9000/public/db-diagram.png

## Testing
Run command `npm run test` in terminal to run automated test for service