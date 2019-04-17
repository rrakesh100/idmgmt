import React from 'react';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import { fetchAllVehicles } from '../api/vehicles';
import { getMaterials } from '../api/configuration';
import Notification from 'grommet/components/Notification';
import * as firebase from 'firebase';
import ReactToPrint from "react-to-print";
import Layer from 'grommet/components/Layer';
import Status from 'grommet/components/icons/Status';
import { Container, Row, Col } from 'react-grid-system';
import Label from 'grommet/components/Label';
import { Input } from 'semantic-ui-react';
import moment from 'moment';
import MaterialwiseReportsComponent from './MaterialwiseReportsComponent';


class MaterialwiseReports extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      startDate:'',
      endDate:'',
      materialOpt:[],
      showReports: false
    };
  }

  componentDidMount() {
    this.getVehicles();
    this.getMaterialDetails();
  }

  getMaterialDetails() {
    getMaterials().then((snap) => {
      const options = snap.val();
      let materialOpt = [];
      Object.keys(options).forEach((opt) => {
        materialOpt.push(opt)
      })
      this.setState({materialOpt})
    }).catch((e) => console.log(e))
  }

  getVehicles() {
    fetchAllVehicles().then(snap => {
      let vehicleData=snap.val();
      this.setState({vehicleData})
    }).catch(err => console.log(err))
  }

  onFieldChange(fieldName, e, o) {
      if(fieldName==='location') {
        this.setState({
          [fieldName]: e.option
        })
      }

      if(fieldName==='materialType') {
        this.setState({
          [fieldName]: o.value
        })
      }
  }

  onStartDateChange(e) {
    const { endDate, reportType } = this.state;

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
    let {startDate, reportType} = this.state ;
    let strt = moment(startDate , 'DD-MM-YYYY');
    let end = moment(endDate, 'DD-MM-YYYY');

    let isBefore = strt.valueOf() === end.valueOf() ?  true : moment(strt).isBefore(end) ;
    if(!isBefore) {
      alert('End Date should be greater than Start Date');
      return;
    }
      this.setState({endDate, response: null});
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

  onCloseLayer() {
    this.setState({
      validationMsg: '',
    })
  }

  onOkButtonClick() {
    this.setState({
      validationMsg: '',
    })
  }

  renderValidationMsg() {
    const { validationMsg } = this.state;
    if (validationMsg) {
      return (
        <Layer onClose={this.onCloseLayer.bind(this)}>
          <h3 style={{marginTop:20}}>
          <Status value='critical'
          size='medium'
          style={{marginRight:'10px'}} />
          <strong>{validationMsg}</strong>
          </h3>
           <hr />
           <h5>Please Select Again</h5>
           <Row>
           <Button
             label='OK'
             onClick={this.onOkButtonClick.bind(this)}
             href='#' style={{marginLeft: '300px', marginBottom:'10px'}}
             primary={true} />
           </Row>
        </Layer>
      );
    }
    return null;
  }

  onShowingMaterialwiseReports() {
    this.setState({
      showReports: true
    })
  }

  materialwiseReports() {
    const { showReports, vehicleData, materialType, location, startDate, endDate } = this.state;
    console.log(vehicleData);
    console.log(startDate);
    console.log(endDate);
    return (
      <div>
          <MaterialwiseReportsComponent
            showReports={showReports}
            response={vehicleData}
            materialType={materialType}
            location={location}
            startDate={startDate}
            endDate={endDate}
          />
      </div>
    )
  }

  onValidatingInputs() {
    const { materialType, location, startDate, endDate } = this.state;

    if(!materialType) {
      this.setState({
        validationMsg: 'Material Type is missing'
      })
      return
    }

    if(!location) {
      this.setState({
        validationMsg: 'Location is missing'
      })
      return
    }

    this.setState({
      validationMsg:''
    }, this.onShowingMaterialwiseReports.bind(this))
  }

  onClosingReport() {

  }

  renderInputFields() {
    return (
      <div style={{marginLeft:'20px', backgroundColor: '#F5F5F5', height: 300, display : 'flex', flexDirection : 'row'}}>
      <div style={{display : 'flex', flexDirection : 'column', marginLeft: 30}} >
      <div>
      <FormField label='Material Type' style={{marginTop:15, backgroundColor:'white'}}>

        <Input transparent
        list='materials'
        placeholder='Material Type'
        onChange={this.onFieldChange.bind(this, 'materialType')} />
      <datalist id='materials'>
        {
          this.state.materialOpt.map((val, index) => {
            return <option value={val} key={index}/>
          })
        }
      </datalist>
      </FormField>
      </div>
      <div style={{width: 300}}>
      <FormField label='Location' style={{marginTop:15}}>
            <Select
              placeHolder='Location'
              options={['All Locations', 'UNIT-2', 'UNIT-3']}
              value={this.state.location}
              onChange={this.onFieldChange.bind(this, 'location')}
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

  renderMaterialwiseReports() {
    let reportsTable=this.materialwiseReports();
    return reportsTable;
  }

  render() {
    return (
      <div>
        {this.renderValidationMsg()}
        {this.renderInputFields()}
        {this.renderMaterialwiseReports()}
      </div>
    )
  }
}

export default MaterialwiseReports;
