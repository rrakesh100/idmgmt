import React, {Component} from 'react';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import Notification from 'grommet/components/Notification';
import * as firebase from 'firebase';
import { fetchVehicleReportsData } from '../api/vehicles';


export default class VehicleReports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate:'',
      endDate:'',
      reportType: null,
      ownOutVehicle: null,
      emptyLoad: null,
      validationMsg:'',
      response: null
    }
  }

  onStartDateChange(e) {
    const { endDate, unit } = this.state;
    let startDate = e.replace(/\//g, '-');
    if(endDate) {
      let strt = moment(startDate , 'DD-MM-YYYY');
      let end = moment(endDate, 'DD-MM-YYYY');

      let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
      if(!isBefore) {
        alert('End Date should be greater than Start Date');
        return;
      }
      this.setState({startDate})
    } else {
      this.setState({startDate})
    }

  }

  onEndDateChange(e) {
    let endDate = e.replace(/\//g, '-');
    let {startDate} = this.state ;
    let dateRange = startDate + '_' + endDate;

    let strt = moment(startDate , 'DD-MM-YYYY');
    let end = moment(endDate, 'DD-MM-YYYY');

    let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
    if(!isBefore) {
      alert('End Date should be greater than Start Date');
      return;
    }
    this.setState({endDate})
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
    })
  }

  onReportTypeFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
  }

  onFetchingVehicleData() {
    const { reportType, ownOutVehicle, emptyLoad } = this.state;
    fetchVehicleReportsData(reportType).then((res) => {
      const response = res.val();
      this.setState({response})
    })
    .catch((err) => console.error(err))
  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Notification message={validationMsg} size='small' status='critical' />
      );
    }
    return null;
  }

  onValidatingInputs() {
    const { reportType, ownOutVehicle, emptyLoad } = this.state;

    if(!reportType) {
      this.setState({
        validationMsg: 'Report Type is Missing'
      })
      return
    }

    if(!ownOutVehicle) {
      this.setState({
        validationMsg: 'Own/Out Vehicle is Missing'
      })
      return
    }

    if(!emptyLoad) {
      this.setState({
        validationMsg: 'Empty/Load is Missing'
      })
      return
    }

    this.setState({
      validationMsg: ''
    }, this.onFetchingVehicleData.bind(this))
  }

  onPrintingReport() {
    console.log('print report');
  }

  onClosingReport() {
    console.log('close report');
  }

  renderInputFields() {
    return (
      <div style={{marginLeft:'20px', backgroundColor: '#F5F5F5', height: 300, display : 'flex', flexDirection : 'row'}}>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 10}} >
      <div style={{width: 250}}>
      <FormField label='Report Type' style={{marginTop:20}}>
        <Select
          placeHolder='Report Type'
          options={['Inward', 'In-Outward-Pending', 'In-Outward-Completed', 'Outward']}
          value={this.state.reportType}
          onChange={this.onReportTypeFieldChange.bind(this, 'reportType')}
        />
      </FormField>
      </div>
      <div style={{width: 250}}>
      <FormField label='Own/Out Vehicle' style={{marginTop:15}}>
          <Select
            placeHolder='Own/Out'
            options={['All Vehicles', 'Own Vehicle', 'Outside Vehicle']}
            value={this.state.ownOutVehicle}
            onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
          />
      </FormField>
      </div>
      <div style={{width: 250}}>
      <FormField label='Empty/Load' style={{marginTop:15}}>
          <Select
            placeHolder='Empty/Load'
            options={['All', 'Empty', 'Load']}
            value={this.state.emptyLoad}
            onChange={this.onFieldChange.bind(this, 'emptyLoad')}
          />
      </FormField>
      </div>
      </div>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 10}}>

      <div style={{width: 250}}>
      <FormField label='From Date' style={{marginTop:20}}>
      <DateTime id='id'
      format='D/M/YYYY'
      name='name'
      onChange={this.onStartDateChange.bind(this)}
      value={this.state.startDate}
      />
      </FormField>
      </div>

      <div style={{width: 250}}>
      <FormField label='To Date' style={{marginTop:15}}>
      <DateTime id='id'
      format='D/M/YYYY'
      name='name'
      onChange={this.onEndDateChange.bind(this)}
      value={this.state.endDate}
      />
      </FormField>
      </div>
      </div>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 10}}>

      <div style={{width: 250}}>
      <FormField label='From Time' style={{marginTop:20}}>

      </FormField>
      </div>

      <div style={{width: 250}}>
      <FormField label='To Time' style={{marginTop:15}}>

      </FormField>
      </div>
      </div>

      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 10}}>
      <Button  label='Show Report'
      onClick={this.onValidatingInputs.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:250}}
      primary={true}
      href='#'/>
      <Button  label='Print Report'
      onClick={this.onPrintingReport.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:250}}
      primary={true}
      href='#'/>
      <Button  label='Close Report'
      onClick={this.onClosingReport.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:250}}
      primary={true}
      href='#'/>
      </div>
      </div>
    )
  }

  showVehicleReports() {
    const { response, reportType, ownOutVehicle, emptyLoad, startDate, endDate } = this.state;
    if(!response)
    return null;

    let tHead1, tHead2, tHead3, tHead4;
    let tRow;
    if(reportType == 'Inward') {
      tHead1='Inward Sno';
      tHead2='Outward Sno';
      tHead3='Going To';
      tHead4='Coming From';
    } else if(reportType == 'Outward') {
      tHead1='Outward Sno';
      tHead2='Inward Sno';
      tHead3='Coming From';
      tHead4='Going To';
    }

    let tablesArray=[];

    Object.keys(response).map((vNo, index) => {
      const vehicleObj = response[vNo];
      Object.keys(vehicleObj).map((date, indx) => {
        const vObj = vehicleObj[date];
        console.log(vObj);
        let isValid=true;

        if(ownOutVehicle !== 'All Vehicles' && ownOutVehicle !== vObj.ownOutVehicle) {
          isValid=false;
        }
          if(emptyLoad !== 'All' && emptyLoad !== vObj.emptyLoad) {
            isValid=false;
          }

          if(reportType == 'Inward') {
            tRow=vObj.inwardSNo;
          } else if(reportType == 'Outward') {
            tRow=vObj.outwardSNo;
          }

          if(isValid) {
          tablesArray.push(
            <tbody key={index}>
              <tr>
               <td rowSpan={2}>{index+1}</td>
               <td rowSpan={2}>{tRow}</td>
               <td rowSpan={2}>{vObj.ownOutVehicle}</td>
               <td rowSpan={2}>{vObj.vehicleNumber}</td>
               <td>{vObj.driverName}</td>
               <td>{vObj.inDate}</td>
               <td>{vObj.outDate || '--'}</td>
               <td>{vObj.outwardSNo || '--'}</td>
               <td rowSpan={2}></td>
               <td>{vObj.material}</td>
               <td>{vObj.partyName}</td>
               <td>{vObj.billNumber}</td>
             </tr>
             <tr>
               <td>{vObj.driverNumber}</td>
               <td>{vObj.inTime}</td>
               <td>{vObj.outTime || '--'}</td>
               <td>{vObj.goingTo || '--'}</td>
               <td>{vObj.numberOfBags}</td>
               <td>{vObj.comingFrom}</td>
               <td>{vObj.remarks}</td>
             </tr>
           </tbody>
         )
         }
       })
     })

      return (
        <div className="vehicleReports">
           <table className="vehicleReportsTable" style={{ marginLeft : 20, marginTop:10}}>
             <thead className="vehiclesTableHead" style={{position: 'relative', backgroundColor: '#F5F5F5'}}>
              <tr>
                <th colSpan={4}>Out/Own Vehicles: {ownOutVehicle}</th>
                <th colSpan={4}>Empty/Load: {emptyLoad}</th>
                <th colSpan={4}>No of Vehicles:</th>
              </tr>
              <tr>
                <th rowSpan={2}>S No.</th>
                <th rowSpan={2}>{tHead1}</th>
                <th rowSpan={2}>Out/Own Vehicle</th>
                <th rowSpan={2}>Vehicle No</th>
                <th>Driver Name</th>
                <th>In Date</th>
                <th>Out Date</th>
                <th>{tHead2}</th>
                <th rowSpan={2}>Duration</th>
                <th>Material</th>
                <th>Party</th>
                <th>Bill No</th>
              </tr>
              <tr>
                <th>Cell No</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>{tHead3}</th>
                <th>Bags</th>
                <th>{tHead4}</th>
                <th>Remarks</th>
              </tr>
             </thead>
              {tablesArray}
           </table>
      </div>
    )

  }


  render() {
    return (
      <div>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
        { this.showVehicleReports() }
      </div>
    )
  }
}
