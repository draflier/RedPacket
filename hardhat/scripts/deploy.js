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


  let addrToken = "0x2192a4ffcfe669e8fb65a571803c9da5d00c550b";
  const VaultFactory = await hre.ethers.getContractFactory("Vault");

  const contractVault = await VaultFactory.deploy(addrToken);
  await contractVault.deployed();

  let intChainID = await web3.eth.getChainId();


  console.log("Vault deployed to", contractVault.address);

  let contractAddressesMap = {
    url : hre.config.networks.binance_test.url,
    chain_id: intChainID,
    vault_addr: contractVault.address,
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
