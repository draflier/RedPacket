//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Vault is ReentrancyGuard, Ownable{
    using SafeMath for uint256;

    address m_addrToken; 
    

    uint256 m_intTxnFeeSmall = 200000000000000000;
    uint256 m_intTxnFeePct = 50;
    uint256 m_intThreshold = 100000000000000000000;
    

    mapping (string => uint256) redPacketVaultsAmt;
    mapping (string => uint256) redPacketVaultsBlkNo;
    mapping (address => string) redPacketLatest;
    //mapping (address => bool) redPacketLatestLock;

    event Deposit(address indexed _from, uint256 _value);
    event Redeem(address indexed _from, uint256 _value);


    constructor(address addrToken)  {
        m_addrToken = addrToken;
        //tokensAdded.push(TokenAddr);
    }

    function approve(uint256 intAmt) public nonReentrant {
        IERC20(m_addrToken).approve(address(this), intAmt);
    }


    function getAllowance() public view returns (uint256)  {
        return IERC20(m_addrToken).allowance(msg.sender,address(this));
    }

    function deposit(uint256 intAmt) public nonReentrant
    {
        bool blnRes;
        uint256 intTxnAmt;
        uint256 intTxnFee;
        (blnRes, intTxnAmt) = intAmt.trySub(100000000000000000000);
        if (blnRes == false)
        {
            (blnRes, intTxnAmt) = intAmt.trySub(m_intTxnFeeSmall);
            intTxnFee = m_intTxnFeeSmall;
        }
        else
        {
            (blnRes, intTxnAmt) = intAmt.tryMul(m_intTxnFeePct);
            (blnRes, intTxnAmt) = intTxnAmt.tryDiv(100);
            (blnRes, intTxnFee) = intAmt.trySub(intTxnAmt);
        }
        
        require(intTxnAmt > 0);
        string memory strKeyAddr = toString(msg.sender);
        string memory strKeyBlkNum = toString(block.number);
        string memory strTmpKey = toString(abi.encodePacked(strKeyAddr,strKeyBlkNum));

        //ensures no more than one transaction can be made in the same block.
        require(redPacketVaultsBlkNo[strTmpKey] != block.number);
        redPacketVaultsBlkNo[strTmpKey] = block.number;

        //before chainlink VRF is used, will use block.timstamp for now to generate random number. randomizer salt is used to prevent others from gettting the vault money be regenerating the QRcode.
        string memory strKeyVault = toString(keccak256(abi.encodePacked(strKeyAddr,strKeyBlkNum,  toString(abi.encodePacked(block.timestamp)))));
        IERC20(m_addrToken).transferFrom(msg.sender, owner(), intTxnFee);
        IERC20(m_addrToken).transferFrom(msg.sender, address(this), intTxnAmt);
        redPacketVaultsAmt[strKeyVault] = intTxnAmt;
        redPacketLatest[msg.sender] = strKeyVault;
        emit Deposit(msg.sender, intTxnAmt);
        //redPacketLatestLock[msg.sender] = true;
    }

    function getVaultKey() public view returns(string memory)
    {
        require(redPacketVaultsAmt[redPacketLatest[msg.sender]] != 0);
        //require(redPacketLatestLock[msg.sender] == true);
        //redPacketLatestLock[msg.sender] = false;
        return redPacketLatest[msg.sender];
    }

    function getRedPacket(string memory strKey) public nonReentrant
    {
        require(redPacketVaultsAmt[strKey] != 0);
        IERC20(m_addrToken).transfer(address(msg.sender),redPacketVaultsAmt[strKey]);
        
        emit Redeem(msg.sender,redPacketVaultsAmt[strKey] );
        redPacketVaultsAmt[strKey] = 0;
    }

    function blockTimestamp() public view returns(string memory) 
    {
        return toString(block.timestamp);
    }


    function vaultBalanceERC20() public view returns (uint256)
    {
        //address payable self = address(this);
        uint256 intBalance = IERC20(m_addrToken).balanceOf(address(this));
        return intBalance;
    }

    function setTxnFeeSmall(uint256 intTxnFee) public onlyOwner 
    {
        m_intTxnFeeSmall = intTxnFee;
    }

    function getTxnFeeSmall() public view onlyOwner returns(uint256)
    {
        return m_intTxnFeeSmall;
    }
    
    function getSupportedToken() public view returns(address)
    {
        return m_addrToken;
    }
        
    function setTxnFeePct(uint256 intTxnFeePct) public onlyOwner 
    {
        m_intTxnFeePct = intTxnFeePct;
    }

    function toString(address account) private pure returns(string memory) 
    {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) private pure returns(string memory) 
    {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes32 value) private pure returns(string memory) 
    {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) private pure returns(string memory) 
    {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }


    //this function is intended to be called before the contract is destroyed for upgrade.
    function rugPull() public onlyOwner nonReentrant
    {
        uint256 intBalance = IERC20(m_addrToken).balanceOf(address(this));
        IERC20(m_addrToken).transfer(owner(),intBalance);
    }

}
