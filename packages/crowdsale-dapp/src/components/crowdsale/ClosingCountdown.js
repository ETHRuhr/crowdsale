import React from 'react';

export function ClosingCountdown({ closingTime }) {
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
