import React, {Component} from 'react';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import moment from 'moment';
import Notification from 'grommet/components/Notification';
import * as firebase from 'firebase';
import { fetchVehicleReportsData, getOutsideVehicles, getVehicleAbstractData } from '../api/vehicles';
import VehicleReportsComponent from './VehicleReportsComponent';
import AbstractVehicleReports from './AbstractVehicleReports';
import AbstractOnHandVehicleReports from './AbstractOnHandVehicleReports';
import ReactToPrint from "react-to-print";
import Label from 'grommet/components/Label';


export default class VehicleReports extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startDate:'',
      endDate:'',
      reportType: null,
      ownOutVehicle: null,
      emptyLoad: null,
      timeSlot: null,
      timeSlotSelected: false,
      validationMsg:'',
      response: null,
      abstractOnhandResponse: null
    }
  }

  onStartDateChange(e) {
    const { endDate, reportType } = this.state;

    let startDate = e.replace(/\//g, '-');
    if(reportType == 'Total Abstract' || reportType=='Abstract OH Vehicles') {
      this.setState({startDate, endDate: startDate}, this.vehicleDatesLoop.bind(this))
    } else {
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
  }

  onEndDateChange(e) {
    let endDate = e.replace(/\//g, '-');
    let {startDate, reportType} = this.state ;
    let strt = moment(startDate , 'DD-MM-YYYY');
    let end = moment(endDate, 'DD-MM-YYYY');

    let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
    if(!isBefore) {
      alert('End Date should be greater than Start Date');
      return;
    }

    if(reportType == 'Total Abstract' || reportType=='Abstract OH Vehicles') {
      if(startDate !== endDate){
          this.setState({endDate: ''}, () => alert('Both dates should be same'));
      } else {
        this.setState({endDate}, this.vehicleDatesLoop.bind(this));
      }
    } else {
      this.setState({endDate, response: null}, this.vehicleDatesLoop.bind(this));
    }
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

    this.setState({datesArr});
  }

  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
  }

  onTimeSlotChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName]: e.option,
        response: null,
        timeSlotSelected: false
      })
    } else {
      this.setState({
        [fieldName]: e.option,
        response: null,
        timeSlotSelected: true
      })
    }
  }

  onReportTypeFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
  }

  onFetchingVehicleData() {
    const { reportType, startDate, endDate, location } = this.state;

    console.log(location);
    if(reportType=='Abstract OH Vehicles') {
      getOutsideVehicles().then(snap => {
        let abstractOnhandResponse=snap.val();
        this.setState({abstractOnhandResponse})
      }).catch(err => console.error(err))
    } else if (reportType=='Total Abstract') {
      getVehicleAbstractData(startDate).then(snap => {
        let abstractResponse=snap.val();
        this.setState({abstractResponse})
      }).catch(err => console.log(err))
    } else {
      fetchVehicleReportsData(reportType, location).then(res => {
        const response = res.val();
        this.setState({response})
      })
      .catch((err) => console.error(err))
    }

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
    const { reportType, ownOutVehicle, emptyLoad, startDate } = this.state;

    if(!reportType) {
      this.setState({
        validationMsg: 'Report Type is Missing'
      })
      return
    }

    if(reportType !== 'Total Abstract' && reportType !== 'Abstract OH Vehicles' && !ownOutVehicle) {
      this.setState({
        validationMsg: 'Own/Out Vehicle is Missing'
      })
      return
    }

    if(reportType !== 'Total Abstract' && reportType !== 'Abstract OH Vehicles' && !emptyLoad) {
      this.setState({
        validationMsg: 'Empty/Load is Missing'
      })
      return
    }

    if(reportType == 'Total Abstract' && !startDate) {
      this.setState({
        validationMsg: 'Date is Missing'
      })
      return
    }

    this.setState({
      validationMsg: ''
    }, this.onFetchingVehicleData.bind(this))
  }

  onClosingReport() {
    this.setState({
      response: null,
      startDate:'',
      endDate:'',
      reportType: null,
      ownOutVehicle: null,
      emptyLoad: null,
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

  renderAbstractContent() {
    return this.abstractComponentRef;
  }

  setAbstractRef(ref) {
    this.abstractComponentRef = ref;
  }

  renderInputFields() {
    const {reportType}=this.state;
    return (
      <div style={{marginLeft:'20px', backgroundColor: '#F5F5F5', height: 300, display : 'flex', flexDirection : 'row'}}>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}} >
      <div style={{width: 300}}>
      <FormField label='Report Type' style={{marginTop:20}}>
        <Select
          placeHolder='Report Type'
          options={['Total Abstract', 'Inward', 'Inside the Unit', 'Outward']}
          value={this.state.reportType}
          onChange={this.onReportTypeFieldChange.bind(this, 'reportType')}
        />
      </FormField>
      </div>
      <div style={{width: 300}}>
      <FormField label='Own/Out Vehicle' style={{marginTop:15}}>
          {
            reportType=='Total Abstract' || reportType=='Abstract OH Vehicles' || reportType=='Detailed OH Vehicles' ?
            <Label style={{marginLeft:30}}><strong>N/A</strong></Label> :
            <Select
              placeHolder='Own/Out'
              options={['All Vehicles', 'Own Vehicle', 'Outside Vehicle']}
              value={this.state.ownOutVehicle}
              onChange={this.onFieldChange.bind(this, 'ownOutVehicle')}
            />
          }
      </FormField>
      </div>
      <div style={{width: 300}}>
      <FormField label='Empty/Load' style={{marginTop:15}}>
      {
        reportType=='Total Abstract' || reportType=='Abstract OH Vehicles' || reportType=='Detailed OH Vehicles' ?
        <Label style={{marginLeft:30}}><strong>N/A</strong></Label> :
        <Select
          placeHolder='Empty/Load'
          options={['All', 'Empty', 'Load']}
          value={this.state.emptyLoad}
          onChange={this.onFieldChange.bind(this, 'emptyLoad')}
        />
      }
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
      <div style={{width: 300}}>
        <FormField label='Time Slot' style={{marginTop:15}}>
        <Select
          placeHolder='Timeslot'
          options={['-EMPTY-', '9 AM to 9 AM']}
          value={this.state.timeSlot}
          onChange={this.onTimeSlotChange.bind(this, 'timeSlot')}
        />
        </FormField>
      </div>
      </div>

      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}}>
      <div style={{width: 300}}>
      <FormField label='Location' style={{marginTop:15}}>
            <Select
              placeHolder='Location'
              options={['All Locations', 'UNIT1','UNIT2','UNIT3','BIKKAVOLU','CHOLLANGI','KESAVARAM','KOVVURU','PEDDAPURAPPADU','SURAMPALEM','SVPC','TAPESWARAM','UPPALANKA','VASAVI']}
              value={this.state.location}
              onChange={this.onFieldChange.bind(this, 'location')}
            />
      </FormField>
      </div>
      <Button  label='Show Report'
      onClick={this.onValidatingInputs.bind(this)}
      style={{ display : 'inline-block' , marginTop: 20, width:300}}
      primary={true}
      href='#'/>
      <ReactToPrint
          trigger={this.renderTrigger.bind(this)}
          content={reportType === 'Total Abstract' ? this.renderAbstractContent.bind(this) : this.renderContent.bind(this)}
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

  vehicleReports() {
    const { response, reportType, ownOutVehicle, emptyLoad, startDate, endDate, datesArr, timeSlot, timeSlotSelected } = this.state;
    if((reportType=='Inward' || reportType=='Inside the Unit' || reportType=='In-Outward-Completed' || reportType=='Outward') && response) {
    return (
      <div>
        <VehicleReportsComponent
            ref={this.setRef.bind(this)}
            response={response}
            datesArr={datesArr}
            reportType={reportType}
            ownOutVehicle={ownOutVehicle}
            emptyLoad={emptyLoad}
            startDate={startDate}
            endDate={endDate}
            timeSlotSelected={timeSlotSelected}
            timeSlot={timeSlot}
        />
      </div>
    )
  }
  }

  abstractVehicleReports() {
    const {reportType, abstractResponse, datesArr, startDate}=this.state;
    if(reportType == 'Total Abstract' && abstractResponse) {
      return (
        <AbstractVehicleReports
            ref={this.setAbstractRef.bind(this)}
            response={abstractResponse}
            selectedDate={startDate}
        />
      )
    }
    return
  }

  abstractOnHandVehicleReports() {
    const {reportType, datesArr, abstractOnhandResponse}=this.state;
    if(reportType == 'Abstract OH Vehicles' && abstractOnhandResponse) {
      return (
        <AbstractOnHandVehicleReports
          datesArr={datesArr}
          abstractOnhandResponse={abstractOnhandResponse}
        />
      )
    }
  }

  showVehicleReports() {
    let reportsTable=this.vehicleReports();
    return reportsTable;
  }

  showAbstractVehicleReports() {
    let reportsTable=this.abstractVehicleReports();
    return reportsTable;
  }

  showAbstractOnHandVehicleReports() {
    let reportsTable=this.abstractOnHandVehicleReports();
    return reportsTable;
  }


  render() {
    return (
      <div>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
        { this.showVehicleReports() }
        { this.showAbstractVehicleReports() }
        { this.showAbstractOnHandVehicleReports() }
      </div>
    )
  }
}
