pragma solidity ^0.4.24;

import "./interfaces/AllowedTxTypeInterface.sol";
import "./interfaces/Ownable.sol";

// This is a owned permission contract implementation.
// Only the owner can update the permissions of users.
contract AllowedTxType is AllowedTxTypeInterface, Ownable {

    /* --- EVENTS --- */

    event UpdateAllowCreate(address _user, bool _allowed);
    event UpdateAllowPrivate(address _user, bool _allowed);

    /* --- FIELDS / CONSTANTS --- */

    /// Allowed transaction types mask
    uint32 constant None = 0;
    uint32 constant All = 0xffffffff;
    uint32 constant Basic = 0x01;
    uint32 constant Call = 0x02;
    uint32 constant Create = 0x04;
    uint32 constant Private = 0x08;

    /* --- STATES --- */

    mapping(address => bool) allowCreate;
    mapping(address => bool) allowPrivate;

    /* --- PUBLIC/EXTERNAL FUNCTIONS --- */

    // Initialize owner
    constructor(address _owner) public
    {
        owner = _owner;
    }

    function setAllowCreate(address sender, bool allowed) external onlyOwner {
        allowCreate[sender] = allowed;
        emit UpdateAllowCreate(sender, allowed);
    }

    function setAllowPrivate(address sender, bool allowed) external onlyOwner {
        allowPrivate[sender] = allowed;
        emit UpdateAllowPrivate(sender, allowed);
    }

    function allowedTxType(address sender) public returns (uint32) {
        uint32 allowedTxTypes = Basic | Call;

        if (allowCreate[sender] || sender == owner) {
            allowedTxTypes |= Create;
        }

        if (allowPrivate[sender] || sender == owner) {
            allowedTxTypes |= Private;
        }

        return allowedTxTypes;
    }
}
