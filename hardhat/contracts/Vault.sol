//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Vault is ReentrancyGuard, Ownable{
    //using SafeMath for uint256;


    address addrUsdc; 

    mapping (string => uint) redPacketVaults;


    constructor(address addrToken)  {

        //tokensAdded.push(TokenAddr);
    }

    function balance(address owner) public view returns (uint256)
    {
        //address payable self = address(this);
        uint256 intBalance = owner.balance;
        return intBalance;
    }

    function vaultBalance() public view returns (uint256)
    {
        //address payable self = address(this);
        uint256 intBalance = address(this).balance;
        return intBalance;
    }


    function vaultBalanceERC20(IERC20 token) public view returns (uint256)
    {
        //address payable self = address(this);
        uint256 intBalance = token.balanceOf(address(this));
        return intBalance;
    }

    function releaseAll(IERC20 token)  public nonReentrant() onlyOwner() {
        
        
        release(token,addrStakeHolders[0]);
        release(token,addrStakeHolders[1]);
        release(token,addrStakeHolders[2]);

  
        /*
        release(addrStakeHolders[0]);
        release(addrStakeHolders[2]);
        release(addrStakeHolders[3]);
        */
    }


    function releaseAll()  public nonReentrant() onlyOwner() {
        
        address payable addrStakeHolder = payable(address(addrStakeHolders[0]));
        release(addrStakeHolder);
        addrStakeHolder = payable(address(addrStakeHolders[1]));        
        release(addrStakeHolder);
        addrStakeHolder = payable(address(addrStakeHolders[2]));
        release(addrStakeHolder);
  
        /*
        release(addrStakeHolders[0]);
        release(addrStakeHolders[2]);
        release(addrStakeHolders[3]);
        */
    }


}
