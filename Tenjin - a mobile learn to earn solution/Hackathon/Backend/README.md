# Tenjin-API

### First thing first, please run postgres DB localy in a Docker Container.

#### Make sure you have Docker installed on your machine.
#### Run the following command:

$ docker version || or $ docker info || or $ docker ps

#### In case you need to install docker follow this link:

https://docs.docker.com/get-docker/

#### Once docker is installed please run the following command:

$ docker compose up -d

#### The container should be running with postgreas DB.

#### To check which containers are running, run the following command:

$ docker ps   

#### To check running containers history.
 
$ docker ps -a

#### Run the next command to migrate all models/tables to the postgres DB.

$ python manage.py migrate

### In order to conect to PGadmin or Pycharm DB interface pass the following credentials.

#### Host: localhost 
#### Password: postgres 
#### User: postgres 
#### port: 5432 # Default port for postgresDB

Postgres DB is running and you can run the Django Dev Server now using the following command:

$ python manage.py runserver


#### In order to shut down the postgres container run the following command:

$ docker compose down
# tenjin_rootstock_backend-blockchain_all
