import React, { Component } from 'react';

export default class DatewisePrintComponent extends Component {

  render() {
    const { startDate, endDate } = this.props;
    return (
      <div className="datewisePrint">
        
        { this.props.datewiseArr }
      </div>
    )
  }
}
