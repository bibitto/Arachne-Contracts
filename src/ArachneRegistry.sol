// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ArachneRegistry {
    mapping(address => bool) public allowed;

    mapping(address => address) private _conditionalSigners; // TBA => Lit's conditional signer

    constructor(address _deployer) {
        allowed[_deployer] = true;
    }

    modifier onlyAllowed() {
        require(allowed[msg.sender], "Only owner");
        _;
    }

    function getConditionalSigner(address tokenBoundAccount) public view returns (address) {
        return _conditionalSigners[tokenBoundAccount];
    }

    function setConditionalSigner(address tokenBoundAccount, address conditionalSigner) public onlyAllowed {
        if (_conditionalSigners[tokenBoundAccount] != address(0)) revert AlreadyRegistered(tokenBoundAccount);
        _conditionalSigners[tokenBoundAccount] = conditionalSigner;
    }

    function setAllowed(address _target, bool isAllowed) public onlyAllowed {
        allowed[_target] = isAllowed;
    }

    error AlreadyRegistered(address tokenBoundAccount);
}
