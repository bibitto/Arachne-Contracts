const { ethers, network } = require("hardhat");

const CREATE2_FACTORY_ADDRESS = "0x280bAc6BCC6eE78E462e1e54EebAEB8f681a642A";

async function main() {
  const factory = await deployFactory();

  console.log("/* ========== Deployed Contracts ========== */");
  console.log("");
  console.log("Factory: ", factory);
}

async function deployFactory() {
  if ((await ethers.provider.getCode(CREATE2_FACTORY_ADDRESS)) !== "0x") {
    console.log("already deployed");
    return CREATE2_FACTORY_ADDRESS;
  }

  const signers = await ethers.getSigners();
  if (signers[0].address !== "0x421D547e380e95b75a068a310b301910547273a3") {
    throw new Error(
      "invalid signer. factory deployer must be 0x421D547e380e95b75a068a310b301910547273a3"
    );
  }

  const Factory = await ethers.getContractFactory("DeterministicDeployFactory");

  const factory = await Factory.deploy();
  await factory.deployed();
  console.log("Deployed contract to", factory.address);
  return factory.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
