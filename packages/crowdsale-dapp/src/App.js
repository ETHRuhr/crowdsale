import React, { Component } from 'react';
import moment from 'moment';

import './App.css';
import { Crowdsale } from './components/crowdsale/Crowdsale';
import { LoadWeb3 } from './components/LoadWeb3';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crowdsale: {
        openingTime: moment(),
        closingTime: moment().add(2, 'weeks'),
        weiRaised: '0'
      }
    };
  }

  render() {
    return (
      <div className="App">
        <LoadWeb3
          netIds={[4, 17101710]}
          render={(web3, netId) => (
            <Crowdsale web3={web3} netId={netId} crowdsale={this.state.crowdsale} />
          )}
        />
      </div>
    );
  }
}

export default App;
