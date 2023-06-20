const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require("hardhat");
const { parseEther} = require("ethers")
describe("EnglishAuction contract", function () {
  async function deployTokenFixture() {
    const timestamp = await time.latest();
  
    let startingBid = 100;
    let endTime = timestamp + 1000;
    let tokenId = 4;

    const [owner, addr1, addr2] = await ethers.getSigners();

    //Deploy erc721 contract
    const myToken = await ethers.deployContract("MyToken");

    await myToken.safeMint(owner.address,tokenId);

    //Deploy EnglishAuction contract
    const EnglishAuction  = await ethers.deployContract("EnglishAuction",[myToken.target,tokenId,startingBid,endTime]);
    // Fixtures can return anything you consider useful for your tests
   
    await myToken.approve(EnglishAuction.target,tokenId);

    // await myToken.approve(EnglishAuction.target)
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

  it("Shoud Start English Auction",async function(){
    const { myToken,EnglishAuction,owner} = await loadFixture(deployTokenFixture);

    // await myToken.safeMint(owner.address,tokenId);
    await EnglishAuction.connect(owner).start();
    console.log("Balance of",await myToken.balanceOf(EnglishAuction.target));

    console.log("Owner of Token",await myToken.ownerOf(4));
    // console.log("Owner address!",await owner.address);
    // console.log("EnglishAuction!",await EnglishAuction.target);
  })

  it("Should check the started or not",async function(){
    const { EnglishAuction,owner} = await loadFixture(deployTokenFixture);
    
    await EnglishAuction.connect(owner).start();
    
    await expect(EnglishAuction.connect(owner).start()).to.be.revertedWith("Bidding started");
  })

  it("Shouls check Seller or Not",async function(){
    const { EnglishAuction,addr1} = await loadFixture(deployTokenFixture);

    await expect(EnglishAuction.connect(addr1).start()).to.be.revertedWith("not seller");
  })

  it("Should check bid function not started",async function (){
    const {EnglishAuction} = await loadFixture(deployTokenFixture);
   
    await expect( EnglishAuction.bid()).to.be.revertedWith("not started");
  })

  it("Should check bid functions value < highest! ",async function (){
    const {EnglishAuction,owner,myToken,add1} = await loadFixture(deployTokenFixture);
    
    await EnglishAuction.connect(owner).start();

    await expect(EnglishAuction.bid()).to.be.revertedWith("value < highest");

  })

  it("Should check the Bid Functions",async function (){
    const {EnglishAuction,addr1,owner} = await loadFixture(deployTokenFixture);
   
    await EnglishAuction.connect(owner).start();
    const value = '1.0';
    const valueToSend = parseEther(value);

    await EnglishAuction.connect(addr1).bid({ value: valueToSend });
  })

  it("Should check the Withdraw functionality",async function (){
    const {EnglishAuction,owner,myToken} = await loadFixture(deployTokenFixture);

    await EnglishAuction.connect(owner).withdraw();

    // console.log(await myToken.balanceOf(owner.address));
  })

  it("Should check the Bidding started or Not on End functions",async function (){

    const {EnglishAuction,owner,myToken} = await loadFixture(deployTokenFixture);

    await expect(EnglishAuction.connect(owner).end()).to.be.revertedWith("not started");
    // console.log("EnglishAuction Bid",await EnglishAuction.highestBid());
    
  })

  it("Should check the ended or not ended",async function(){

    const {EnglishAuction,owner,myToken} = await loadFixture(deployTokenFixture);

    await EnglishAuction.connect(owner).start();
    await expect(EnglishAuction.connect(owner).end()).to.be.revertedWith("not ended");
  
  })

  it("Should check the end",async function(){
    async function deployTokenFixture() {
      const timestamp = await time.latest();
    
      let startingBid = 100;
      let endTime = timestamp + 1;
      let tokenId = 4;
  
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      //Deploy erc721 contract
      const myToken = await ethers.deployContract("MyToken");
  
      await myToken.safeMint(owner.address,tokenId);
  
      //Deploy EnglishAuction contract
      const EnglishAuction  = await ethers.deployContract("EnglishAuction",[myToken.target,tokenId,startingBid,endTime]);
      // Fixtures can return anything you consider useful for your tests
     
      await myToken.approve(EnglishAuction.target,tokenId);
  
      // await myToken.approve(EnglishAuction.target)
      return { myToken, EnglishAuction, owner, addr1, addr2 };
    }
  
    const {EnglishAuction,owner,myToken} = await loadFixture(deployTokenFixture);
    
    await EnglishAuction.connect(owner).start();
    await EnglishAuction.connect(owner).end();

  })

  it("Should check the end",async function(){
    async function deployTokenFixture() {
      const timestamp = await time.latest();
    
      let startingBid = 100;
      let endTime = timestamp + 1;
      let tokenId = 4;
  
      const [owner, addr1, addr2] = await ethers.getSigners();
  
      //Deploy erc721 contract
      const myToken = await ethers.deployContract("MyToken");
  
      await myToken.safeMint(owner.address,tokenId);
  
      //Deploy EnglishAuction contract
      const EnglishAuction  = await ethers.deployContract("EnglishAuction",[myToken.target,tokenId,startingBid,endTime]);
      // Fixtures can return anything you consider useful for your tests
     
      await myToken.approve(EnglishAuction.target,tokenId);
  
      // await myToken.approve(EnglishAuction.target)
      return { myToken, EnglishAuction, owner, addr1, addr2 };
    }
  
    const {EnglishAuction,owner,myToken} = await loadFixture(deployTokenFixture);
    
    await EnglishAuction.connect(owner).start();
    await EnglishAuction.connect(owner).end();
    await expect(EnglishAuction.connect(owner).end()).to.be.revertedWith("ended");

  })

});