require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert')
const {sendRawTx} = require('../helper/sendTx.js')
const inputs = require('../input/setAllowCreate.json')
const PermissionContract = require('../../build/contracts/AllowedTxType.json')

const {
  RPC_URL,
  PERMISSION_CONTRACT_ADDRESS,
  OWNER_ACCOUNT_ADDRESS,
  OWNER_ACCOUNT_PRIVATE_KEY
} = process.env

const TOKEN_DECIMAL = 18
const deploymentPrivateKey = Buffer.from(OWNER_ACCOUNT_PRIVATE_KEY, 'hex')

// Foreign setup
const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)
const permissionContract = new web3Instance.eth.Contract(PermissionContract.abi, PERMISSION_CONTRACT_ADDRESS)


async function main() {
  console.log('========================================')
  console.log('UPDATING CREATE PERMISSION')
  console.log('========================================\n')

  let nonce = await web3Instance.eth.getTransactionCount(OWNER_ACCOUNT_ADDRESS)

  console.log(`\nUpdating create permission for ${inputs.ADDRESS_TO_UPDATE}: `)
  const txData = await permissionContract.methods.setAllowCreate(inputs.ADDRESS_TO_UPDATE, inputs.ALLOWED).encodeABI({from: OWNER_ACCOUNT_ADDRESS})
  const tx = await sendRawTx({
    data: txData,
    nonce: nonce,
    to: permissionContract.options.address,
    privateKey: deploymentPrivateKey,
    url: RPC_URL
  })
  assert.equal(tx.status, '0x1', 'Transaction Failed')

  console.log('========================================')
  console.log('UPDATE COMPLETE')
  console.log('========================================\n')
}
main()
