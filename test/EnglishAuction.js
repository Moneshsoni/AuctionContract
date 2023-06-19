const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("MyToken contract", function () {
  async function deployTokenFixture() {
    let blockTime = (await ethers.provider.getBlock('latest')).timestamp;
  
    let startingBid = 100;
    let endTime = blockTime + 1000;
    let tokenId = 4;
    
    const [owner, addr1, addr2] = await ethers.getSigners();

    //Deploy erc721 contract
    const myToken = await ethers.deployContract("MyToken");

    //Deploy EnglishAuction contract
    const EnglishAuction  = await ethers.deployContract("EnglishAuction",[myToken.target,tokenId,startingBid,endTime]);
    // Fixtures can return anything you consider useful for your tests
    return { myToken, EnglishAuction, owner, addr1, addr2 };
  }

  it("Should check the myToken address", async function () {
    const { myToken, owner } = await loadFixture(deployTokenFixture);

    console.log("Owner",owner.address);
    console.log("MyToken ====>>>",myToken.target);
  });

  it("Should check the Owner",async function (){
    const { myToken, owner } = await loadFixture(deployTokenFixture);
    console.log("Owner of Token",await myToken.owner());
  })

  it("Should check the englishAuctionContract",async function(){
    const { EnglishAuction,owner} = await loadFixture(deployTokenFixture);
    console.log("English Auction",EnglishAuction.target);
  })

});