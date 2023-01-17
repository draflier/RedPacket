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


  let addrToken = "0xE8D54a49f21E0536D219A4774A1A513175d8Ffba";
  console.log("Deploying Vault contract");
  const VaultFactory = await hre.ethers.getContractFactory("Vault");

  const contractVault = await VaultFactory.deploy(addrToken);
  await contractVault.deployed();

  //let intChainID = await web3.eth.getChainId();
  let intChainID = await (await hre.ethers.getDefaultProvider().getNetwork()).chainId;

  console.log("Vault deployed to", contractVault.address);

  let contractAddressesMap = {
    url : hre.config.networks.binance_test.url,
    chain_id: intChainID,
    vault_addr: await contractVault.resolvedAddress,
};

let data = JSON.stringify(contractAddressesMap, null, 2);
fs.writeFileSync('hardhat_cfg.json', data);
fs.copyFileSync('./hardhat_cfg.json', '../vuejs-fe/src/artifacts/hardhat_cfg.json');
fs.copyFileSync('./artifacts/contracts/IERC20.sol/IERC20.json', '../vuejs-fe/src/artifacts/IERC20.json');
fs.copyFileSync('./artifacts/contracts/Vault.sol/Vault.json', '../vuejs-fe/src/artifacts/Vault.json');

try{
  await run("verify:verify", { address: contractVault.address, constructorArguments: [addrToken], contract: "contracts/Vault.sol:Vault" });
}catch(e){
    console.log(e);
}

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
