require('dotenv').config()
const Web3 = require('web3')
const Web3Utils = require('web3-utils')
const assert = require('assert')
const {sendRawTx} = require('../helper/sendTx.js')
const inputs = require('../input/upgradePermissionContract.json')
const RelayContract = require('../../build/contracts/RelayAllowedTxType.json')

const {
  RPC_URL,
  OWNER_ACCOUNT_ADDRESS,
  OWNER_ACCOUNT_PRIVATE_KEY
} = process.env

const TOKEN_DECIMAL = 18
const deploymentPrivateKey = Buffer.from(OWNER_ACCOUNT_PRIVATE_KEY, 'hex')

// Foreign setup
const web3Provider = new Web3.providers.HttpProvider(RPC_URL)
const web3Instance = new Web3(web3Provider)
const relayContract = new web3Instance.eth.Contract(RelayContract.abi, inputs.RELAY_ADDRESS)


async function main() {
  console.log('========================================')
  console.log('UPGRADING PERMISSION CONTRACT')
  console.log('========================================\n')

  let nonce = await web3Instance.eth.getTransactionCount(OWNER_ACCOUNT_ADDRESS)

  console.log(`\nUpgrading permission contract: `)
  const txData = await relayContract.methods.setRelayed(inputs.NEW_RELAYED_ADDRESS).encodeABI({from: OWNER_ACCOUNT_ADDRESS})
  const tx = await sendRawTx({
    data: txData,
    nonce: nonce,
    to: relayContract.options.address,
    privateKey: deploymentPrivateKey,
    url: RPC_URL
  })
  assert.equal(tx.status, '0x1', 'Transaction Failed')

  console.log('========================================')
  console.log('UPGRADE COMPLETE')
  console.log('========================================\n')
  console.log(`New relayed instance at: ${inputs.NEW_RELAYED_ADDRESS}`)
}
main()
