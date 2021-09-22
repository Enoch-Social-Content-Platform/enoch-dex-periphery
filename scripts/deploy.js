const {ethers} = require("hardhat");

async function main() {
  const FACTORY_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F";
  const Weth_address = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  const Router = await ethers.getContractFactory("UniswapV2Router02");
  const router = await Router.deploy(FACTORY_ADDRESS, Weth_address);

  await router.deployed();

  console.log("Router deployed at:", router.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
