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

  onFetchingVehicleData() {
    const { reportType, ownOutVehicle, emptyLoad } = this.state;
    fetchVehicleReportsData().then((res) => {
      const response = res.val();
      console.log(response);
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
          options={['-EMPTY-', 'Inward', 'In-Outward-Pending', 'In-Outward-Completed', 'Outward']}
          value={this.state.reportType}
          onChange={this.onFieldChange.bind(this, 'reportType')}
        />
      </FormField>
      </div>
      <div style={{width: 250}}>
      <FormField label='Own/Out Vehicle' style={{marginTop:15}}>
          <Select
            placeHolder='Own/Out'
            options={['-EMPTY-', 'All Vehicles', 'Own Vehicles', 'Out Vehicles']}
            value={this.state.ownOutVehicle}
            onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
          />
      </FormField>
      </div>
      <div style={{width: 250}}>
      <FormField label='Empty/Load' style={{marginTop:15}}>
          <Select
            placeHolder='Empty/Load'
            options={['-EMPTY-', 'All', 'Empty', 'Full']}
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


  render() {
    return (
      <div>
      { this.renderValidationMsg() }
      { this.renderInputFields() }
      </div>
    )
  }
}
