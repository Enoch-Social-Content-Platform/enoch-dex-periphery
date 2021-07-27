
const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2ERC20_ABI} = require("../build/contracts/EnochV2ERC20.json");
const {abi: EnochV2Factory_ABI} = require("../build/contracts/EnochV2Factory.json");



module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';// getting from core contract
  token1Address = "0xC89Ce4735882C9F0f0FE26686c53074E09B0D550";
  token2Address = "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb";
  account_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  // EnochV2ERC20_address = "0xC5aFE31AE505594B190AC71EA689B58139d1C354";
  pairAddress  = "0xa13a25a0B3f75011429Ae81552a65FCCDF78ce65";
  
  const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
  const token2 = new web3.eth.Contract(Token2_ABI, token2Address);

  const V2ERC20 = new web3.eth.Contract(EnochV2ERC20_ABI, pairAddress);
  const factoryContract = new web3.eth.Contract(EnochV2Factory_ABI, FACTORY_ADDRESS);
  
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

  console.log("Address of Weth",weth.address);
  
  const Weth = new web3.eth.Contract(WETH.abi, weth.address);

  await Weth.methods.deposit().send({
    value:  1000,
    from: account_address
  })

  console.log(await Weth.methods.totalSupply().call())
  
  // await weth.transfer(account_address, 10000);
  // console.log(await weth.approve(ROUTER.address,100).send({from:account_address}));
  // await factoryContract.methods.createPair(weth.address, token2Address);
  // console.log("Pair address: ", await factoryContract.methods.getPair(token1Address, token2Address));

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

// console.log(await route.methods.addLiquidity(
//   token1Address, 
//   token2Address, 
//   10000,
//   10000,
//   100,
//   100,
//   account_address, 
//   Math.floor(Date.now()/1000) + (1*60*60),

// ).call({from:account_address}))

// console.log((await route.methods.getAmountsOut(100000, [token1Address, token2Address]).call()))

  //SWAP
  // Transfer token 1 to token 2
  // Transfer token 1 to address[1] 
  // msg.sender should have already given the router an allowance of at least amountIn on the input token.
  
  // account_address2 = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  // // await token1.methods.transfer(account_address2, 1000).send({from:account_address});
  // // console.log("Balance of Token1 in 2nd account",await token1.methods.balanceOf(account_address2).call())
  // await token1.methods.approve(ROUTER.address, 100).send({from:account_address2});
  // let a4 = await  token1.methods.allowance(account_address2, ROUTER.address).call()
  // console.log(a4)


  // uint amountOut,
  // uint amountInMax,
  // address[] calldata path,
  // address to,
  // uint deadline
  // path = [token1Address, token2Address];
  // console.log(await route.methods.swapTokensForExactTokens(
  //   20,
  //   50,
  //   path,
  //   account_address2,
  //   Math.floor(Date.now()/100) + 60 * 10,


  // ).call({from:account_address2}))


  // let bal3 = await token2.methods.balanceOf(account_address2).call()
  // console.log("token2 balance in address 2",bal3)






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

// Another way of using removeLiquidity
  
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


//Weth and token2 provide Liquidity, swap, and, remove liquidity

// addLiquidityETH(
//   address token,
//   uint amountTokenDesired,
//   uint amountTokenMin,
//   uint amountETHMin,
//   address to,
//   uint deadline


// console.log(await route.methods.addLiquidityETH(
//   token2Address, 
//   10000,
//   10000,
//   100,
//   100,
//   account_address, 
//   Math.floor(Date.now()/1000) + (1*60*60),

// ).call({from:account_address}))











};


