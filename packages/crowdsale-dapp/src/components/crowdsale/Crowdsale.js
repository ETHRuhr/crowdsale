import React, { Component } from 'react';
import Web3 from 'web3';
import moment from 'moment';
import './Crowdsale.css';
import CrowdsaleData from 'crowdsale/build/contracts/RuhrCrowdsale.json';
import CrowdsaleDeployerData from 'crowdsale/build/contracts/RuhrCrowdsaleDeployer.json';

function CrowdsaleContractInfo() {
  return (
    <div className="CrowdsaleContractInfo Box">
      <h4>Token sale contract address</h4>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <strong>0xdeadbeaftokensaleaddress</strong>
      </a>
    </div>
  );
}

function ClosingCountdown({ closingTime }) {
  return (
    <div className="ClosingCountdown Box">
      <h4>
        <strong>END DATE:</strong>
      </h4>
      <h4>
        <strong>{closingTime.format('LLL')}</strong>
      </h4>
    </div>
  );
}

function TokenDistributionCounter({ weiRaised }) {
  console.log(weiRaised);
  return (
    <div className="TokenDistributionCounter Box">
      <h1>{Web3.utils.fromWei(weiRaised)}</h1>
      <strong>RUHR Tokens distributed</strong>
    </div>
  );
}

function Register() {
  return (
    <div className="Register Box">
      <a href="#">
        <strong>Become an Early Contributer </strong>
      </a>
    </div>
  );
}

function CheckRegistration() {
  return (
    <div className="CheckRegistration Box">
      <input type="text" />
      <button>Check your Registration</button>
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
      this.crowdsale.methods.openingTime().call(),
      this.crowdsale.methods.closingTime().call()
    ]);

    const crowdsaleInfo = {
      weiRaised: data[0],
      openingTime: moment.unix(data[1]),
      closingTime: moment.unix(data[2])
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
        <CrowdsaleContractInfo />
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
