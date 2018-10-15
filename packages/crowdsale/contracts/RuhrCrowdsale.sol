pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";

contract RuhrCrowdsale is Crowdsale, CappedCrowdsale, TimedCrowdsale {

    constructor(
        uint256 rate,         // rate, in RUHRbits
        address wallet,       // wallet to send Ether
        ERC20 token,          // the token
        uint256 cap,          // total cap, in wei
        uint256 openingTime,  // opening time in unix epoch seconds
        uint256 closingTime   // closing time in unix epoch seconds
    )
    CappedCrowdsale(cap)
    TimedCrowdsale(openingTime, closingTime)
    Crowdsale(rate, wallet, token)
    public
    {
        // nice, we just created a crowdsale that's only open
        // for a certain amount of time
        // and stops accepting contributions once it reaches `cap`
    }
}