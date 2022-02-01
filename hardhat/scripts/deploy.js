// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const VaultFactory = await hre.ethers.getContractFactory("Vault");
  const contractProfile = await VaultFactory.deploy();

  await contractProfile.deployed();


  console.log("Profile deployed to Binance Tesnet:", contractProfile.address);
  let contractAddressesMap = {
    url : hre.config.networks.binance_test.url,
    admin_pk : hre.config.networks.drafsoln.accounts[0],
    profile: contractProfile.address,
};

let data = JSON.stringify(contractAddressesMap, null, 2);
fs.writeFileSync('hardhat_cfg.json', data);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
