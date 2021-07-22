
const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");


const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2ERC20_ABI} = require("../build/contracts/EnochV2ERC20.json");



module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xfAa5Bd59B7Be0b06705D8EaED0636288279860b4';// getting from core contract
  token1Address = "0x05eA50dc2C0389117A067D393e0395ACc32c53b6";
  token2Address = "0xc29135482daEb5441520BaC6e8c97bFf194b24eE";
  account_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  // EnochV2ERC20_address = "0xC5aFE31AE505594B190AC71EA689B58139d1C354";
  pairAddress  = "0x9De65e7B2588Ce00DBfB8045d35330355f285EB3";
  
  const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
  const token2 = new web3.eth.Contract(Token2_ABI, token2Address);

  const V2ERC20 = new web3.eth.Contract(EnochV2ERC20_ABI, pairAddress);
  
  
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

  let ap1 = await token1.methods.approve(ROUTER.address, 1000000).send({from:account_address});
  let ap2 = await token2.methods.approve(ROUTER.address, 1000000).send({from:account_address});

  let a1 = await  token1.methods.allowance(account_address, ROUTER.address).call()
  let a2 = await token2.methods.allowance(account_address, ROUTER.address).call()


//  console.log(await ROUTER.addLiquidity(
//   token1Address, 
//   token2Address, 
//   100000,
//   100000,
//   100,
//   100,
//   account_address, 
//   Math.floor(Date.now()/1000) + (1*60*60),
//   {from:account_address}

// ))

console.log(await route.methods.addLiquidity(
  token1Address, 
  token2Address, 
  10000,
  10000,
  100,
  100,
  account_address, 
  Math.floor(Date.now()/1000) + (1*60*60),

).call({from:account_address}))

console.log((await route.methods.getAmountsOut(100000, [token1Address, token2Address]).call()))

  //SWAP
  // Transfer token 1 to token 2
  // Transfer token 1 to address[1]
  
  // msg.sender should have already given the router an allowance of at least amountIn on the input token.










// // Remove ***Liquidity works****

//   console.log("Liquidity",await V2ERC20.methods.balanceOf(account_address).call())
//   await V2ERC20.methods.approve(ROUTER.address, 30000).send({from:account_address})
//   let a3 = await V2ERC20.methods.allowance(account_address, ROUTER.address).call()
//   console.log(a3);

//   console.log(await route.methods.removeLiquidity(
//   token1Address, 
//   token2Address, 
//   30000,
//   100,
//   100,
//   account_address, 
//   Math.floor(Date.now()/1000) + (1*60*60),

// ).call({from:account_address}))

  
//  console.log(await ROUTER.removeLiquidity(
//  token1Address,
//  token2Address,
//  30000,
//  100,
//  100,
//  account_address,
//  Math.floor(Date.now()/100) + 60 * 10,
//  {from:account_address}
//  ))



};


