const Router = artifacts.require("UniswapV2Router02.sol");
const WETH = artifacts.require("WETH.sol");

const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2ERC20_ABI} = require("../build/contracts/EnochV2ERC20.json");

token1Address = "0xEE48726f440191Be73bE07034E94B08aDcd02D80";
token2Address = "0x2ad2d5B847E53d619AC2E4b68487311277B8c850";
pairAddress  = "0x92D1C501f7A141486F39c425BFCed821522b5689";
weth_pair_address = "0x189A10b486F8b7B26db0a24906822f01681a1bb1";

const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
const token2 = new web3.eth.Contract(Token2_ABI, token2Address);
const V2ERC20 = new web3.eth.Contract(EnochV2ERC20_ABI, pairAddress);
const V2ERC20_weth_pair = new web3.eth.Contract(EnochV2ERC20_ABI, weth_pair_address);

contract("ERC20-ERC20 pairs", accounts => {
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
})

contract("ERC20-ETH pairs", accounts => {

    // I am unable to call this function (addLiquidityETH) properly. Try fixing it since you have been working on it longer than me.
    it('creates ERC20-ETH pool and adds liquidity', async () => {
        const ROUTER = await Router.deployed();
        const account_address = accounts[0];
        
        await token2.methods.approve(ROUTER.address, 9000000).send({from:account_address});
        let a2 = await token2.methods.allowance(account_address, ROUTER.address).call()
        console.log("Allowance for Token2", a2);

        console.log(await ROUTER.addLiquidityETH(
            token2Address, 
            10000,
            3000,
            2000,
            account_address, 
            Math.floor(Date.now()/1000) + 60 * 20,
            {value: 5000,
            from: account_address}
        ))
    })

    // NOTE
    // create test case for the following:
    // 1. swapETH
    // 2. remove liquidityETH
})