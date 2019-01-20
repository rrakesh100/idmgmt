import React, { Component } from 'react';
import moment from 'moment';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import AbstractPrintComponent from './AbstractPrintComponent';
import ReactToPrint from "react-to-print";
import PrintIcon from 'grommet/components/icons/base/Print';


export default class AbstractLayer extends Component {

  renderTrigger() {
    return (
      <div className="prntAnchor" style={{display: 'flex', justifyContent: 'flex-end', marginTop:15}}>
      <a>Print</a>
      </div>
    )
  }

  renderContent() {
    return this.componentRef;
  }

  setRef(ref) {
    this.componentRef = ref;
  }

  render() {
    const {
          startDate,
          endDate,
          unit,
          dailyMaleDayShift,
          dailyMaleNightShift,
          dailyFemaleDayShift,
          dailyFemaleNightShift,
          weeklyMaleDayShift,
          weeklyMaleNightShift,
          weeklyFemaleDayShift,
          weeklyFemaleNightShift,
          jattuPayment, onCloseLayer } = this.props;

    return (
      <Layer
        flush={false}
        closer={true}
        onClose={onCloseLayer}>

        <ReactToPrint
            trigger={this.renderTrigger.bind(this)}
            content={this.renderContent.bind(this)}
          />
        <AbstractPrintComponent
          ref={this.setRef.bind(this)}
          startDate={startDate}
          endDate={endDate}
          unit={unit}
          dailyMaleDayShift={dailyMaleDayShift}
          dailyMaleNightShift={dailyMaleNightShift}
          dailyFemaleDayShift={dailyFemaleDayShift}
          dailyFemaleNightShift={dailyFemaleNightShift}
          weeklyMaleDayShift={weeklyMaleDayShift}
          weeklyMaleNightShift={weeklyMaleNightShift}
          weeklyFemaleDayShift={weeklyFemaleDayShift}
          weeklyFemaleNightShift={weeklyFemaleNightShift}
          jattuPayment={jattuPayment}
        />

      </Layer>
    )
  }
}
