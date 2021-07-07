const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0x2a055D62690f94128C9532AB909ac6261c41304a';
  
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

  await ROUTER.addLiquidity(
    "0xC9aa5Ce92DCE6FD57706689136E1a4d049516553",
    "0x93AC3A8309BC7775420FAB26bE874a3a5ad4C488",
    "10",
    "10",
    "1",
    "1",
    "0xC9aa5Ce92DCE6FD57706689136E1a4d049516553",
   Math.floor(Date.now()/100) +60*5
  ) 

 await ROUTER.removeLiquidity(
  "0xC9aa5Ce92DCE6FD57706689136E1a4d049516553",
  "0x93AC3A8309BC7775420FAB26bE874a3a5ad4C488",
  "10",
  "10",
  "1",
  "1",
  "0xC9aa5Ce92DCE6FD57706689136E1a4d049516553",
 Math.floor(Date.now()/100) +60*5
 )

};

// await deployer.deploy(Token1);
//       await deployer.deploy(Token2);
//       const token1 = await Token1.deployed();
//       const token2 = await Token2.deployed();
//       token1Address = token1.address;
//       token2Address = token2.address;