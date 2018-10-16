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
import { OpeningCountdown } from './OpeningCountdown';
import { CrowdsaleTokenInfo } from './CrowdsaleTokenInfo';

function CrowdsaleNotStarted({ crowdsaleInfo, crowdsaleAddress }) {
  return (
    <div className="Crowdsale">
      <h3>ETH.RUHR ICO will be live soon!</h3>
      <CrowdsaleContractInfo address={crowdsaleAddress}/>
      <div className="column column-2">
        <OpeningCountdown openingTime={crowdsaleInfo.openingTime}/>
        <CrowdsaleTokenInfo crowdsaleInfo={crowdsaleInfo}/>
      </div>
    </div>
  );
}

function CrowdsaleFinished({ crowdsaleInfo, crowdsaleAddress }) {
  return (
    <div className="Crowdsale">
      <h3>ETH.RUHR ICO is over!</h3>
      <CrowdsaleContractInfo address={crowdsaleAddress}/>
      <div className="column column-2">
        <ClosingCountdown closingTime={crowdsaleInfo.closingTime}/>
        <TokenDistributionCounter weiRaised={crowdsaleInfo.weiRaised}/>
      </div>
      <CheckRegistration/>
    </div>
  );
}

function CrowdsaleInProgress({ crowdsaleInfo, crowdsaleAddress }) {
  return (
    <div className="Crowdsale">
      <h3>ETH.RUHR ICO is live!</h3>
      <CrowdsaleContractInfo address={crowdsaleAddress}/>
      <div className="column column-2">
        <ClosingCountdown closingTime={crowdsaleInfo.closingTime}/>
        <TokenDistributionCounter weiRaised={crowdsaleInfo.weiRaised}/>
      </div>
      <Register/>
      <CheckRegistration/>
    </div>
  );
}

export class Crowdsale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crowdsaleInfo: null
    };
  }

  async componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 5000);
    this.crowdsale = await this.createCrowdsaleContract(this.props.web3);
    this.loadCrowdsaleInfo();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
      openingTime: moment().add(15, 'seconds'), //moment.unix(data[2]), // ,
      closingTime: moment.unix(data[3]) // moment().subtract(1, 'hour'),
    };

    console.log('crowdsaleInfo', crowdsaleInfo);
    this.setState({ crowdsaleInfo });
  };

  render() {
    if (!this.state.crowdsaleInfo) {
      return <div>Loading ...</div>;
    }

    const crowdsaleInfo = this.state.crowdsaleInfo;
    const now = moment();

    if (now.isBefore(crowdsaleInfo.openingTime)) {
      return (
        <CrowdsaleNotStarted
          crowdsaleInfo={crowdsaleInfo}
          crowdsaleAddress={this.crowdsale.options.address}
        />
      );
    } else if (now.isAfter(crowdsaleInfo.closingTime)) {
      return <CrowdsaleFinished crowdsaleInfo={crowdsaleInfo}/>;
    }

    return (
      <CrowdsaleInProgress
        crowdsaleInfo={crowdsaleInfo}
        crowdsaleAddress={this.crowdsale.options.address}
      />
    );
  }
}
