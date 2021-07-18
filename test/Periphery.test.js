// const BN = require("bn.js");
const Router = artifacts.require("UniswapV2Router02.sol");
const { abi: Token1_ABI } = require("../build/contracts/Token1.json");
const {abi: Token2_ABI} = require("../build/contracts/Token2.json");
const {abi: EnochV2Pair} = require("../../enoch-dex-core/build/contracts/EnochV2Pair.json");

const IERC20 = artifacts.require("IERC20");
token1Address = "0x7ba0b55a2F4eB010fd16548CcEE7D64E04462E56";
token2Address = "0x8c30f41Bf0a40C6156C7C7d19676c1DB43dc5771";
pairAddress = "0x2C89050a352D3531231dECA184b8cEcd0384C864";  

contract('Router', function(accounts) {
    it('tests', async function(){
        const router = await Router.deployed();
        web3 = router.constructor.web3;

        const token1 = new web3.eth.Contract(Token1_ABI, token1Address);
        console.log(await token1.methods.balanceOf(accounts[0]).call());

        const pair = new web3.eth.Contract(EnochV2Pair, pairAddress);
        console.log(await pair.methods.getReserves().call());
    })
})