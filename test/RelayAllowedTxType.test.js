"use strict"

import { expect } from 'chai'
const EVMRevert = require("./helpers/EVMRevert.js")

require('chai')
  .use(require('chai-as-promised'))
  .should()

const AllowedTxType = artifacts.require("./AllowedTxType.sol")
const RelayAllowedTxType = artifacts.require("./RelayAllowedTxType.sol")

contract("RelayAllowedTxType", accounts => {
    let allowedTxType
    let relayAllowedTxType
    let relayedOwner = accounts[0]
    let relayOwner = accounts[1]
    let notOwner = accounts[2]
    let user = accounts[3]

    beforeEach(async () => {
        allowedTxType = await AllowedTxType.new(relayedOwner, { from: relayedOwner })
        relayAllowedTxType = await RelayAllowedTxType.new(allowedTxType.address, relayOwner, { from: relayOwner })
    })

    it('Only relay owner can set relayed', async () => {
        await relayAllowedTxType.setRelayed(allowedTxType.address, { from: notOwner }).should.be.rejectedWith(EVMRevert)
        await relayAllowedTxType.setRelayed(allowedTxType.address, { from: relayOwner }).should.be.fulfilled
    })

    it('Should relay allowedTxType', async () => {
        const expectedType = 3 // Basic (1) + Call (2)
        const actualType = await relayAllowedTxType.allowedTxTypes.call(user)

        assert.equal(expectedType.toString(), actualType.toString())
    })
})
