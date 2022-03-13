#!/bin/bash

gcloud run deploy api-tme \
  --image=europe-west1-docker.pkg.dev/trigpointinguk/images/tuk-api:tme \
  --region=europe-west1 \
  --service-account=api-tme@trigpointinguk.iam.gserviceaccount.com \
  --add-cloudsql-instances=trigpointinguk:europe-west1:trigpointing-6b5de36a \
  --allow-unauthenticated \
  --port=3000 \
  --memory=4Gi \
  --max-instances=2 \
  --min-instances=0 \
  --update-env-vars \
MODE=DEV,\
RUN_MIGRATIONS=true,\
NEST_DEBUG=true,\
AUTH0_ISSUER_URL=https://trigpointing.eu.auth0.com/,\
AUTH0_AUDIENCE=https://api.trigpointing.me,\
AUTH0_REDIRECT_URL=https://api.trigpointing.me/docs/oauth2-redirect.html,\
NODE_TLS_REJECT_UNAUTHORIZED=0,\
POSTGRES_HOST=localhost,\
POSTGRES_PORT=5432,\
POSTGRES_USER=postgres,\
POSTGRES_PASSWORD=dummy,\
POSTGRES_DATABASE=tme \
  --update-secrets=AUTH0_CLIENT_ID=TME_SWAGGER_AUTH0_CLIENT_ID:latest
POSTGRES_PASSWORD=TME_POSTGRES_PASSWORD:latest
