const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0x7D06f5dA2BdE23203aeF3d20C58FD859018e4E3E';
  
  if(network === 'mainnet'){
      weth = await WETH.at('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  await deployer.deploy(Router, FACTORY_ADDRESS, weth.address)
};
