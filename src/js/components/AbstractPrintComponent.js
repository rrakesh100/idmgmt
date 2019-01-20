import React, { Component } from 'react';
import moment from 'moment';
import Layer from 'grommet/components/Layer';

export default class AbstractPrintComponent extends Component {

  render() {
    const date = new Date();
    const timestampStr = moment(date).format('DD/MM/YYYY hh:mm:ss A');
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
          jattuPayment } = this.props;

    let weeklyMaleTotal = weeklyMaleDayShift + weeklyMaleNightShift;
    let weeklyFemaleTotal = weeklyFemaleDayShift + weeklyFemaleNightShift;
    let dailyMaleTotal = dailyMaleDayShift + dailyMaleNightShift;
    let dailyFemaleTotal = dailyFemaleDayShift + dailyFemaleNightShift;

    let weeklyDaySubTotal = weeklyMaleDayShift + weeklyFemaleDayShift;
    let weeklyNightSubTotal = weeklyMaleNightShift + weeklyFemaleNightShift;
    let weeklySubTotal = weeklyDaySubTotal + weeklyNightSubTotal;

    let dailyDaySubTotal = dailyMaleDayShift + dailyFemaleDayShift;
    let dailyNightSubTotal = dailyMaleNightShift + dailyFemaleNightShift;
    let dailySubTotal = dailyDaySubTotal + dailyNightSubTotal;

    let dayGrandTotal = weeklyDaySubTotal + dailyDaySubTotal;
    let nightGrandTotal = weeklyNightSubTotal + dailyNightSubTotal;
    let grandTotal = dayGrandTotal + nightGrandTotal + jattuPayment;

    return (
        <div style={{marginTop:40}}>
        <div style={{marginLeft:10}}>
        {
          startDate == endDate ?
          <h5 style={{textAlign: 'center'}}><strong>ABSTRACT MANPOWER DETAILS AS ON {startDate}</strong></h5> :
          <h5 style={{textAlign: 'center'}}><strong>ABSTRACT MANPOWER DETAILS FROM :{startDate} To: {endDate}</strong></h5>
        }
        <h5 className="unitClass"><strong>Unit: {unit}</strong></h5>
        </div>
        <table style={{width:'100%'}}>
             <tr>
               <th></th>
               <th>Day Shift</th>
               <th>Night Shift</th>
               <th>Day Total</th>
             </tr>
              <tr style={{color : 'green'}}>
                  <td>Weekly Male</td>
                  <td>{weeklyMaleDayShift}</td>
                  <td>{weeklyMaleNightShift}</td>
                  <td>{weeklyMaleTotal}</td>
              </tr>
              <tr style={{color : 'green'}}>
                  <td>Weekly Female</td>
                  <td>{weeklyFemaleDayShift}</td>
                  <td>{weeklyFemaleNightShift}</td>
                  <td>{weeklyFemaleTotal}</td>
              </tr>
              <tr style={{color : 'red'}}>
                  <td>Sub Total</td>
                  <td>{weeklyDaySubTotal}</td>
                  <td>{weeklyNightSubTotal}</td>
                  <td>{weeklySubTotal}</td>
              </tr>
              <tr style={{color : 'blue'}}>
                  <td>Daily Male</td>
                  <td>{dailyMaleDayShift}</td>
                  <td>{dailyMaleNightShift}</td>
                  <td>{dailyMaleTotal}</td>
              </tr>
              <tr style={{color : 'blue'}}>
                  <td>Daily Female</td>
                  <td>{dailyFemaleDayShift}</td>
                  <td>{dailyFemaleNightShift}</td>
                  <td>{dailyFemaleTotal}</td>
              </tr>

              <tr style={{color : 'red'}}>
                  <td>Sub Total</td>
                  <td>{dailyDaySubTotal}</td>
                  <td>{dailyNightSubTotal}</td>
                  <td>{dailySubTotal}</td>
              </tr>
              <tr>
                  <td>Jattu</td>
                  <td>{jattuPayment}</td>
                  <td>0</td>
                  <td>{jattuPayment}</td>
              </tr>
              <tr style={{color : 'red'}}>
                  <td>GRAND TOTAL</td>
                  <td><strong>{dayGrandTotal}</strong></td>
                  <td><strong>{nightGrandTotal}</strong></td>
                  <td><strong>{grandTotal}</strong></td>
              </tr>
        </table>
        <div>
           <p style={{position: 'absolute', right: 20}}><strong>page 1/1,<span>Dated {timestampStr}</span></strong></p>
        </div>
        </div>
    )
  }
}
