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
import { getWorkPlaces, updateWorkLocation, getCount } from '../api/workmanager';
import Select from 'grommet/components/Select';
import Toast from 'grommet/components/Toast';


export default class WorkManagerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      employeeSearchString : '',
      selectedEmployeeData : null,
      selectedZone : null,
      countData : {},
      workplaces : {}
    }
  }

  componentDidMount() {
    { this.getWorkPlaces() }
    { this.getEmployeeDetails() }
  }

  getWorkPlaces() {
    getWorkPlaces().then((snap) => {
      const data = snap.val();
      if(!data) {
        return;
      }
      let arr = [];
      Object.keys(data).forEach((place) => {
        arr.push(place)
      })
      this.setState({
        workplacesArr: arr,
        workplaces: data
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

  getCount() {
    const { selectedZone } = this.state;
    if(selectedZone) {
      getCount(selectedZone).then((snap) => {
        const data = snap.val();
        this.setState({
          countData: data
        })
      }).catch((e) => console.log(e))
    }
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
      <Search placeHolder='Search manpower By Name or Barcode' style={{width:'800px'}}
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

  onWorkPlaceChange(fieldName, e) {
    this.setState({
      [fieldName] : e.option
    })
  }

  renderSearchedEmployee() {
    const { selectedEmployeeData, workplacesArr, workplaces, selectedZone, countData } = this.state;
    let date = new Date();
    let hours = date.getHours();
    let allottedMaleCount = 0;
    let allottedFemaleCount = 0;
    if(hours < 15 && workplaces[selectedZone]) {
       allottedMaleCount = workplaces[selectedZone]['allocation'] && workplaces[selectedZone]['allocation']['DAY']
                          ? workplaces[selectedZone]['allocation']['DAY']['male'] : 0;
       allottedFemaleCount = workplaces[selectedZone]['allocation'] && workplaces[selectedZone]['allocation']['DAY']
                            ? workplaces[selectedZone]['allocation']['DAY']['female'] : 0;
    } else if(workplaces[selectedZone]){
       allottedMaleCount = workplaces[selectedZone]['allocation'] &&
          workplaces[selectedZone]['allocation']['NIGHT'] ? workplaces[selectedZone]['allocation']['NIGHT']['male'] : 0;
       allottedFemaleCount = workplaces[selectedZone]['allocation'] &&
      workplaces[selectedZone]['allocation']['NIGHT']? workplaces[selectedZone]['allocation']['NIGHT']['female'] : 0;
    }

    const fCount = countData && countData.Female ? Object.keys(countData.Female).length : 0;
    const mCount = countData && countData.Male ? Object.keys(countData.Male).length : 0;
    const dateStr = moment(date).format('DD/M/YYYY');

    if(selectedEmployeeData) {
      return (
        <div>
        <Container>
        <Row>
        <Col>
        <Row>
        <Col>
        <Form style={{marginLeft:'20px'}}>
        <FormField  label='Date *'  strong={true} style={{marginTop : '15px', width:'300px' }}  >
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onDateChange.bind(this)}
        value={this.state.Date || dateStr}
        />
        </FormField>
        </Form>
        </Col>
        </Row>
        <Row>
        <Col>
        <Form style={{marginLeft: '20px',marginTop:'30px', width:'300px'}}>
        <FormField  label='Old Work Location'  strong={true} style={{marginTop : '25px', width:'300px'}}  >
          <Label style={{marginLeft:'20px'}}><strong>{selectedEmployeeData.currentWorkLocation || '----'}</strong></Label>
        </FormField>
        </Form>
        </Col>
        <Col>
        <Form style={{marginLeft: '20px',marginTop:'30px', width:'300px'}}>
        <FormField style={{ height: '60px' }}>
        <Select
          placeHolder='New Work Location'
          options={workplacesArr}
          value={this.state.selectedZone}
          onChange={this.onWorkPlaceChange.bind(this, 'selectedZone')}
        />
        </FormField>
        </Form>
        </Col>
        </Row>
        <Row>
        <div style={{height: '60px', marginLeft: '35px', marginTop: '20px'}}>
        <span style={{color: 'red'}}>Allotted Count</span> : <span>Male - {allottedMaleCount}</span><span style={{marginLeft: '10px'}}>Female - {allottedFemaleCount} </span>
        </div>
        <div style={{height: '60px', marginLeft: '80px', marginTop: '20px'}}>
        <span style={{color: 'green'}}>Running Count </span>: <span>Male - {mCount}</span><span style={{marginLeft: '10px'}}>Female - {fCount}</span>
        </div>
        </Row>
        </Col>
        <div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Name : {selectedEmployeeData.name}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        DOJ : {selectedEmployeeData.joinedDate}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Gender : {selectedEmployeeData.gender}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Village : {selectedEmployeeData.village}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Address : {selectedEmployeeData.address}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Payment Mode: {selectedEmployeeData.paymentType}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        No of persons : {selectedEmployeeData.numberOfPersons}
        </div>
        <div style={{height: '2px'}}>
        </div>
        <div style={{width:'350px', backgroundColor: '#F5F5F5'}}>
        Remarks : {selectedEmployeeData.remarks}
        </div>
        </div>

        </Row>
        </Container>
        </div>
      )
    }
  }

  onSelectZone(area) {
    this.setState({
      selectedZone: area.name
    }, this.getCount())
  }

  updateAssignedZone() {
    const { selectedZone, selectedEmployeeId, selectedEmployeeData } = this.state;
    const workLocation = selectedZone.name;
    const gender = selectedEmployeeData.gender;
    updateWorkLocation({
      workLocation,
      selectedEmployeeData,
      selectedEmployeeId,
      gender
    }).then(() => {
      this.setState({
        toastMsg: `Success! Assigned ${selectedEmployeeData.name} to "${selectedZone.name}"`,
        selectedZone: null
      })
    }).catch((e) => console.log(e))
  }

  onAssignZone(selectedZone) {
    this.setState({
      selectedZone
    }, this.updateAssignedZone.bind(this))
  }


    toastClose() {
      this.setState({ toastMsg: '' });
    }

  renderToastMsg() {
    const { toastMsg } = this.state;
    if(toastMsg) {
      return (
        <Toast status='ok'
          onClose={ this.toastClose.bind(this) }>
          { toastMsg }
        </Toast>
      );
    }
    return null;
  }

  render() {
    const { selectedEmployeeData, workplacesArr } = this.state;

    return (
      <div>
      <div style={{marginTop : '10px', marginLeft :'30px'}}>
      { this.renderEmployeeSearch() }
      </div>
      { this.renderSearchedEmployee() }
      { selectedEmployeeData ? <Map onClick={this.onSelectZone.bind(this)} onSubmit={this.onAssignZone.bind(this)} /> : null }
      { this.renderToastMsg() }
      </div>
    )
  }
}
