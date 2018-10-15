pragma solidity ^0.4.23;

import "./RuhrToken.sol";
import "./RuhrCrowdsale.sol";

contract RuhrCrowdsaleDeployer {
    RuhrToken public token;
    RuhrCrowdsale public crowdsale;

    constructor(
        address wallet,
        uint256 openingTime,  // opening time in unix epoch seconds
        uint256 closingTime   // closing time in unix epoch seconds
    )
    public
    {
        token = new RuhrToken("RuhrToken", "RUHR", 18);

        crowdsale = new RuhrCrowdsale(
            1,          // rate, in RUHRbits - 1 ETH == 1 RUHR
            wallet,     // wallet to send Ether
            token,      // the token
            40*10**24,   // total cap, in wei - 40 Millionen
            openingTime, // opening time in unix epoch seconds
            openingTime  // closing time in unix epoch seconds
        );

        token.mint(address(crowdsale), 40*10**24);
    }
}