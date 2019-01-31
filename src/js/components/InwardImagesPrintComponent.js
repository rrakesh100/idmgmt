import React, { Component } from 'react';


export default class InwardImagesPrintComponent extends Component {

  render() {
    const { startDate, endDate, unit, inwardImagesArr } = this.props;
    return (
      <div style={{marginTop:20}}>
      {
        startDate == endDate ?
        <h3 style={{textAlign: 'center'}}><strong>DATEWISE MANPOWER INWARD IMAGES AS ON: {startDate}</strong></h3> :
        <h3 style={{textAlign: 'center'}}><strong>DATEWISE MANPOWER INWARD IMAGES FROM: {startDate} TO: {endDate}</strong></h3>
      }
      <h4 style={{marginLeft:30}}><strong>Unit:{unit}</strong></h4>
      <div style={{display:'flex', flex:1, flexDirection:'row', flexWrap: 'wrap', marginTop:20}}>
      {inwardImagesArr}
      </div>
      </div>
    )
  }
}
