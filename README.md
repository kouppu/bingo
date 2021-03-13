# start

## development env

- docker-compose -f docker-compose.development.yml up -d

## production env

- git clone git@github.com:suhrr/bingo.git
- edit ./.env and ./client/.env
- export $(cat .env | grep -v ^# | xargs); sh dockerRun.sh
