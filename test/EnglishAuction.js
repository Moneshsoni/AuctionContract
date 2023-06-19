const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("MyToken contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const myToken = await ethers.deployContract("MyToken");

    // Fixtures can return anything you consider useful for your tests
    return { myToken, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { myToken, owner } = await loadFixture(deployTokenFixture);

    console.log("Owner",owner.address);
    console.log("MyToken ====>>>",myToken.target);
  });

  it("Should check the Owner",async function (){
    const { myToken, owner } = await loadFixture(deployTokenFixture);
    console.log("Owner of Token",await myToken.owner());
  })

});