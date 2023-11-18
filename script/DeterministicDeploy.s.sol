// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import "../src/DeterministicDeployFactory.sol";
import "../src/ArachneRegistry.sol";
import "../src/Account.sol";
import "../src/ERC6551Registry.sol";

// deploy command : forge script script/DeterministicDeploy.s.sol:DeterministicDeploy --rpc-url $<RPC_URL> --broadcast
contract DeterministicDeploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        bytes32 salt = bytes32(uint256(6551));
        address factory = 0x280bAc6BCC6eE78E462e1e54EebAEB8f681a642A;

        address owner = 0x421D547e380e95b75a068a310b301910547273a3;

        address arachneRegistry = Create2.computeAddress(
            salt, keccak256(abi.encodePacked(type(ArachneRegistry).creationCode, abi.encode(owner))), factory
        );

        address accountImpl = Create2.computeAddress(
            salt, keccak256(abi.encodePacked(type(ERC6551Account).creationCode, abi.encode(arachneRegistry))), factory
        );

        address erc6551Registry =
            Create2.computeAddress(salt, keccak256(abi.encodePacked(type(ERC6551Registry).creationCode)), factory);

        if (arachneRegistry.code.length == 0) {
            vm.startBroadcast(deployerPrivateKey);
            DeterministicDeployFactory(factory).deploy(
                abi.encodePacked(type(ArachneRegistry).creationCode, abi.encode(owner)), uint256(salt)
            );
            vm.stopBroadcast();

            console.log("ArachneRegistry:", arachneRegistry, "(deployed)");
        } else {
            console.log("ArachneRegistry:", arachneRegistry, "(exists)");
        }

        if (accountImpl.code.length == 0) {
            vm.startBroadcast(deployerPrivateKey);
            DeterministicDeployFactory(factory).deploy(
                abi.encodePacked(type(ERC6551Account).creationCode, abi.encode(arachneRegistry)), uint256(salt)
            );
            vm.stopBroadcast();

            console.log("AccountImpl:", accountImpl, "(deployed)");
        } else {
            console.log("AccountImpl:", accountImpl, "(exists)");
        }

        if (erc6551Registry.code.length == 0) {
            vm.startBroadcast(deployerPrivateKey);
            DeterministicDeployFactory(factory).deploy(
                abi.encodePacked(type(ERC6551Registry).creationCode), uint256(salt)
            );
            vm.stopBroadcast();

            console.log("erc6551Registry:", erc6551Registry, "(deployed)");
        } else {
            console.log("erc6551Registry:", erc6551Registry, "(exists)");
        }
    }
}
