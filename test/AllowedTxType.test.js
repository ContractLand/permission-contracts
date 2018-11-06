"use strict"

import { expect } from 'chai'
const EVMRevert = require("./helpers/EVMRevert.js")

require('chai')
  .use(require('chai-as-promised'))
  .should()

const AllowedTxType = artifacts.require("./AllowedTxType.sol")

contract("AllowedTxType", accounts => {
    let allowedTxType
    let owner = accounts[0]
    let unauthorizedUser = accounts[1]
    let authorizedUser = accounts[1]

    beforeEach(async () => {
        allowedTxType = await AllowedTxType.new({ from: owner })
    })

    it('Un-authorized User should have Basic and Call permissions by default', async () => {
        const expectedType = 3 // Basic (1) + Call (2)
        const actualType = await allowedTxType.allowedTxType(unauthorizedUser)

        assert.equal(expectedType.toString(), actualType.toString())
    })

    it('Owner should have Create and Private permission by default', async () => {
        const expectedType = 15 // Basic (1) + Call (2) + Create (4) + Private (8)
        const actualType = await allowedTxType.allowedTxType(owner)

        assert.equal(expectedType.toString(), actualType.toString())
    })

    it('Only owner can update create permissions', async () => {
        await allowedTxType.setAllowCreate(authorizedUser, true, { from: unauthorizedUser }).should.be.rejectedWith(EVMRevert)
        await allowedTxType.setAllowCreate(authorizedUser, true, { from: owner }).should.be.fulfilled
    })

    it('Authorized user should have create permission', async () => {
        await allowedTxType.setAllowCreate(authorizedUser, true, { from: owner }).should.be.fulfilled
        const expectedType = 7 // Basic (1) + Call (2) + Create (4)
        const actualType = await allowedTxType.allowedTxType(authorizedUser)

        assert.equal(expectedType.toString(), actualType.toString())
    })

    it('Only owner can update private permissions', async () => {
        await allowedTxType.setAllowPrivate(authorizedUser, true, { from: unauthorizedUser }).should.be.rejectedWith(EVMRevert)
        await allowedTxType.setAllowPrivate(authorizedUser, true, { from: owner }).should.be.fulfilled
    })

    it('Authorized user should have private permission', async () => {
        await allowedTxType.setAllowPrivate(authorizedUser, true, { from: owner }).should.be.fulfilled
        const expectedType = 11 // Basic (1) + Call (2) + Private (8)
        const actualType = await allowedTxType.allowedTxType(authorizedUser)

        assert.equal(expectedType.toString(), actualType.toString())
    })
})
