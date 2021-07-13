const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol")

const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xf1fc38C645454bdA0bF0E6a4d646Afeff86BE0Ee';// getting from core contract
  token1Address = "0xc0E740877fE5F0189531c96351Ad140E1d799fD0";
  token2Address = "0x661a64d3EB0f0cbE77d17695dA68f1Bb817A17BA";
  account_address = "0x2048A1703888d05e11979B40AEc2Bc6B1AFf84eE";

  const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
  const token2 = new web3.eth.Contract(Token2_ABI, token2Address);
  
  if(network === 'mainnet'){
      weth = await WETH.at('0xB1BAB8754079ed93F4DD9E73aaaCC64fB921bCF2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  let router = await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
  const ROUTER = await Router.deployed();

  const route = new web3.eth.Contract(ROUTER.abi, ROUTER.address);
  
  let bal1 = await token1.methods.balanceOf(account_address).call()
  let bal2 = await token2.methods.balanceOf(account_address).call()

  console.log(bal1, bal2)
 
  let ap1 = await token1.methods.approve(ROUTER.address, 1000000000).send({from:account_address});
  let ap2 = await token2.methods.approve(ROUTER.address, 1000000000).send({from:account_address});

 let a1 = await  token1.methods.allowance(account_address, ROUTER.address).call()
 let a2 = await token2.methods.allowance(account_address, ROUTER.address).call()

 console.log(a1, a2);
  

  // console.log(await route.methods.factory().call())

  console.log( await route.methods.addLiquidity(
    token1Address, 
    token2Address, 
    100000,
    100000,
    100,
    100,
    account_address, 
    Math.floor(Date.now()/100) + 60 * 30
    // {from:account_address}
  
  ).call())

  console.log(await route.methods.getAmountsOut(100000, [token1Address, token2Address]).call())

//  console.log(await route.methods.removeLiquidity(

//  token1Address,
//  token2Address,
//   74831,
//   100,
//   100,
//   account_address,
//  Math.floor(Date.now()/100) + 60 * 5
//  ).call())



};

