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
import VehicleReportsComponent from './VehicleReportsComponent';
import ReactToPrint from "react-to-print";


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
    const { endDate } = this.state;
    let startDate = e.replace(/\//g, '-');
    if(endDate) {
      let strt = moment(startDate , 'DD-MM-YYYY');
      let end = moment(endDate, 'DD-MM-YYYY');

      let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
      if(!isBefore) {
        alert('End Date should be greater than Start Date');
        return;
      }
      this.setState({startDate, endDate:''})
    } else {
      this.setState({startDate, endDate:''})
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
    this.setState({endDate}, this.vehicleDatesLoop.bind(this))
  }

  vehicleDatesLoop() {
    const { startDate, endDate } = this.state;

    let datesArr=[];
    let startDateParts = startDate.split("-");
    let endDateParts = endDate.split("-");
    let startDateObj = new Date(startDateParts[2], startDateParts[1]-1, startDateParts[0]);
    let endDateObj = new Date(endDateParts[2], endDateParts[1]-1, endDateParts[0]);

    while (startDateObj <= endDateObj) {
    datesArr.push(moment(startDateObj).format('DD-MM-YYYY'));
    startDateObj.setDate(startDateObj.getDate() + 1);
    }

    let returnObj = {};
    let unitVal = window.localStorage.unit;

    this.setState({datesArr});
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
  }

  onReportTypeFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
  }

  onFetchingVehicleData() {
    const { reportType, startDate, endDate } = this.state;
    fetchVehicleReportsData(reportType, startDate, endDate).then((res) => {
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

  onClosingReport() {
    this.setState({
      response: null
    })
  }

  renderTrigger() {
    return (
      <Button  label='Print Report'
      style={{ display : 'inline-block' , marginTop: 20, width:300}}
      primary={true}
      href='#'/>
    )
  }

  renderContent() {
    return this.componentRef;
  }

  setRef(ref) {
    this.componentRef = ref;
  }

  renderInputFields() {
    return (
      <div style={{marginLeft:'20px', backgroundColor: '#F5F5F5', height: 300, display : 'flex', flexDirection : 'row'}}>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}} >
      <div style={{width: 300}}>
      <FormField label='Report Type' style={{marginTop:20}}>
        <Select
          placeHolder='Report Type'
          options={['Inward', 'In-Outward-Pending', 'In-Outward-Completed', 'Outward']}
          value={this.state.reportType}
          onChange={this.onReportTypeFieldChange.bind(this, 'reportType')}
        />
      </FormField>
      </div>
      <div style={{width: 300}}>
      <FormField label='Own/Out Vehicle' style={{marginTop:15}}>
          <Select
            placeHolder='Own/Out'
            options={['All Vehicles', 'Own Vehicle', 'Outside Vehicle']}
            value={this.state.ownOutVehicle}
            onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
          />
      </FormField>
      </div>
      <div style={{width: 300}}>
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
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}}>

      <div style={{width: 300}}>
        <FormField label='From Date' style={{marginTop:20}}>
          <DateTime id='id'
          format='D/M/YYYY'
          name='name'
          onChange={this.onStartDateChange.bind(this)}
          value={this.state.startDate}
          />
        </FormField>
      </div>

      <div style={{width: 300}}>
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

      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}}>
      <Button  label='Show Report'
      onClick={this.onValidatingInputs.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:300}}
      primary={true}
      href='#'/>
      <ReactToPrint
          trigger={this.renderTrigger.bind(this)}
          content={this.renderContent.bind(this)}
        />
      <Button  label='Close Report'
      onClick={this.onClosingReport.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:300}}
      primary={true}
      href='#'/>
      </div>
      </div>
    )
  }

  renderReportsHeader() {
    const {reportType, startDate, endDate}=this.state;
    return (
      <div style={{marginTop:20}}>
        {
          reportType && startDate && endDate ? 
          <h3 style={{textAlign: 'center'}}><strong>{reportType} Vehicle Details Report- Indate From {startDate} To {endDate}</strong></h3> : null
        }
      </div>
    )
  }

  vehicleReports() {
    const { response, reportType, ownOutVehicle, emptyLoad, startDate, endDate, datesArr } = this.state;
    return (
      <div>
        {this.renderReportsHeader()}
        <VehicleReportsComponent
            ref={this.setRef.bind(this)}
            response={response}
            datesArr={datesArr}
            reportType={reportType}
            ownOutVehicle={ownOutVehicle}
            emptyLoad={emptyLoad}
            startDate={startDate}
            endDate={endDate}
        />
      </div>
    )
  }

  showVehicleReports() {
    let reportsTable=this.vehicleReports();
    return reportsTable;
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
