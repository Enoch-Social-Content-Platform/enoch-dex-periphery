const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xfB998B0A0a305b1938E58B7162d53E82B1BD141e';
  
  if(network === 'mainnet'){
      weth = await WETH.at('0xB1BAB8754079ed93F4DD9E73aaaCC64fB921bCF2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
  const ROUTER = await Router.deployed();
  ROUTER_ADDRESS = ROUTER.address;

  // const factory_address = await FACTORY_ADDRESS.deployed();

  await ROUTER.addLiquidity(
    "0x54fC302D2DfDf7e35ecE630e08aD24e61768dcb4",
    "0x7877BE1014992FB16e06719Ea719219C82AF36b6",
    10,
    10,
    1,
    1,
    "0x6CaF44C89Af182202398fe924588C37B1E604C79",
   Math.floor(Date.now()/100) + 60 * 5
  ) 

 await ROUTER.removeLiquidity(
  "0x54fC302D2DfDf7e35ecE630e08aD24e61768dcb4",
  "0x7877BE1014992FB16e06719Ea719219C82AF36b6",
  10,
  10,
  1,
  1,
  "0x6CaF44C89Af182202398fe924588C37B1E604C79",
 Math.floor(Date.now()/100) + 60 * 5
 )

};

// await deployer.deploy(Token1);
//       await deployer.deploy(Token2);
//       const token1 = await Token1.deployed();
//       const token2 = await Token2.deployed();
//       token1Address = token1.address;
//       token2Address = token2.address;