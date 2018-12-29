import React, { Component } from 'react';

export default class DatewisePrintComponent extends Component {

  render() {
    return (
      <div className="datewisePrint">
        { this.props.datewiseArr }
      </div>
    )
  }
}
