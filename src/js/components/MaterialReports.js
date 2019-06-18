import React from 'react';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import moment from 'moment';
import Notification from 'grommet/components/Notification';
import * as firebase from 'firebase';
import ReactToPrint from "react-to-print";
import Label from 'grommet/components/Label';
import {fetchMaterialReportsData} from '../api/materials';
import MaterialReportsComponent from './MaterialReportsComponent';

class MaterialReports extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      validationMsg:'',
      response: null
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

  onFieldChange(fieldName,e) {
    this.setState({
      [fieldName]: e.option,
      response: null
    })
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
    let {startDate} = this.state ;
    let endDate = e.replace(/\//g, '-');
      let strt = moment(startDate , 'DD-MM-YYYY');
      let end = moment(endDate, 'DD-MM-YYYY');

      let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
      if(!isBefore) {
        alert('End Date should be greater than Start Date');
        return;
      }
      this.setState({endDate, response:null}, this.materialDatesLoop.bind(this))
  }

  materialDatesLoop() {
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

  onValidatingInputs() {
    const {location, reportType, transactionType}=this.state;

    if(!reportType) {
      this.setState({
        validationMsg: 'Report Type is Missing'
      })
      return
    }

    if(!transactionType) {
      this.setState({
        validationMsg: 'Transaction Type is Missing'
      })
      return
    }

    this.setState({
      validationMsg: ''
    }, this.onFetchingMaterialData.bind(this))

  }

  onFetchingMaterialData() {
    const {reportType, transactionType, location}=this.state;
    let report,unit;
    if(reportType == 'Outward') {
      report = 'out';
    } else {
      report = 'in';
    }

    if(location) {
      if(location === 'UNIT2')
      unit='';
      else
      unit=location;
    } else {
      unit=localStorage.unit;
    }
    let unitsArray=['UNIT1','UNIT2','UNIT3','BIKKAVOLU','CHOLLANGI','KESAVARAM','KOVVURU','PEDDAPURAPPADU','SURAMPALEM','SVPC','TAPESWARAM','UPPALANKA','VASAVI'];
    fetchMaterialReportsData(report, unit).then(res => {
      const response = res.val();
      this.setState({response})
    })
    .catch((err) => console.error(err))
  }

  onClosingReport() {
    this.setState({
      response: null,
      startDate:'',
      endDate:'',
      reportType: null,
      transactionType:''
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
          options={['Inward', 'Outward']}
          value={this.state.reportType}
          onChange={this.onFieldChange.bind(this, 'reportType')}
        />
      </FormField>
      </div>
      <div style={{width: 300}}>
      <FormField label='Transaction Type' style={{marginTop:15}}>
            <Select
              placeHolder='Transaction Type'
              options={['All', 'Returnable', 'Non-Returnable']}
              value={this.state.transactionType}
              onChange={this.onFieldChange.bind(this, 'transactionType')}
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

  renderMaterialReports() {
    const {response,reportType,transactionType,startDate,endDate,datesArr}=this.state;
    if(!response)
    return;

    return (
      <MaterialReportsComponent
        ref={this.setRef.bind(this)}
        response={response}
        reportType={reportType}
        transactionType={transactionType}
        startDate={startDate}
        endDate={endDate}
        datesArr={datesArr}
      />
    )
  }

  render() {
    return (
      <div>
      { this.renderValidationMsg() }
      { this.renderInputFields() }
      { this.renderMaterialReports() }
      </div>
    )
  }
}

export default MaterialReports
