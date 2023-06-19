const hre = require("hardhat");

async function main() {
   
  let blockTime = (await ethers.provider.getBlock('latest')).timestamp;
  
  let startingBid = 100;
  let endTime = blockTime + 1000;
  let tokenId = 4;
  // Deploy erc721 contract
  const MyToken = await hre.ethers.deployContract("MyToken");
  await MyToken.waitForDeployment();
  console.log("Mytoken",MyToken.getAddress());
  

  console.log("StartTime",blockTime);


  const EnglishAuction = await hre.ethers.deployContract("EnglishAuction",[MyToken.getAddress(),tokenId,startingBid,endTime]);

  await EnglishAuction.waitForDeployment();

  console.log("EnglishAuction",EnglishAuction.target);
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

