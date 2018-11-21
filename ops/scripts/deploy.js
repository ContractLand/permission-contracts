require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert')
const RelayAllowedTxType = require('../../build/contracts/RelayAllowedTxType.json')
const AllowedTxType = require('../../build/contracts/AllowedTxType.json')
const {deployContract, sendRawTx, compareHex, compareHexArray} = require('../helper/sendTx.js')

const {
  RPC_URL,
  OWNER_ACCOUNT_ADDRESS,
  OWNER_ACCOUNT_PRIVATE_KEY
} = process.env

const TOKEN_DECIMAL = 18
const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)
const ownerPrivateKey = Buffer.from(OWNER_ACCOUNT_PRIVATE_KEY, 'hex')

async function main() {
  console.log('========================================')
  console.log('DEPLOYMENT RELAYED PERMISSION CONTRACTS')
  console.log('========================================\n')

  let accountNonce = await web3Instance.eth.getTransactionCount(OWNER_ACCOUNT_ADDRESS)

  console.log('\nDeploying AllowedTxType:')
  const relayedSet = await deployContract(web3Instance, AllowedTxType, [OWNER_ACCOUNT_ADDRESS], {from: OWNER_ACCOUNT_ADDRESS, nonce: accountNonce}, ownerPrivateKey)
  accountNonce++
  console.log('AllowedTxType: ', relayedSet.options.address)

  console.log('\nDeploying RelayAllowedTxType:')
  const relaySet = await deployContract(web3Instance, RelayAllowedTxType, [relayedSet.options.address, OWNER_ACCOUNT_ADDRESS], {from: OWNER_ACCOUNT_ADDRESS, nonce: accountNonce}, ownerPrivateKey)
  accountNonce++
  console.log('RelayAllowedTxType: ', relaySet.options.address)

  console.log('\n========================================')
  console.log('DEPLOYMENT COMPLETE')
  console.log('========================================\n')

  console.log('RelayAllowedTxType: ', relaySet.options.address)
  console.log('AllowedTxType: ', relayedSet.options.address)
  console.log('Permission Contracts Owner: ', OWNER_ACCOUNT_ADDRESS)
}
main()
