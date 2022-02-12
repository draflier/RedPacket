const { expect } = require("chai");
const { ethers } = require("hardhat");
const IERC20 = require("../artifacts/contracts/IERC20.sol/IERC20.json");
const VaultArtifact = require("../artifacts/contracts/Vault.sol/Vault.json");



describe("Setting Up", function () {

  let factoryVault;
  let hardhatVault;
  let hardhatWBTC;

  let user1Vault;
  let user2Vault;
  let user1WBTC;

  let intInitBalOwner;
  let intInitBalUser1;
  let intInitBalUser2;

  let intAfterBalOwner;
  let intAfterBalUser1;

  let owner;
  let user1;
  let user2;

  let strVaultKey;

  beforeEach(async function () {

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      factoryVault = await ethers.getContractFactory("Vault");
      [owner, user1, user2] = await ethers.getSigners();
      hardhatWBTC = await ethers.getContractAt(IERC20.abi,"0x2192a4ffcfe669e8fb65a571803c9da5d00c550b");
      hardhatVault = await factoryVault.deploy("0x2192a4ffcfe669e8fb65a571803c9da5d00c550b");
      expect(await hardhatVault.owner()).to.equal(owner.address);
    });
    it("Should be in Polygon", async function () {
      let intChainID = await web3.eth.getChainId();
      expect(await intChainID).to.equal(97);
    });
  });

  describe("Deposit", function () {
    it("Approving ERC20", async function () {
      console.log("Vault Address => " + hardhatVault.address);
      user1WBTC = await hardhatWBTC.connect(user1);
      console.log("User 1 WBTC Address => " + user1WBTC.address);
      let objTxn = await user1WBTC.approve(hardhatVault.address,"1000000000000000000");
      await ethers.provider.waitForTransaction(objTxn.hash,3);

      let result = await user1WBTC.allowance(user1.address, hardhatVault.address);
      console.log(result.toString());
      let testRes = result.sub("1000000000000000000")
      expect(testRes.toNumber()).to.equal(0);
    });


    it("User1 Deposit 1WBTC", async function () {
      intInitBalOwner = await hardhatWBTC.balanceOf(owner.address);
      intInitBalUser1 = await hardhatWBTC.balanceOf(user1.address);
      intInitBalUser2 = await hardhatWBTC.balanceOf(user2.address);
      user1Vault = await hardhatVault.connect(user1);
      console.log("User 1 Vault Address => " + user1Vault.address);
      let objTxn = await user1Vault.deposit("1000000000000000000");
      await ethers.provider.waitForTransaction(objTxn.hash,3);

      intAfterBalOwner = await hardhatWBTC.balanceOf(owner.address);
      intAfterBalUser1 = await hardhatWBTC.balanceOf(user1.address);
     
      let testRes = intInitBalUser1.sub(intAfterBalUser1).sub("1000000000000000000");
      expect(testRes.toNumber()).to.equal(0);
    });

    it("Transaction Fee Processed", async function () {  
      let testRes = intAfterBalOwner.sub(intInitBalOwner).sub("200000000000000000");
      expect(testRes.toNumber()).to.equal(0);
    });

    it("Get Vault Key", async function () {  
      strVaultKey = await user1Vault.getVaultKey();
      console.log("Vault Key => " + strVaultKey)
      expect(strVaultKey.length).to.greaterThan(0);
    });


    it("Retrieve", async function () {  
      user2Vault = await hardhatVault.connect(user2);
      let objTxn = await user2Vault.getRedPacket(strVaultKey);
      await ethers.provider.waitForTransaction(objTxn.hash,3);

      intAfterBalUser2 = await hardhatWBTC.balanceOf(user2.address); 
      let testRes = intAfterBalUser2.sub(intInitBalUser2).sub("800000000000000000");
      expect(testRes.toNumber()).to.equal(0);
    });




  });
});




/*
describe("Deposit", function () {
  it("Deposit Small Fee", async function () {
    

    // expect(await greeter.greet()).to.equal("Hello, world!");
  });
});

*/
