const { ethers } = require("hardhat");

async function main() {

  const Vote = await ethers.getContractFactory("Vote")

  const vote = await Vote.deploy()

  await vote.deployed()
  console.log("Vote contract deployed to", vote.address);
   
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});