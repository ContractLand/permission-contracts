pragma solidity ^0.4.24;

interface AllowedTxTypeInterface {
    function allowedTxTypes(address sender) external returns(uint32);
}
