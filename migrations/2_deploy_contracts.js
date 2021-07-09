const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0x361a6519eC6A42F256F43A4fD50fa7fA79EB9bD1';// getting from core contract

  const token1 = new web3.eth.Contract(Token1_ABI);
  const token2 = new web3.eth.Contract(Token2_ABI);
  
  if(network === 'mainnet'){
      weth = await WETH.at('0xB1BAB8754079ed93F4DD9E73aaaCC64fB921bCF2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
  const ROUTER = await Router.deployed();
  
  await token1.methods.approve(ROUTER.address, 10);
  await token2.methods.approve(ROUTER.address, 10);

  await ROUTER.addLiquidity(
    "0x944d5f4c3CF887D778225cE9fDE20de7Dea0319A", //token1 address
    "0xd4391ec0b5EB0dCf9b35C03Bc19a97018FAF8A91", //token2 address
    10,
    10,
    1,
    1,
    "0x6CaF44C89Af182202398fe924588C37B1E604C79", //account 1
   Math.floor(Date.now()/100) + 60 * 10
  ) 

//  await ROUTER.removeLiquidity(
//   "0xc321B29F4D346E82B665063d34591466Ebf2439B",
//   "0xD2E45402cf17E84f70A92aE33e773019Be7ee01D",
//   10,
//   10,
//   1,
//   1,
//   "0x6CaF44C89Af182202398fe924588C37B1E604C79",
//  Math.floor(Date.now()/100) + 60 * 5
//  )

};

// await deployer.deploy(Token1);
//       await deployer.deploy(Token2);
//       const token1 = await Token1.deployed();
//       const token2 = await Token2.deployed();
//       token1Address = token1.address;
//       token2Address = token2.address;