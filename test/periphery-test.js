const { expect } = require("chai");
const { ethers } = require("hardhat");

const Token1_ABI = require("../abi/Token1.json");
const Token2_ABI = require("../abi/Token2.json");
const EnochV2ERC20_ABI = require("../abi/EnochV2Pair.json");
const Router_ABI = require("../abi/UniswapV2Router02.json");
const WETH_ABI = require("../abi/WETH.json");

token1Address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
token2Address = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
pairAddress  = "0xb9eBbdeEa25613e23f41E8Be11674c6277A3B3f9";
weth_pair_address = "0x6bb04959279B686644571ab46F873bfadf6Bd58a";
routerAddress = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
Weth_address = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

const local_provider = ethers.getDefaultProvider("http://localhost:8545");

const token1 = new ethers.Contract(token1Address, Token1_ABI, local_provider);
const token2 = new ethers.Contract(token2Address, Token2_ABI, local_provider);
const V2ERC20 = new ethers.Contract(pairAddress, EnochV2ERC20_ABI, local_provider);
const V2ERC20_weth_pair = new ethers.Contract(weth_pair_address, EnochV2ERC20_ABI, local_provider);

const router = new ethers.Contract(routerAddress, Router_ABI, local_provider);
const weth = new ethers.Contract(Weth_address, WETH_ABI, local_provider);

let account_address, account_address2;

describe("Booting", () => {

  beforeEach(async () => {
    [account_address, account_address2]  = await ethers.getSigners();
  })
  
  describe('ERC20-ERC20 pairs', () => {
    it('checks token1 & token2 balances of account 0', async () => {

      let bal1 = await token1.functions.balanceOf(account_address.address)
      let bal2 = await token2.functions.balanceOf(account_address2.address)
  
      console.log(bal1.toString(), bal2.toString())
    })
  
    it('allows router to spend token1 & token2 on behalf of account 0', async () => {
  
      await token1.connect(account_address).approve(routerAddress, 1000000);
      await token2.connect(account_address).approve(routerAddress, 9000000);
  
      let a1 = await  token1.allowance(account_address.address, routerAddress)
      let a2 = await token2.allowance(account_address.address, routerAddress)
      console.log(a1.toString(), a2.toString());
    })
  
    it('creates ERC20-ERC20 pool and adds liquidity', async () => {
  
      const addLiquidityReceipt = await router.connect(account_address).addLiquidity(
        token1Address, 
        token2Address, 
        10000,
        10000,
        100,
        100,
        account_address.address, 
        Math.floor(Date.now()/1000) + (1*60*60),
      )
      console.log((await addLiquidityReceipt.wait()).events)
      console.log("Liquidity for ERC20-ERC20 tokens available:", (await V2ERC20.balanceOf(account_address.address)).toString())
    })

//     })

//     // NOTE
//     // create test case for the following:
//     // 1. swap
//     // 2. remove liquidity
     
    it('Transfer Token 1 to acc[1] for Swapping', async() =>{

      await token1.connect(account_address).transfer(account_address2.address, 1000);
      console.log("Balance of Token1 in 2nd account", (await token1.balanceOf(account_address2.address)).toString())
    })

    it('Account[1] gives approval for spending Token 1 to the Router', async() =>{
      await token1.connect(account_address2).approve(routerAddress, 2000);
      let a4 = await  token1.allowance(account_address2.address, routerAddress)
      console.log("Allowance for ERC20 tokens", a4.toString())
    })

//     //change - console.log
    it('Swap between ERC20-ERC20 tokens', async() =>{
      path = [token1Address, token2Address];
      
      console.log(await router.connect(account_address2).swapExactTokensForTokens(
        50,
        10,
        path,
        account_address2.address,
        Math.floor(Date.now()/100) + 60 * 10
      ))
    })

//     //change - token1 console.log
    it('Check Balance of Token2 in Account[1] after swapping', async() =>{
      let bal3 = await token1.balanceOf(account_address2.address)
      let bal4 = await token2.balanceOf(account_address2.address)

      console.log("token1 balance in address 2", bal3.toString())
      console.log("token2 balance in address 2",bal4.toString())
    })

    it('Liquidity Balance', async() =>{
      console.log("Liquidity for ERC20-ERC20 tokens available:", (await V2ERC20.balanceOf(account_address.address)).toString())
    })

//     //change - approve 6000 instead of 12000
    it('Give allowance for Removal of Liquidity', async() => {
      await V2ERC20.connect(account_address).approve(routerAddress, 6000)

      let a3 = await V2ERC20.allowance(account_address.address, routerAddress)
      console.log(a3.toString());
    })

    it('Remove Liquidity', async() =>{
      await router.connect(account_address).removeLiquidity(
        token1Address,
        token2Address,
        6000,
        100,
        100,
        account_address.address,
        Math.floor(Date.now()/100) + 60 * 10
      )
    })

    it('Liquidity Remaining after the removal', async() =>{
        console.log((await V2ERC20.balanceOf(account_address.address)).toString())
    })
  })

  describe("ERC20-ETH pairs", () => {
//     const account_address = accounts[0];
//     const account_address2 = accounts[1];
//     const Weth_address = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
   
    it('creates ERC20-ETH pool and adds liquidity', async () => {
      await token2.connect(account_address).approve(routerAddress, 9000000);
      let a2 = await token2.allowance(account_address.address, routerAddress)
      console.log("Allowance for Token2", a2.toString());

      console.log((await router.connect(account_address).addLiquidityETH(
          token2Address, 
          5000,
          1000,
          1000,
          account_address.address, 
          Math.floor(Date.now()/1000) + 60 * 20,
          {value: 5000}
      )))
    
    })
    it('amount of pool tokens owned by an address', async() =>{
        console.log((await V2ERC20_weth_pair.balanceOf(account_address.address)).toString())
    })

    it('total amount of pool tokens',async() =>{
        console.log((await V2ERC20_weth_pair.totalSupply()).toString())
    })
    
    it('Swapping ETH to Token ', async() =>{
      path = [Weth_address, token2Address];

      console.log( await router.connect(account_address2).swapExactETHForTokens(
        100,
        path,
        account_address2.address,
        Math.floor(Date.now()/1000) + 60 * 20,
        {value: 5000}
      ))
    })

    it('Balance of Token2 in account after swapping',async() =>{
        let bal3 = await token2.balanceOf(account_address2.address)
        console.log("token2 balance in address 2", bal3.toString())   
    })

    it('Give Approval for removing liquidity ', async() =>{
      await V2ERC20_weth_pair.connect(account_address).approve(routerAddress, 8000);

      let a3 = await V2ERC20_weth_pair.allowance(account_address.address, routerAddress);
      console.log(a3.toString());
    })

    it('Remove Liquidity', async() =>{
      await router.connect(account_address).removeLiquidityETH(
      token2Address, 
      1000,
      100,
      10,
      account_address.address, 
      Math.floor(Date.now()/1000) + 60 * 20)
    })

    it('amount of pool tokens left after removal', async() =>{
      console.log((await V2ERC20_weth_pair.balanceOf(account_address.address)).toString())
    })

  });
});
