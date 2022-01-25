#!/bin/bash

project='trigpointinguk'

echo -n "undefined" | gcloud secrets create TME_POSTGRES_USER --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TME_POSTGRES_PASSWORD --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TME_POSTGRES_PORT --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TME_POSTGRES_DATABASE --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TME_POSTGRES_HOST --data-file=- --project=$project

echo -n "undefined" | gcloud secrets create TUK_POSTGRES_USER --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TUK_POSTGRES_PASSWORD --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TUK_POSTGRES_PORT --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TUK_POSTGRES_DATABASE --data-file=- --project=$project
echo -n "undefined" | gcloud secrets create TUK_POSTGRES_HOST --data-file=- --project=$project
