import React, { Component } from 'react';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import Search from 'grommet/components/Search';
import moment from 'moment';
import { getShifts, getVillages } from '../api/configuration';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop,
  getEmployeeAttendanceDates,
  saveEmailReport,
  savePrintCopiesData,
  fetchPrintCopiesData } from '../api/attendance';
import Button from 'grommet/components/Button';
import Label from 'grommet/components/Label';


const UnitText = () => {
  return (
    <Label style={{color:'red'}}>Select Unit</Label>
  )
}

const FromDate = () => {
  return (
    <Label style={{color:'red'}}>From Date</Label>
  )
}

const ToDate = () => {
  return (
    <Label style={{color:'red'}}>To Date</Label>
  )
}


export default class InputForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      unit: '',
      startDate: '',
      endDate: '',
      paymentType: '',
      shift: '',
      gender: '',
      village: '',
      shiftOpt: [],
      villageOpt: [],
    };
  }

  componentDidMount() {
     this.getEmployees();
     this.getShifts();
     this.getVillageDetails();
  }

  sort(arr){
      arr.sort(function(a , b){
          let A = a.label || "";
          let B = b.label || "";
          if(A < B)
              return -1;
          else if (A > B)
              return 1;
          else {
              return 0;
          }
      })
      return arr;
  }

  getEmployees() {
    getEmployees()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        let suggests = [];
        Object.keys(data).forEach((employee) => {
          if(employee !== 'count')
          suggests.push({
             label : data[employee].name,
             employeeId : employee
          })
        })
        this.setState({
          employeeSuggestions: this.sort(suggests),
          filteredSuggestions: this.sort(suggests),
          allEmployees : data
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
  }

  getShifts() {
    getShifts().then((snap) => {
      const shiftOptions = snap.val();
      let shiftOpt = ['-EMPTY-'];
      Object.keys(shiftOptions).forEach((opt) => {
        shiftOpt.push(opt)
      })
      this.setState({shiftOpt})
    }).catch((e) => console.log(e))
  }

  getVillageDetails() {
    getVillages().then((snap) => {
      const villageOptions = snap.val();
      let villageOpt = ['-EMPTY-'];
      Object.keys(villageOptions).forEach((opt) => {
        villageOpt.push(opt)
      })
      this.setState({villageOpt})
    }).catch((e) => console.log(e))
  }


  onUnitFieldChange(fieldName, e) {
    this.setState({
      [fieldName] : e.option,
    }, this.props.onUnitSelected(e.option))
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
      this.setState({startDate}, this.props.onStartDateSelected(startDate))
    } else {
      this.setState({startDate}, this.props.onStartDateSelected(startDate))
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

    this.setState({endDate}, this.props.onEndDateSelected(endDate, dateRange))
  }

  onPaymentFieldChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
      }, this.props.onPaymentSelected(e.option))
    } else {
      this.setState({
        [fieldName] : e.option,
      }, this.props.onPaymentSelected(e.option))
    }
  }

  onShiftFieldChange(fieldName, e) {

    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
      }, this.props.onShiftSelected(e.option))
    } else {
    this.setState({
      [fieldName]: e.option,
    }, this.props.onShiftSelected(e.option))
  }
}

onGenderFieldChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
      }, this.props.onGenderSelected(e.option))
    } else {
    this.setState({
      [fieldName]: e.option,
    }, this.props.onGenderSelected(e.option))
  }
}

onVillageFieldChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
      }, this.props.onVillageSelected(e.option))
    } else {
    this.setState({
      [fieldName]: e.option,
    }, this.props.onVillageSelected(e.option))
  }
}

onSearchEntry(e) {
  let filtered = [];
  let  options  = this.state.employeeSuggestions;
  let exactMatch = false;

  if(!options)
    return ;

  if(e.target.value == '') {
    filtered = options
    this.setState({
    selectedEmployeeId : null,
    employeeSelected : false,
    selectedEmployeeData : null
  })
  }
  else {
    for(let i = 0; i < options.length; i++) {
      let opt = options[i];
      if(opt.label && opt.label.toUpperCase().startsWith(e.target.value.toUpperCase())) {
        filtered.push(opt)
      } else if(opt.employeeId && opt.employeeId.toUpperCase().startsWith(e.target.value.toUpperCase())) {
        filtered.push(opt);
        if(opt.employeeId.toUpperCase() == e.target.value.toUpperCase())
          exactMatch = true;
      }
    }
  }
  this.setState({
    employeeSearchString: e.target.value,
    filteredSuggestions: filtered
  }, () => {
    if(filtered.length == 1 && exactMatch) {
      let data = {};
      data.suggestion = filtered[0];
      this.onEmployeeSelect(data, true, false);
    }
  });
}

fetchSearchedEmployee() {
  const { selectedEmployeeId, employeeSelected } = this.state;
  getEmployeeAttendanceDates(selectedEmployeeId).then((snap) => {
    const selectedEmployeeData = snap.val();
    this.props.onEmployeeSelected(employeeSelected, selectedEmployeeId, selectedEmployeeData);
  }).catch((e) => console.log(e))
}

onEmployeeSelect(data, isSuggestionSelected) {
  if(isSuggestionSelected) {
    this.setState({
      selectedEmployeeId: data.suggestion.employeeId,
      employeeSearchString: data.suggestion.label,
      employeeSelected: true
    }, this.fetchSearchedEmployee.bind(this));
  } else {
    this.setState({
      selectedEmployeeId: data.target.value,
      employeeSearchString: data.suggestion,
      employeeSelected: true
    }, this.fetchSearchedEmployee.bind(this));
  }
}


  render() {
    const { refreshData } = this.props;

    return (
      <div style={{marginLeft:'20px', backgroundColor: '#F5F5F5', height: 300, display : 'flex', flexDirection : 'row'}}>
      <div style={{display : 'flex', flexDirection : 'column'}} >
      <div style={{width: 300}}>
      <FormField label={<UnitText/>} style={{marginTop:20}}>
        <Select
          placeHolder='Select UNIT'
          options={['UNIT1','UNIT2','UNIT3','UNIT4', ]}
          value={this.state.unit}
          onChange={this.onUnitFieldChange.bind(this, 'unit')}
        />
      </FormField>
      </div>

      <div style={{width: 300}}>
      <FormField label={<FromDate />} style={{marginTop:15}}>

      <DateTime id='id'
      format='D/M/YYYY'
      name='name'
      onChange={this.onStartDateChange.bind(this)}
      value={this.state.startDate}
      />
      </FormField>
      </div>

      <div style={{width: 300}}>
      <FormField label={<ToDate/>} style={{marginTop:15}}>

      <DateTime id='id'
      format='D/M/YYYY'
      name='name'
      onChange={this.onEndDateChange.bind(this)}
      value={this.state.endDate}
      />
      </FormField>
      </div>
      </div>

      <div style={{display : 'flex', flexDirection : 'column',marginLeft: '20px'}} >
          <div style={{width: 300}}>
          <FormField label='Select Payment Type' style={{marginTop:20}}>

            <Select
              placeHolder='Payment Type'
              options={['-EMPTY-', 'Daily payment', 'Weekly payment', 'Jattu-Daily payment']}
              value={this.state.paymentType}
              onChange={this.onPaymentFieldChange.bind(this, 'paymentType')}
            />
          </FormField>
          </div>
          <div style={{width: 300}}>
          <FormField label='Select Shift' style={{marginTop:15}}>
              <Select
                placeHolder='Shift'
                options={this.state.shiftOpt}
                value={this.state.shift}
                onChange={this.onShiftFieldChange.bind(this, 'shift')}
              />
          </FormField>
          </div>
          <div style={{width: 300}}>
          <FormField label='Select Gender' style={{marginTop:15}}>
              <Select
                placeHolder='Gender'
                options={['-EMPTY-', 'Male', 'Female']}
                value={this.state.gender}
                onChange={this.onGenderFieldChange.bind(this, 'gender')}
              />
          </FormField>
          </div>
          </div>
          <div style={{display : 'flex', flexDirection : 'column', marginTop: 20, marginLeft: '20px'}} >
          <div style={{width: 300}}>
          <FormField label='Select Village' style={{marginLeft:20}}>
              <Select
                placeHolder='Village'
                options={this.state.villageOpt}
                value={this.state.village}
                onChange={this.onVillageFieldChange.bind(this, 'village')}
              />
          </FormField>
          </div>
          <div style={{marginLeft: 20, marginTop: 15}}>
          <Search placeHolder='Search By Name or Barcode' style={{width:'300px'}}
            inline={true}
            iconAlign='start'
            size='small'
            suggestions={this.state.filteredSuggestions}
            onSelect={this.onEmployeeSelect.bind(this)}
            value={this.state.employeeSearchString}
            onDOMChange={this.onSearchEntry.bind(this)} />
            <Button  label='Show Detailed Report'
            onClick={this.props.onShowReport}
            style={{ display : 'inline-block' , marginTop : '20px', width:'300px'}}
            primary={true}
            href='#'/>
            {this.props.showAbstractButton ?
            <Button label='Show Abstract Report'
            onClick={this.props.onAbstractButtonClick}
            primary={true} style={{ display : 'inline-block' , marginTop : '20px', width:'300px'}}
            href='#'/> : null}
          </div>
          </div>
      </div>
    )
  }
}
