const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Profile", function () {
  it("Add assets to profile", async function () {
    const Profile = await ethers.getContractFactory("Profile");
    const profile = await Profile.deploy({ gasLimit: 6721975 });
    await profile.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");
  });
});
