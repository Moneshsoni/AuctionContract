const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { time } = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require("hardhat");

describe("Campign Fund",function () {
    async function deployCampignFixture(){
        // let token_amount = 100000000;
        const [owner, add1, addr2] = await ethers.getSigners();

        const myToken = await ethers.deployContract("CampToken",[100000000]);

        const CrowdFund = await ethers.deployContract("CrowdFund",[myToken.target]);
        await myToken.approve(CrowdFund.target,10000);
        return {myToken,owner,CrowdFund,add1}

    }

    it("Should check myToken", async function(){
        const { myToken, owner } = await loadFixture(deployCampignFixture);
        console.log("MyTOken",myToken.target);
        // console.log("MyToken balance",await await myToken.balanceOf(owner.address));
    })

    it("Should check CrowdFund ",async function(){
        const {CrowdFund, owner} = await loadFixture(deployCampignFixture);
        console.log("CrowdFund",CrowdFund.target); 
        
    } )

    it("SHould check lauch start at < now", async function(){
        const {CrowdFund, owner} = await loadFixture(deployCampignFixture);
        let goal = 1000;
        let startAt = 120;
        let endAt = 1200;
        await expect(CrowdFund.launch(goal,startAt,endAt)).to.be.revertedWith("start at < now");
    })

    it("Should check launch end at < start at",async function(){
        const {CrowdFund, owner} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+5;
        let endAt = await time.latest()-5;
        await expect(CrowdFund.launch(goal,startAt,endAt)).to.be.revertedWith("end at < start at");
    })

    it("Shold check the launch`2 functions",async function(){
        const {CrowdFund, owner} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+5;
        let endAt = await time.latest()+100;
        await CrowdFund.launch(goal,startAt,endAt);
        // console.log("cs",await CrowdFund.campaigns(1));
    })

    it("Should check cancel not creator ",async function (){
        const {CrowdFund, owner,add1} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+5;
        let endAt = await time.latest()+100;
        await CrowdFund.connect(owner).launch(goal,startAt,endAt);
        let id =1;
        await expect(CrowdFund.connect(add1).cancel(id)).to.be.revertedWith("not creator");

    })

    it("Should check cancel started ",async function (){
        const {CrowdFund, owner,add1} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+2;
        let endAt = await time.latest()+100;
        await CrowdFund.launch(goal,startAt,endAt);
        let id =1;
        await expect(CrowdFund.cancel(id)).to.be.revertedWith("started");
    })

    it("Should check The  cancel",async function (){
        const {CrowdFund, owner,add1} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+5;
        let endAt = await time.latest()+100;
        await CrowdFund.launch(goal,startAt,endAt);
        let id =1;
        // console.log("Before",await CrowdFund.campaigns(1));
        await CrowdFund.cancel(id);
        // console.log("After",await CrowdFund.campaigns(1));
    })

    it("Should check pledge not started",async function(){
        const {CrowdFund, owner,add1} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+5;
        let endAt = await time.latest()+100;
        await CrowdFund.launch(goal,startAt,endAt);
        let id =1;
        await expect(CrowdFund.pledge(id,10)).to.be.revertedWith("not started");
    });

    it("Should check pledge",async function(){
        const {CrowdFund, owner,add1} = await loadFixture(deployCampignFixture);
        let goal =100;
        let startAt = await time.latest()+3;
        let endAt = await time.latest()+100;
        await CrowdFund.launch(goal,startAt,endAt);
        let id =1; 
        let amount = 50; 
        await CrowdFund.pledge(id,amount);
    })

  

});