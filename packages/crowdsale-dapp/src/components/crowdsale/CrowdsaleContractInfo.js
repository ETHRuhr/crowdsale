import React from 'react';

export function CrowdsaleContractInfo({ address }) {
  return (
    <div className="CrowdsaleContractInfo Box">
      <h4>Token sale contract address</h4>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <strong>{address}</strong>
      </a>
    </div>
  );
}
