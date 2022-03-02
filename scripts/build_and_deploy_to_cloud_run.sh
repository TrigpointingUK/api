#!/bin/bash
docker build .. -t tuk-api:latest

gcloud auth login teasel.ian@gmail.com
gcloud config set project trigpointinguk
gcloud auth configure-docker europe-west1-docker.pkg.dev

docker tag tuk-api:latest europe-west1-docker.pkg.dev/trigpointinguk/images/tuk-api:latest
docker push europe-west1-docker.pkg.dev/trigpointinguk/images/tuk-api:latest

gcloud run deploy tuk-api \
  --image=europe-west1-docker.pkg.dev/trigpointinguk/images/tuk-api:latest \
  --region=europe-west1 \
  --allow-unauthenticated \
  --port=3000 \
  --memory=4Gi \
  --update-env-vars MODE=DEV,\
RUN_MIGRATIONS=true,\
NEST_DEBUG=true,\
AUTH0_ISSUER_URL=https://trigpointing.eu.auth0.com/,\
AUTH0_AUDIENCE=https://api.trigpointing.me,\
AUTH0_REDIRECT_URL=https://api.trigpointing.me/docs/oauth2-redirect.html,\
NODE_TLS_REJECT_UNAUTHORIZED=0 \n
  --update-secrets=POSTGRES_HOST=TME_POSTGRES_HOST:latest,\
POSTGRES_PORT=TME_POSTGRES_PORT:latest,\
POSTGRES_USER=TME_POSTGRES_USER:latest,\
POSTGRES_PASSWORD=TME_POSTGRES_PASSWORD:latest,\
POSTGRES_DATABASE=TME_POSTGRES_DATABASE:latest,\
AUTH0_CLIENT_ID=TME_SWAGGER_AUTH0_CLIENT_ID:latest,\
