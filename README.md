# lfg

### setup

Projet uses node 22.5.1 or higher and yarn 4+

To setup yarn 4 run

- corepack enable
- yarn set version stable
- yarn install

### local

to start the api locally, you'll need a postgres connection, create a .env file based on .env.example and then run `yarn dev`

#### postgres docker

run a postgres container

`docker run --name lfg -e POSTGRES_PASSWORD=mysecretpassword -v lfg:/var/lib/postgresql/data -p 5432:5432 -d postgres`

connect to container

`docker exec -it lfg psql -U postgres`

create the database

`docker exec -it lfg psql -U postgres -c "CREATE DATABASE lfg;"`

## Running scripts

To run scripts you need to use `ts-node` and register the pathings. You can either do it using `yarn script <script path> ` or manbually type `ts-node -r tsconfig-paths/register <script path>`
