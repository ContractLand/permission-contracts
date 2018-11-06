#!/usr/bin/env bash

rm -rf ../flats
mkdir -p ../flats

../node_modules/.bin/truffle-flattener ../../contracts/AllowedTxType.sol > ../flats/AllowedTxType_flat.sol
../node_modules/.bin/truffle-flattener ../../contracts/RelayAllowedTxType.sol > ../flats/RelayAllowedTxType_flat.sol
