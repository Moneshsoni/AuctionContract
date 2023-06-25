const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require("hardhat");
const { parseEther} = require("ethers")

describe("Dutch Auctions",function(){
    async function deployDutchFixcture(){
        let tokenId =4;
        let startingPrice = 1000000;
        let startAt;
        let expiresAt;
        let discountRate = 1;

        startAt = await time.latest();
        expiresAt = startAt+1000;

        const [owner, addr1, addr2] = await ethers.getSigners();
        const myToken = await ethers.deployContract("MyToken");
        await myToken.safeMint(owner.address,tokenId);
        
        const DutchAuction = await ethers.deployContract("DutchAuction",[startingPrice,discountRate,myToken.target,tokenId]);
        await myToken.approve(DutchAuction.target,tokenId);
        return {myToken,owner,DutchAuction};
    }
    it("Should test myToken contract",async function (){
        const { myToken, owner } = await loadFixture(deployDutchFixcture);
        console.log(myToken.target);
    })

    it("Should check Get Price",async function (){
        const { DutchAuction, owner } = await loadFixture(deployDutchFixcture);
        console.log("DutchAuction",await DutchAuction.getPrice());
    })

    it("Should check Buy",async function(){
        const { DutchAuction, owner } = await loadFixture(deployDutchFixcture);
        const value = '1.0';
        const valueToSend = parseEther(value);
        await DutchAuction.buy({value:valueToSend});
    })

    it("Should check Buy eth < price",async function(){
        const { DutchAuction, owner } = await loadFixture(deployDutchFixcture);
        const value = '0.0000000000000001';
        const valueToSend = parseEther(value);
        await expect( DutchAuction.buy({value:valueToSend})).to.be.revertedWith("ETH < price");
    })

    it("Should check ExpireAt",async ()=>{
        let tokenId =4;
        let startingPrice = 1000000;
        let startAt;
        let expiresAt;
        let discountRate = 1;

        startAt = await time.latest();
        expiresAt = startAt+1;

        const [owner, addr1, addr2] = await ethers.getSigners();
        const myToken = await ethers.deployContract("MyToken");
        await myToken.safeMint(owner.address,tokenId);
        
        const DutchAuction = await ethers.deployContract("DutchAuction",[startingPrice,discountRate,myToken.target,tokenId]);
        await myToken.approve(DutchAuction.target,tokenId);
        const value = '1';
        const valueToSend = parseEther(value);
        await expect( DutchAuction.buy({value:valueToSend})).to.be.revertedWith("ETH < price");
    
    })
})