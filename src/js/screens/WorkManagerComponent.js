import React, {Component} from 'react';
import Search from 'grommet/components/Search';
import { getEmployees, getEmployee } from '../api/employees';
import { Container, Row, Col } from 'react-grid-system';
import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import moment from 'moment';
import Map from './Map';
import Label from 'grommet/components/Label';
import { getWorkPlaces } from '../api/workmanager';
import Select from 'grommet/components/Select';


export default class WorkManagerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      employeeSearchString : '',
      selectedEmployeeData : null
    }
  }

  componentDidMount() {
    { this.getEmployeeDetails() }
    { this.getWorkPlaces() }
  }

  getWorkPlaces() {
    getWorkPlaces().then((snap) => {
      this.setState({
        workplaces: snap.val()
      })
    })
  }

  getEmployeeDetails() {
    getEmployees().then((snap) => {
      const data = snap.val();
      if (!data) {
        return;
      }
      let suggests = [];
      Object.keys(data).forEach((employee) => {
        if(employee != 'count')
        suggests.push({
           label : data[employee].name,
           employeeId : employee
        })
      })
      this.setState({
        employeeSuggestions: suggests,
        filteredSuggestions: suggests
      });
    })
    .catch((err) => {
      console.error('VISITOR FETCH FAILED', err);
    });
  }

  onDateChange(e) {
    this.setState({Date:e})
  }

  fetchSearchedEmployee() {
    const { selectedEmployeeId } = this.state;
    if(selectedEmployeeId) {
    getEmployee(selectedEmployeeId).then((snap) => {
      const selectedEmployeeData = snap.val();
      this.setState({
        selectedEmployeeData
      })
    }).catch((e) => console.log(e))
    }
  }

  onEmployeeSelect(data, isSuggestionSelected) {
    if(isSuggestionSelected) {
      this.setState({
        selectedEmployeeId: data.suggestion.employeeId,
        employeeSearchString: data.suggestion.label
      }, this.fetchSearchedEmployee.bind(this));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    }
  }

  onSearchEntry(e) {
    this.setState({selectedEmployeeData: ''})
    let filtered = [];
    let  options  = this.state.employeeSuggestions;

    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt)
        else if(opt.employeeId === e.target.value.toUpperCase())
          filtered.push(opt)
      })
    }
    this.setState({
      employeeSearchString: e.target.value,
      filteredSuggestions: filtered
    });
  }

  renderEmployeeSearch() {

    return (
      <Search placeHolder='Search manpower By Name or Barcode' style={{width:'600px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)}
        />
    )
  }

  onWorkPlaceChange() {
    console.log('hi')
  }

  renderSearchedEmployee() {
    const { selectedEmployeeData, workplaces } = this.state;
    const date = new Date();
    const dateStr = moment(date).format('DD/M/YYYY');
    if(selectedEmployeeData) {
      return (
        <div>
        <Row>
        <Col>
        <Form style={{marginLeft:'30px'}}>
        <FormField  label='Date *'  strong={true} style={{marginTop : '15px', width:'200px'}}  >
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onDateChange.bind(this)}
        value={this.state.Date || dateStr}
        />
        </FormField>
        </Form>
        </Col>
        <Col>
        <Select style={{marginLeft: '20px'}}
          placeHolder='Select Shift'
          options={['DAY', 'NIGHT']}
          value={this.state.shift}
          onChange={this.onWorkPlaceChange.bind(this, 'shift')}
        />
        </Col>
        <Col>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Name : {selectedEmployeeData.name}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        DOJ : {selectedEmployeeData.joinedDate}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Gender : {selectedEmployeeData.gender}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Village : {selectedEmployeeData.village}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Address : {selectedEmployeeData.address}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Payment Mode: {selectedEmployeeData.paymentType}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        No of persons : {selectedEmployeeData.numberOfPersons}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'400px', backgroundColor: '#F5F5F5'}}>
        Remarks : {selectedEmployeeData.remarks}
        </div>
        </Col>

        </Row>
        </div>
      )
    }
  }

  render() {
    const { selectedEmployeeData } = this.state;
    console.log(this.state)
    return (
      <div>
      <div style={{marginTop : '10px', marginLeft :'30px'}}>
      { this.renderEmployeeSearch() }
      </div>
      { this.renderSearchedEmployee() }
      { selectedEmployeeData ? <Map /> : null }
      </div>
    )
  }
}
