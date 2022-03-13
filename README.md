# TrigpointingUK - API

## Source code for TrigpointingUK API.

The current TrigpointingUK website uses outdated PHP code, which does not meet modern
security expectations, and which relies on AWS functionality due to be deprecated in
August 2022. This repo houses the development of a more cloud native codebase.

### Running locally

First start the Google Cloud SQL Proxy on your local machine, pointing to the T:UK CloudSQL instance:

```bash
./cloud_sql_proxy --instances=trigpointinguk:europe-west1:trigpointing-6b5de36a=tcp:5432
With POSTGRES_HOSTNAME=127.0.0.1
```

### Local PSQL client

```bash
psql "host=127.0.0.1 sslmode=disable dbname=tme user=ian"

```

#### Option 1
Cloud Run -> Serverless VPC Connector -> VPC -> Cloud SQL
- VPC Connector costs money for an instance

#### Option 2
Cloud Run -> Cloud SQL Proxy -> Cloud SQL
- Local testing: 
./cloud_sql_proxy --dir=/cloudsql --instances=trigpointinguk:europe-west1:trigpointing-6b5de36a=unix:/cloudsql/trigpointinguk:europe-west1:trigpointing-6b5de36a
With POSTGRES_SOCKET=/cloudsql/trigpointinguk:europe-west1:trigpointing-6b5de36a



#### Option 3
Cloud Run -> direct ssl connection -> Cloud SQL
- Tried once and failed - that's why Google wrote the proxy!

#### Option 4
Cloud Run -> unencrypted -> Cloud SQL
- Poor security





## Test results - Main branch

[![codecov](https://codecov.io/gh/TrigpointingUK/api/branch/main/graph/badge.svg?token=WAG6U0E2S6)](https://codecov.io/gh/TrigpointingUK/api)
[![CircleCI](https://circleci.com/gh/TrigpointingUK/api/tree/main.svg?style=shield)](https://circleci.com/gh/TrigpointingUK/api/tree/main)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FTrigpointingUK%2Fapi.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FTrigpointingUK%2Fapi?ref=badge_shield)

## License and copyright

    Copyright (C) 2021-2022  Ian Harris

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/agpl-3.0.txt>.
