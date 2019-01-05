import React, { Component } from 'react';

export default class DatewisePrintComponent extends Component {

  render() {
    const { startDate, endDate } = this.props;
    return (
      <div className="datewisePrint">
        { startDate == endDate ?
        <h2 style={{textAlign: 'center', marginTop: 80}}>Datewise Manpower Details as on {startDate}</h2> :
        <h2 style={{textAlign: 'center', marginTop: 80}}>Datewise Manpower Details from {startDate} to {endDate}</h2> }
        { this.props.datewiseArr }
      </div>
    )
  }
}
