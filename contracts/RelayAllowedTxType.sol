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

    // Set relayed implementation
    function setRelayed(address _relayed) external onlyOwner {
        emit NewRelayed(relayed, _relayed);
        relayed = AllowedTxType(_relayed);
    }

    // allowed transaction type that calls relayed implementation
    function allowedTxType(address sender) public view returns(uint32) {
        return relayed.allowedTxType(sender);
    }
}
