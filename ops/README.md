# Permission-Contract-Ops
Operational scripts for administrating a Permission Contract.

## Install
`npm install`

## Setup
1. Make copy of `.env.example` and name it `.env`.
2. Populate `.env` with appropriate values.

## Run
### Updating Create Permissions
1. Update `inputs/setAllowCreate.json` with appropriate values
2. Run `npm run set-allow-create`

### Updating Private Permissions
1. Update `inputs/setAllowPrivate.json` with appropriate values
2. Run `npm run set-allow-private`

### Upgrading Permission Contract Instance
1. Update `inputs/upgradePermissionContract.json` with appropriate values
2. Run `npm run upgrade-permission-contract`
