pragma solidity ^0.4.24;

interface AllowedTxTypeInterface {
    function allowedTxType(address sender) external view returns(uint32);
}
