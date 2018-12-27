import React, { Component } from 'react';

export default class DatewisePrintComponent extends Component {

  renderDatewisePrint() {
        const { datewiseArr } = this.props;
        return datewiseArr;
  }

  render() {
    return (
      <div>
        { this.renderDatewisePrint() }
      </div>
    )
  }
}
