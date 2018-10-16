import React, { Component } from 'react';
import Web3 from 'web3';
import moment from 'moment';
import './Crowdsale.css';
import CrowdsaleData from 'crowdsale/build/contracts/RuhrCrowdsale.json';
import CrowdsaleDeployerData from 'crowdsale/build/contracts/RuhrCrowdsaleDeployer.json';
import { CrowdsaleContractInfo } from './CrowdsaleContractInfo';
import { ClosingCountdown } from './ClosingCountdown';
import { TokenDistributionCounter } from './TokenDistributionCounter';
import { Register } from './Register';
import { CheckRegistration } from './CeckRegistration';

export class Crowdsale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crowdsaleInfo: null
    };
  }

  async componentDidMount() {
    this.crowdsale = await this.createCrowdsaleContract(this.props.web3);
    this.loadCrowdsaleInfo();
  }

  createCrowdsaleDeployerContract = web3 => {
    const network = CrowdsaleDeployerData.networks[this.props.netId];
    if (!network) {
      throw new Error(
        `RuhrCrowdsaleDeployer not deployed to network ${this.props.netId}`
      );
    }

    return new web3.eth.Contract(CrowdsaleDeployerData.abi, network.address);
  };

  createCrowdsaleContract = async web3 => {
    const crowdsaleDeployer = this.createCrowdsaleDeployerContract(web3);
    const crowdsaleAddress = await crowdsaleDeployer.methods.crowdsale().call();

    console.log('crowdsaleAddress', crowdsaleAddress);
    return new web3.eth.Contract(CrowdsaleData.abi, crowdsaleAddress);
  };

  loadCrowdsaleInfo = async () => {
    const data = await Promise.all([
      this.crowdsale.methods.weiRaised().call(),
      this.crowdsale.methods.cap().call(),
      this.crowdsale.methods.openingTime().call(),
      this.crowdsale.methods.closingTime().call()
    ]);

    const crowdsaleInfo = {
      weiRaised: Web3.utils.fromWei(data[0]),
      cap: Web3.utils.fromWei(data[1]),
      openingTime: moment.unix(data[2]),
      closingTime: moment.unix(data[3])
    };

    console.log('crowdsaleInfo', crowdsaleInfo);
    this.setState({ crowdsaleInfo });
  };

  render() {
    if (!this.state.crowdsaleInfo) {
      return <div>Loading ...</div>;
    }

    return (
      <div className="Crowdsale">
        <h3>ETH.RUHR ICO is live!</h3>
        <CrowdsaleContractInfo address={this.crowdsale.options.address}/>
        <div className="column column-2">
          <ClosingCountdown
            closingTime={this.state.crowdsaleInfo.closingTime}
          />
          <TokenDistributionCounter
            weiRaised={this.state.crowdsaleInfo.weiRaised}
          />
        </div>
        <Register />
        <CheckRegistration />
      </div>
    );
  }
}
