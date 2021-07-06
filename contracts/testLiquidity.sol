pragma solidity >=0.5.0;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IERC20.sol";
// import "./interfaces/IUniswapV2Router01.sol";
 import "./interfaces/Uniswap.sol";


contract testLiquidity{

    address private constant FACTORY = 0x2a055D62690f94128C9532AB909ac6261c41304a;
    address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; //uniswap router address
    address private constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    event Log(string message, uint256 val);

    function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) external {
        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router(ROUTER).addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            address(this),
            block.timestamp
        );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);
        emit Log("liquidity", liquidity);

    }

    function removeLiquidity(address _tokenA, address _tokenB) external{

        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

        uint liquidity = IERC20(pair).balanceOf(address(this));
        IERC20(pair).approve(ROUTER, liquidity);

        (uint amountA, uint amountB) = IUniswapV2Router(ROUTER).removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            address(this),
            block.timestamp
        );

        emit Log("amountA", amountA);
        emit Log("amountB", amountB);

    }


}