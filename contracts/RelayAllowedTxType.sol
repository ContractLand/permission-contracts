pragma solidity ^0.4.24;

import "./interfaces/Ownable.sol";
import "./interfaces/AllowedTxTypeInterface.sol";
import "./AllowedTxType.sol";

// This is a relayed permission contract.
// The owner of the relay contract can update the permission contract implementation used.
// The owner of the permission implementation contract can update user permissions.
contract RelayAllowedTxType is Ownable, AllowedTxTypeInterface {

    event NewRelayed(address indexed old, address indexed current);

    // Address of relayed implementation
    AllowedTxType public relayed;

    // Initialize relayed
    constructor(address _relayed, address _owner) public
    {
        relayed = AllowedTxType(_relayed);
        owner = _owner;
    }

    // Set relayed implementation
    function setRelayed(address _relayed) external onlyOwner {
        emit NewRelayed(relayed, _relayed);
        relayed = AllowedTxType(_relayed);
    }

    // allowed transaction type that calls relayed implementation
    function allowedTxTypes(address sender) public returns(uint32) {
        uint32 allowed = relayed.allowedTxTypes(sender);
        return allowed;
    }
}
