#!/bin/bash

project='trigpointinguk'

url=$(heroku config:get DATABASE_URL -a trigpointing-uk)

echo $url
user=$(echo $url | sed 's%.*//\([^:]*\):.*%\1%')
pass=$(echo $url | sed 's%.*:.*:\([^@]*\)@.*%\1%')
host=$(echo $url | sed 's%.*@\([^:]*\):.*%\1%')
port=$(echo $url | sed 's%.*:\([^/]*\)/.*%\1%')
data=$(echo $url | sed 's%.*/\(.*\)%\1%')

hostip=$(getent hosts $host | awk '{ print $1 }')

echo -e "POSTGRES_HOST=${host}\nPOSTGRES_PORT=${port}\nPOSTGRES_USER=${user}\nPOSTGRES_PASSWORD=${pass}\nPOSTGRES_DATABASE=${data}\n"

echo -n $user | gcloud secrets versions add TUK_POSTGRES_USER --data-file=- --project=$project
echo -n $pass | gcloud secrets versions add TUK_POSTGRES_PASSWORD --data-file=- --project=$project
echo -n $port | gcloud secrets versions add TUK_POSTGRES_PORT --data-file=- --project=$project
echo -n $data | gcloud secrets versions add TUK_POSTGRES_DATABASE --data-file=- --project=$project
echo -n $host | gcloud secrets versions add TUK_POSTGRES_HOST --data-file=- --project=$project
#echo $hostip | gcloud secrets versions add TUK_POSTGRES_HOST --data-file=- --project=$project
