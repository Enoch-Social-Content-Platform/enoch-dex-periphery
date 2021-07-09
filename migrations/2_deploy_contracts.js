const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xFa797BC07347ada632cFa244389f717F09ea4de4';
  
  if(network === 'mainnet'){
      weth = await WETH.at('0xB1BAB8754079ed93F4DD9E73aaaCC64fB921bCF2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
  const ROUTER = await Router.deployed();
  // ROUTER_ADDRESS = ROUTER.address;
 
  // await token1.approve("0x4c13569256E3009DB60B4D4A512E9310838AB244",10)
  // await token2.approve("0x4c13569256E3009DB60B4D4A512E9310838AB244",10)

  // await ROUTER.addLiquidity(
  //   "0x0bF6AC75E596c45F44bad4F9231C0F53338f3fD3",
  //   "0x2997f3AA7Ab93faAd26dF311265A1546a83E2e5A",
  //   10,
  //   10,
  //   1,
  //   1,
  //   "0x6CaF44C89Af182202398fe924588C37B1E604C79",
  //  Math.floor(Date.now()/100) + 60 * 5
  // ) 

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