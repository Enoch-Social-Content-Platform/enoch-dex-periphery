const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2ERC20_ABI} = require("../build/contracts/EnochV2ERC20.json");

token1Address = "0xC89Ce4735882C9F0f0FE26686c53074E09B0D550";
token2Address = "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb";
pairAddress  = "0xa13a25a0B3f75011429Ae81552a65FCCDF78ce65";
weth_pair_address = "0xb7e1185C294D2d92163AED346BA15cB3E41fAe8b";

const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
const token2 = new web3.eth.Contract(Token2_ABI, token2Address);
const V2ERC20 = new web3.eth.Contract(EnochV2ERC20_ABI, pairAddress);
const V2ERC20_weth_pair = new web3.eth.Contract(EnochV2ERC20_ABI, weth_pair_address);

contract("ERC20-ERC20 pairs", accounts => {
    const account_address = accounts[0];
    const account_address2 = accounts[1];

    it('checks token1 & token2 balances of account 0', async () => {
        let bal1 = await token1.methods.balanceOf(accounts[0]).call()
        let bal2 = await token2.methods.balanceOf(accounts[0]).call()

        console.log(bal1, bal2)
    })

    it('allows router to spend token1 & token2 on behalf of account 0', async () => {
        const ROUTER = await Router.deployed();

        await token1.methods.approve(ROUTER.address, 1000000).send({from:accounts[0]});
        await token2.methods.approve(ROUTER.address, 9000000).send({from:accounts[0]});

        let a1 = await  token1.methods.allowance(accounts[0], ROUTER.address).call()
        let a2 = await token2.methods.allowance(accounts[0], ROUTER.address).call()
        console.log(a1, a2);
    })

    it('creates ERC20-ERC20 pool and adds liquidity', async () => {
        const account_address = accounts[0];
        const ROUTER = await Router.deployed();

        console.log(await ROUTER.addLiquidity(
            token1Address, 
            token2Address, 
            10000,
            10000,
            100,
            100,
            account_address, 
            Math.floor(Date.now()/1000) + (1*60*60),
            {from:account_address}
        ))

        console.log("Liquidity for ERC20-ERC20 tokens available:",await V2ERC20.methods.balanceOf(account_address).call())
    })

    // NOTE
    // create test case for the following:
    // 1. swap
    // 2. remove liquidity
     
    it('Transfer Token 1 to acc[1] for Swapping', async() =>{
        // const account_address = accounts[0];
        // const account_address2 = accounts[1];
        await token1.methods.transfer(account_address2, 1000).send({from:account_address});
        console.log("Balance of Token1 in 2nd account", await token1.methods.balanceOf(account_address2).call())
    })

    it('Account[1] gives approval for spending Token 1 to the Router', async() =>{
        const ROUTER = await Router.deployed();
        await token1.methods.approve(ROUTER.address, 2000).send({from:account_address2});
        let a4 = await  token1.methods.allowance(account_address2, ROUTER.address).call()
         console.log("Allowance for ERC20 tokens", a4)
    })

    it('Swap between ERC20-ERC20 tokens', async() =>{
        const ROUTER = await Router.deployed();
          path = [token1Address, token2Address];
           await ROUTER.swapExactTokensForTokens(
             50,
             10,
            path,
            account_address2,
            Math.floor(Date.now()/100) + 60 * 10,
            {from:account_address2}
         )
    })

    it('Check Balance of Token2 in Account[1] after swapping', async() =>{
        let bal3 = await token2.methods.balanceOf(account_address2).call()
        console.log("token2 balance in address 2",bal3)
    })

    it('Liquidity Balance', async() =>{
        console.log("Liquidity for ERC20-ERC20 tokens available:",await V2ERC20.methods.balanceOf(account_address).call())
    })

    it('Give allowance for Removal of Liquidity', async() => {
        const ROUTER = await Router.deployed();
        await V2ERC20.methods.approve(ROUTER.address, 12000).send({from:account_address})
        let a3 = await V2ERC20.methods.allowance(account_address, ROUTER.address).call()
        console.log(a3);
    })

    it('Remove Liquidity', async() =>{
        const ROUTER = await Router.deployed();
         await ROUTER.removeLiquidity(
            token1Address,
            token2Address,
            6000,
            100,
            100,
            account_address,
            Math.floor(Date.now()/100) + 60 * 10,
            {from:account_address}
         )
    })

    it('Liquidity Remaining after the removal', async() =>{
        console.log(await V2ERC20.methods.balanceOf(account_address).call())
    })
})

contract("ERC20-ETH pairs", accounts => {
    const account_address = accounts[0];
    const account_address2 = accounts[1];
    const Weth_address = "0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7";
   
    it('creates ERC20-ETH pool and adds liquidity', async () => {
        const ROUTER = await Router.deployed();
        const account_address = accounts[0];
        
        await token2.methods.approve(ROUTER.address, 9000000).send({from:account_address});
        let a2 = await token2.methods.allowance(account_address, ROUTER.address).call()
        console.log("Allowance for Token2", a2);

        console.log(await ROUTER.addLiquidityETH(
            token2Address, 
            5000,
            1000,
            1000,
            account_address, 
            Math.floor(Date.now()/1000) + 60 * 20,
            {value: 5000,
            from: account_address}
        ))
    
    })
    it('amount of pool tokens owned by an address', async() =>{
        console.log(await V2ERC20_weth_pair.methods.balanceOf(account_address).call())
    })

    it('total amount of pool tokens',async() =>{
        console.log(await V2ERC20_weth_pair.methods.totalSupply().call())
    })
    
    it('Swapping ETH to Token ', async() =>{
        const ROUTER = await Router.deployed();
        path = [Weth_address, token2Address];

        console.log( await ROUTER.swapExactETHForTokens(
            1000,
            path,
            account_address2,
            Math.floor(Date.now()/1000) + 60 * 20,
            {value: 5000, from:account_address2}
       ))
    })

    it('Balance of Token2 in account after swapping',async() =>{
        let bal3 = await token2.methods.balanceOf(account_address2).call()
        console.log("token2 balance in address 2",bal3)
        
    })

    it('Give Approval for removing liquidity ', async() =>{
       const ROUTER = await Router.deployed();
       await V2ERC20_weth_pair.methods.approve(ROUTER.address, 8000).send({from:account_address});
       let a3 = await V2ERC20_weth_pair.methods.allowance(account_address, ROUTER.address).call();
       console.log(a3);

    })

    it('Remove Liquidity', async() =>{
        const ROUTER = await Router.deployed();
        await ROUTER.removeLiquidityETH(
        token2Address, 
        1000,
        100,
        10,
        account_address, 
        Math.floor(Date.now()/1000) + 60 * 20,
        {from: account_address}
    )
    })

   it('amount of pool tokens left after removal', async() =>{
    console.log(await V2ERC20_weth_pair.methods.balanceOf(account_address).call())

   })

})