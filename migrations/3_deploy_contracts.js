
const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");


const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2ERC20_ABI} = require("../build/contracts/EnochV2ERC20.json");

// // const {abi: WETH3_ABI} = require("../build/contracts/WETH3.json")

module.exports = async function (deployer, network) {
  let weth;
  const FACTORY_ADDRESS = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601';// getting from core contract
  token2Address = "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb";
  account_address = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  account_address2 = "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0";
  weth_pair_address = "0xb7e1185C294D2d92163AED346BA15cB3E41fAe8b";

  
  const token2 = new web3.eth.Contract(Token2_ABI, token2Address);
  const V2ERC20_weth_pair = new web3.eth.Contract(EnochV2ERC20_ABI, weth_pair_address);

  if(network === 'mainnet'){
      weth = await WETH.at('0xB1BAB8754079ed93F4DD9E73aaaCC64fB921bCF2');
  }
  else{
      await deployer.deploy(WETH);
      weth = await WETH.deployed();
  }

  const Weth_address = "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7";
  let router = await deployer.deploy(Router, FACTORY_ADDRESS, Weth_address);
  // let router = await deployer.deploy(Router, FACTORY_ADDRESS, weth.address);
  const ROUTER = await Router.deployed();
 
  const route = new web3.eth.Contract(ROUTER.abi, ROUTER.address);
  const Weth = new web3.eth.Contract(WETH.abi, Weth_address);

  let bal2 = await token2.methods.balanceOf(account_address).call()
  console.log("Balance of Token2", bal2)


  let ap2 = await token2.methods.approve(ROUTER.address, 9000000).send({from:account_address});
  let a2 = await token2.methods.allowance(account_address, ROUTER.address).call()
  console.log("Allowance for Token2", a2);
  
  await Weth.methods.deposit().send({
    value:  20000,
    from: account_address
  })

  console.log(await Weth.methods.totalSupply().call()) 
  
  console.log(await Weth.methods.transferFrom(account_address, ROUTER.address, 20000).call());
  await Weth.methods.approve(ROUTER.address, 10000).send({from:account_address});

  /*
   * Weth and token2 provide Liquidity, Swap, and, Remove liquidity
     Parameters for addLiquidityETH
     addLiquidityETH(
      address token,
      uint amountTokenDesired,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline
   )
   Parameters for Swapping ->
   swapETHForExactTokens(
     uint amountOut, 
     address[] calldata path, 
     address to, 
     uint deadline
     )
  Parameters for Removing Liquidity for ETH
   removeLiquidityETH(
     address token,
     uint liquidity,
     uint amountTokenMin,
     uint amountETHMin,
     address to,
     uint deadline
     )
   */

//  console.log(
await ROUTER.addLiquidityETH(
  token2Address, 
  10000,
  1000,
  10,
  account_address, 
  Math.floor(Date.now()/1000) + 60 * 20,
  {value: 3000,
  from: account_address}
)
// // .call({ 
//   value: 3000,
//    from: account_address
//   }))

  // // Returns the amount of pool tokens owned by an address.
console.log("amount of pool tokens owned by an address",await V2ERC20_weth_pair.methods.balanceOf(account_address).call())
  
  // // Returns the total amount of pool tokens for a pair.
  // console.log("total amount of pool tokens",await V2ERC20_weth_pair.methods.totalSupply().call())

// path = [Weth_address, token2Address];
// // console.log(
// await ROUTER.swapExactETHForTokens(
//   10000,
//   path,
//   account_address2,
//   Math.floor(Date.now()/1000) + 60 * 20,
//   {value: 5000, from:account_address2}
//  )
// //  .call({value: 1000,from:account_address2}))
//  let bal3 = await token2.methods.balanceOf(account_address2).call()
// console.log("token2 balance in address 2",bal3)

await V2ERC20_weth_pair.methods.approve(ROUTER.address, 15000).send({from:account_address});
let a3 = await V2ERC20_weth_pair.methods.allowance(account_address, ROUTER.address).call();
console.log(a3);

//   console.log(
await ROUTER.removeLiquidityETH(
  token2Address, 
  5000,
  100,
  10,
  account_address, 
  Math.floor(Date.now()/1000) + 60 * 20,
  {from: account_address}
)

console.log("amount of pool tokens left after removal",await V2ERC20_weth_pair.methods.balanceOf(account_address).call())
// .call({
//   from: account_address}))




  

};


