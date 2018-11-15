import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop, getEmployeeAttendanceDates, saveEmailReport, savePrintCopiesData, fetchPrintCopiesData } from '../api/attendance';
import { getVillages } from '../api/configuration';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import DateTime from 'grommet/components/DateTime';
import moment from 'moment';
import * as firebase from 'firebase';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import NavControl from '../components/NavControl';
import { getMessage } from 'grommet/utils/Intl';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Notification from 'grommet/components/Notification';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import TextInput from 'grommet/components/TextInput';
import Layer from 'grommet/components/Layer';
import Split from 'grommet/components/Split';
import Section from 'grommet/components/Section';
import Label from 'grommet/components/Label';
import Workbook from 'react-excel-workbook';
import DownloadIcon from 'grommet/components/icons/base/Download';
import PrintIcon from 'grommet/components/icons/base/Print';
import BookIcon from 'grommet/components/icons/base/Book';
import Button from 'grommet/components/Button';
import { Container, Row, Col } from 'react-grid-system';
import { getShifts } from '../api/configuration';
import { Print } from 'react-easy-print';
import axios from 'axios';
import { RingLoader } from 'react-spinners';

const uniqid = require('uniqid');

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

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate : null,
      endDate: null,
      unit: null,
      paymentType: '',
      shift: '',
      printTableSelected: false,
      numPages: null,
      pageNumber: 1,
      emailReport: false,
      loading: false,
    }
  }

  componentDidMount() {
     this.getEmployees()
     this.getShifts()
     this.getVillageDetails()
  }

  getPrintCopiesData() {
    const { dateRange } = this.state;
    fetchPrintCopiesData(dateRange).then((snap) => {
      let printData = snap.val();
      this.setState({printData})
    }).catch((err) => console.log(err))
  }

  getVillageDetails() {
    getVillages().then((snap) => {
      const villageOptions = snap.val();
      let villageOpt = ['-EMPTY-'];
      Object.keys(villageOptions).forEach((opt) => {
        villageOpt.push(opt)
      })
      this.setState({
        villageOpt
      })
    }).catch((e) => console.log(e))
  }

  getShifts() {
    getShifts().then((snap) => {
      const shiftOptions = snap.val();
      let shiftOpt = ['-EMPTY-'];
      Object.keys(shiftOptions).forEach((opt) => {
        shiftOpt.push(opt)
      })
      this.setState({
        shiftOpt
      })
    }).catch((e) => console.log(e))
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
    const { startDate, endDate, unit } = this.state;

    if(!unit) {
      this.setState({
        validationMsg: 'UNIT is Missing'
      })
      return
    }

    if(!startDate) {
      this.setState({
        validationMsg: 'From Date is Missing'
      })
      return
    }

    if(!endDate) {
      this.setState({
        validationMsg: 'To Date is Missing'
      })
      return
    }

    this.setState({
      validationMsg:'',
      loading: true
    }, this.attendanceDatesLoop.bind(this))
  }


  attendanceDatesLoop() {
    const { startDate, endDate, unit, allEmployees } = this.state;

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
    let unitVal;
    if(unit == 'UNIT2') {
      unitVal= ''
    } else {
      unitVal = unit;
    }
    const dbRef = firebase.database().ref(`${unitVal}/attendance/`);
    Promise.all(
      datesArr.map((date) => {
        return dbRef.child('dates').child(date).once('value').then((snapshot) => {
          let response = snapshot.val();
          returnObj[date] = response;

        })
      })
    ).then(() => {
      let employeeVsDate = {};
      Object.keys(returnObj).map((date,index) => {
            let attObj = returnObj[date];
            if(attObj) {
            Object.keys(attObj).map((empId, k) => {
              let existingData  = employeeVsDate[empId] || [];
              let newData = {
                date : date,
                value : attObj[empId]
              }
              existingData.push(newData);
              employeeVsDate[empId] = existingData;
            })
          } else {
            this.setState({
              noDataMsg : 'No Data Existed',
              loading: false
            })
          }
        });
        this.setState({
            response: returnObj,
            employeeVsDate,
            loading: false
          });
    })

  }

  onUnitFieldChange(fieldName, e) {
    this.setState({
      [fieldName] : e.option,
      response: null,
      validationMsg: ''
    })
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
      this.setState({
        response: null
      })
    } else {
      this.setState({
        startDate,
        startDateWithSlash : e,
        response : null,
        validationMsg: ''
      })
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


    this.setState({endDate, response : null, dateRange, validationMsg: ''}, this.getPrintCopiesData.bind(this))
  }

  onPaymentFieldChange(fieldName, e) {

    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
        paymentTypeSelected: false
      })
    } else {
      this.setState({
        [fieldName] : e.option,
        paymentTypeSelected: true
      })
    }
  }

  onShiftFieldChange(fieldName, e) {

    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
        shiftSelected: false
      })
    } else {
    this.setState({
      [fieldName]: e.option,
      shiftSelected: true
    })
  }
}

onGenderFieldChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
        genderSelected: false
      })
    } else {
    this.setState({
      [fieldName]: e.option,
      genderSelected: true
    })
  }
}

onVillageFieldChange(fieldName, e) {
    if(e.option == '-EMPTY-') {
      this.setState({
        [fieldName] : e.option,
        villageSelected: false
      })
    } else {
    this.setState({
      [fieldName]: e.option,
      villageSelected: true
    })
  }
}

clearSelection(e) {
    e.preventDefault();
    this.setState({
      unit : null,
      endDate : null ,
      startDate : null,
      paymentTypeSelected : false,
      villageSelected : false,
      genderSelected : false,
      gender: '-EMPTY-',
      shift : '-EMPTY-',
      paymentType : '-EMPTY-',
      response : null
     })
  }

renderInputFields() {

  const { shiftOpt, villageOpt, unit, startDate, endDate, response } = this.state;
  let showClearButton = ((unit || startDate || endDate ) && (response !=null ))|| false;
  let showReportButton = false ;
  if(unit && startDate && endDate)
    showReportButton = true;

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
              options={shiftOpt}
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
        { this.searchField() }
        <Button  label='SHOW REPORT'
        onClick={this.onValidatingInputs.bind(this)}
        style={{ display : 'inline-block' , marginLeft: '20px', marginTop : '40px'}}
        primary={true}
        href='#'/>

        </div>
    </div>
  )
}

  attendancePrintTableData() {
    const { dateRange, printData } = this.state;
    savePrintCopiesData(dateRange, printData).then(() => {
      this.setState({
        attendancePrintSelected: true
      })
    }).catch((e) => console.log(e));
  }

  datewisePrintTableData() {
    this.setState({
      datewisePrintSelected: true
    })
  }

  setTimeoutFunc() {
    setTimeout(() => window.print(), 5000)
  }

  attendancePrint() {
    if(this.state.attendancePrintSelected) {
      this.setState({
        attendancePrintSelected: false
      }, this.setTimeoutFunc())
    }
  }

  datewisePrint() {
    if(this.state.datewisePrintSelected) {
      this.setState({
        datewisePrintSelected: false
      }, this.setTimeoutFunc())
    }
  }


  renderPDFDoc(reportData){

    let employeeVsDate = {};
    Object.keys(reportData).map((date,index) => {
        let attObj = reportData[date];
        Object.keys(attObj).map((empId, k) => {
          let existingData  = employeeVsDate[empId] || [];
          let newData = {
            [date] :  attObj[empId]
          }
          existingData.push(newData);
          employeeVsDate[empId] = existingData;
        })
    })

    let id = 0;
    let attendanceDataForAllEmployee = [];        let attendanceDataForEachEmployee = [];
    Object.keys(employeeVsDate).map(empId => {
        let allDates = employeeVsDate[empId];id=0;
        attendanceDataForEachEmployee = [];
        attendanceDataForEachEmployee.push(
          <View break key={empId}>
          <Text break>Employee ID = {empId}</Text>
          <Text>Date         In Time        Out Time</Text>
          </View>
        )
        allDates.map(eachDateObject => {
          id=id+1;
          Object.keys(eachDateObject).map(date => {
              let   dataForThatDate = eachDateObject[date];
          attendanceDataForEachEmployee.push(
            <Text key= { empId + date }>{date || 'NONE'}        {dataForThatDate['in'] || 'NONE'}       {dataForThatDate['out'] || 'NONE'}</Text>
          )
          })
        })
        // attendanceDataForAllEmployee.push(<View break>)
        attendanceDataForAllEmployee.push(attendanceDataForEachEmployee);
        // attendanceDataForAllEmployee.push(</View>)

    });

    return (
                <Document shallow >
                  <Page wrap>
                    <View>
                      {attendanceDataForAllEmployee}
                    </View>
                  </Page>
                </Document>
              );
  }

  makecall()  {

    let headers = {
                  'Content-Type': 'application/json',
                  'crossDomain' : true,
                  'withCredentials' : true
              };

    let data = {
          "username":"admin",
          "password":"viperv"
      }

    axios.post('http://sakshi.myofficestation.com/user_login/user/login', data, { headers: headers }).
      then( r => console.log(r)).
      catch(e => console.log(e))
  }

  onEmailReportClick() {
    this.setState({
      emailReport: true
    })
  }

  onAbstractClick(data) {
    this.setState({
      showAbstractTable: true,
      dailyMaleDayShift: data.dailyMaleDayShift || 0,
      dailyMaleNightShift: data.dailyMaleNightShift || 0,
      dailyFemaleDayShift: data.dailyFemaleDayShift || 0,
      dailyFemaleNightShift: data.dailyFemaleNightShift || 0,
      weeklyMaleDayShift: data.weeklyMaleDayShift || 0,
      weeklyMaleNightShift: data.weeklyMaleNightShift || 0,
      weeklyFemaleDayShift: data.weeklyFemaleDayShift || 0,
      weeklyFemaleNightShift: data.weeklyFemaleNightShift || 0
    })
  }


  onFieldChange(fieldName, e) {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  onSavingEmailReport() {
    const { email, startDate, endDate } = this.state;
    const date = new Date();
    const epochTime = date.getTime();

    let datesArr=[];
    let startDateParts = startDate.split("-");
    let endDateParts = endDate.split("-");
    let startDateObj = new Date(startDateParts[2], startDateParts[1]-1, startDateParts[0]);
    let endDateObj = new Date(endDateParts[2], endDateParts[1]-1, endDateParts[0]);

    while (startDateObj <= endDateObj) {
    datesArr.push(moment(startDateObj).format('DD-MM-YYYY'));
    startDateObj.setDate(startDateObj.getDate() + 1);
    }

    saveEmailReport({
      email,
      epochTime,
      datesArr
    }).then(() => {
      this.setState({
        emailReport: false
      })
    }).catch((e) => console.log(e));
  }

  onCloseLayer() {
    this.setState({
      showAbstractTable: false
    })
  }

  renderAbstractTable() {
    const { showAbstractTable,
            dailyMaleDayShift,
            dailyMaleNightShift,
            dailyFemaleDayShift,
            dailyFemaleNightShift,
            weeklyMaleDayShift,
            weeklyMaleNightShift,
            weeklyFemaleDayShift,
            weeklyFemaleNightShift } = this.state;


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
    let grandTotal = dayGrandTotal + nightGrandTotal;

    if(showAbstractTable) {
      return (
        <Layer closer={true}
          flush={false}
          onClose={this.onCloseLayer.bind(this)}>
          <div style={{width:1000, marginTop: 20, marginLeft: 'auto', marginRight: 'auto'}}>
          <Table scrollable={true}>
              <thead>
               <tr>
                 <th></th>
                 <th>Day Shift</th>
                 <th>Night Shift</th>
                 <th>Day Total</th>

               </tr>
              </thead>
              <tbody>
                <TableRow>
                    <td>Weekly Male</td>
                    <td>{weeklyMaleDayShift}</td>
                    <td>{weeklyMaleNightShift}</td>
                    <td>{weeklyMaleTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Weekly Female</td>
                    <td>{weeklyFemaleDayShift}</td>
                    <td>{weeklyFemaleNightShift}</td>
                    <td>{weeklyFemaleTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Sub Total</td>
                    <td>{weeklyDaySubTotal}</td>
                    <td>{weeklyNightSubTotal}</td>
                    <td>{weeklySubTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Daily Male</td>
                    <td>{dailyMaleDayShift}</td>
                    <td>{dailyMaleNightShift}</td>
                    <td>{dailyMaleTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Daily Female</td>
                    <td>{dailyFemaleDayShift}</td>
                    <td>{dailyFemaleNightShift}</td>
                    <td>{dailyFemaleTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Sub Total</td>
                    <td>{dailyDaySubTotal}</td>
                    <td>{dailyNightSubTotal}</td>
                    <td>{dailySubTotal}</td>
                </TableRow>
                <TableRow>
                    <td>Grand Total</td>
                    <td>{dayGrandTotal}</td>
                    <td>{nightGrandTotal}</td>
                    <td>{grandTotal}</td>
                </TableRow>
              </tbody>
          </Table>
          </div>
        </Layer>
      )
    } else {
      return
    }
  }

  emailReportDialog() {
    const {emailReport} = this.state;
    if(emailReport) {
      return (
        <Layer closer={true}
          flush={false}
          onClose={this.onCloseLayer.bind(this)}>
          <Form>
          <p>Enter Email</p>
          <FormField  label='Email'  strong={true} style={{marginTop : '15px', width:'320px'}}  >
          <TextInput
              placeHolder='Email'
              value={this.state.email}
              onDOMChange={this.onFieldChange.bind(this, 'email')} />
          </FormField>
          </Form>
        <Row>
        <Button label='Add'
        primary={true} style={{marginTop: '20px', marginLeft: '400px', marginBottom: '10px'}}
        href='#' onClick={this.onSavingEmailReport.bind(this)}/>
        </Row>
        </Layer>
      )
    } else {
      return
    }

  }


  showOldEmployeeReportsTable() {

   const { response,
           startDate,
           endDate,
           paymentType,
           shift,
           shiftSelected,
           paymentTypeSelected,
           allEmployees,
           gender,
           village,
           genderSelected,
           villageSelected,
           employeeSelected,
           selectedEmployeeId } = this.state;


   if(!response)
   return null;

   //const pdfDoc = this.renderPDFDoc(response);

   let tablesArray = [];
   let reportData = [];
   let returnObj = {};

   let i = 0;

   let dailyMaleDayShift = 0;
   let dailyMaleNightShift = 0;
   let dailyFemaleDayShift = 0;
   let dailyFemaleNightShift = 0;
   let weeklyMaleDayShift = 0;
   let weeklyMaleNightShift = 0;
   let weeklyFemaleDayShift = 0;
   let weeklyFemaleNightShift = 0;

   Object.keys(response).map((date, index) => {
     const attendanceObj = response[date];
     if(attendanceObj ==null)
       return;
     tablesArray.push(<div className='tablesArray' key={index}>
          <h1 style={{marginLeft: 30, marginTop:40}}>{date}</h1>
          <Table scrollable={true} style={{ marginLeft : '30px'}}>
         <thead style={{position:'relative'}}>
          <tr>
            <th>S No.</th>
            <th>Manpower Id</th>
            <th>Name</th>
            <th>Payment Type</th>
            <th>Shift</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Total Time Spent</th>
          </tr>
         </thead>
         <tbody>
           {
               Object.keys(attendanceObj).map((key,index)=> {
                 let empAttObj = allEmployees[key];
                 const employeeAttendaceObj = attendanceObj[key];
                 if(employeeAttendaceObj !== null){
                 let inTime = employeeAttendaceObj.in;
                 let outTime = employeeAttendaceObj.shift == 'Night Shift' ? employeeAttendaceObj.tomorrowsOutTime : employeeAttendaceObj.out;
                 let totalTime = 'N/A';

                 if(employeeAttendaceObj.shift === 'Night Shift' ) {
                   let inT = moment(key)
                 }

                 if(outTime && inTime) {
                   let startTime = moment(inTime, "HH:mm a");
                   let endTime=moment(outTime, "HH:mm a");
                   let duration = moment.duration(endTime.diff(startTime));

                   let hours = 0, minutes =0;
                   if(duration.asMilliseconds() < 0) {
                    let dMillis = duration.asMilliseconds();
                    let bufferedMillis = dMillis + (24 * 60 * 60 * 1000);
                    let bufferedSeconds = bufferedMillis / 1000;
                     hours = Math.floor(bufferedSeconds / 3600);
                    let remainingSeconds = bufferedSeconds % 3600 ;
                     minutes = remainingSeconds / 60;
                    }else {
                     hours = parseInt(duration.asHours());
                     minutes = parseInt(duration.asMinutes())%60;
                    }

                    totalTime = hours + ' hr ' + minutes + ' min '
                 }

                 let istInTime =  moment.utc(inTime).local().format('YYYY-MM-DD HH:mm:ss');
                 let istOutTime =  '--'
                 if(outTime !== 'N/A')
                   istOutTime=moment.utc(outTime).local().format('YYYY-MM-DD HH:mm:ss');
                 let isValid = true;

                 if(paymentTypeSelected && paymentType !== employeeAttendaceObj.paymentType) {
                   isValid = false;
                 }

                 if(shiftSelected && shift !== employeeAttendaceObj.shift) {
                   isValid = false;
                 }

                 if(genderSelected && gender !== allEmployees[key]['gender'] ) {
                   isValid = false;
                 }

                 if(villageSelected && village !== allEmployees[key]['village'] ) {
                   isValid = false;
                 }

                 if(employeeSelected && selectedEmployeeId !== key ) {
                   isValid = false;
                 }

                 if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Day Shift') {
                   dailyMaleDayShift += 1
                }

                if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Night Shift') {
                  dailyMaleNightShift += 1
               }

               if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Day Shift') {
                 dailyFemaleDayShift += 1
              }

              if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Night Shift') {
                dailyFemaleNightShift += 1
             }

             if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Day Shift') {
               weeklyMaleDayShift += 1
            }
            if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && empAttObj.shift === 'Night Shift') {
              weeklyMaleNightShift += 1
           }
           if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Day Shift') {
             weeklyFemaleDayShift += 1
          }
          if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && empAttObj.shift === 'Night Shift') {
            weeklyFemaleNightShift += 1
         }


                   if(isValid && inTime) {

                    i++;
                    reportData.push({
                      serialNo : index + 1,
                      manpowerId : key,
                      name :  employeeAttendaceObj.name,
                      numberOfPersons : employeeAttendaceObj.numberOfPersons,
                      shift : employeeAttendaceObj.shift,
                      inTime : istInTime,
                      outTime : istOutTime,
                      totalTime : totalTime
                    })
                    return <TableRow key={key} style={employeeAttendaceObj.paymentType == 'Daily payment' ?
                    {backgroundColor : '#C6D2E3'} : employeeAttendaceObj.paymentType == 'Jattu-Daily payment' ?
                    {backgroundColor: '#eeeeee'}: employeeAttendaceObj.paymentType == 'Weekly payment' ?
                    {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>

                    <td>{i}</td>
                    <td>{key}</td>
                    <td>{employeeAttendaceObj.name}</td>
                    <td>{employeeAttendaceObj.paymentType}</td>
                    <td>{employeeAttendaceObj.shift}</td>
                    <td>{employeeAttendaceObj.in}</td>
                    <td>{outTime}</td>
                    <td>{totalTime}</td>
                    </TableRow>
                  }
             }
             })
           }
         </tbody>
     </Table>

     </div>)
   })
   let ob = [{
     start : startDate,
     end : endDate
   }]
   return (
    <div>
     <div style={{marginTop:'40px', marginLeft:'40px'}}>
      {
        /*
       <Workbook  filename="report.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '10px', marginRight: '15px', marginTop : '20px'}}  primary={true} icon={<DownloadIcon />}  href="#" label="Excel Report" />}>
         <Workbook.Sheet data={reportData} name="Sheet 1">
             <Workbook.Column label="Serial No" value="serialNo"/>
             <Workbook.Column label="MPId" value="serialNo"/>
             <Workbook.Column label="Name" value="name"/>
             <Workbook.Column label="Number Of Persons" value="numberOfPersons"/>
             <Workbook.Column label="Shift" value="shift"/>
             <Workbook.Column label="In Time" value="inTime"/>
             <Workbook.Column label="Out Time" value="outTime"/>
             <Workbook.Column label="Total Time" value="totalTime"/>
         </Workbook.Sheet>
         <Workbook.Sheet  data={ob} name="Information">
             <Workbook.Column label="Start Date" value="start"/>
             <Workbook.Column label="End Date" value="end"/>
         </Workbook.Sheet>
       </Workbook>
       */
      }
       <Button icon={<BookIcon />} label='Abstract Table' fill={true}
       onClick={this.onAbstractClick.bind(this, {
         dailyMaleDayShift,
         dailyMaleNightShift,
         dailyFemaleDayShift,
         dailyFemaleNightShift,
         weeklyMaleDayShift,
         weeklyMaleNightShift,
         weeklyFemaleDayShift,
         weeklyFemaleNightShift
       })}
       primary={true} style={{marginRight: '13px'}}
       href='#'/>
     </div>
     <div  style={{marginBottom: 40}}>
      {tablesArray}
     </div>
     </div>
   )
 }

 printPdf() {
     if(this.state.attendancePrintSelected) {
       const { response,
               paymentTypeSelected,
               shiftSelected,
               paymentType,
               shift,
               startDate,
               endDate,
               unit,
               employeeVsDate,
               allEmployees,
               printData } = this.state;

       let tablesObj = this.getTablesArray(true);
       if(!tablesObj)
        return (<h2 style={{marginTop : '20px', marginLeft : '20px'}}>No data to show</h2>);
       else {
         return(
           <Print name='bizCard' exclusive>
              <div>
                <div style={{display: 'flex', justifyContent: 'center', marginBottom:20}}>
                  <h4>Copy: </h4><strong>{printData ? <h4>Duplicate</h4> : <h4>Original</h4>}</strong>
                </div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  <h4><strong>Attendance Slip From : {startDate} To: {endDate}, Unit: {unit}</strong></h4>
                </div>
                <div>
                  {tablesObj['tablesArray']}
                </div>
              </div>
           </Print>
         );
       }
   }
 }

 printAttendanceSlipPdf() {
   if(this.state.printTableSelected) {
     const { response, paymentTypeSelected, shiftSelected, paymentType, shift, startDate, endDate, employeeVsDate, allEmployees } = this.state;
     let tablesArr = this.showOldEmployeeReportsTable();

   return(
     <Print name='bizCard' exclusive>
        <div>
          <div style={{height:'1120px'}}>
            <h3>Man power report from {startDate} to {endDate}</h3>
            <h3 style={{fontWeight:'bold'}}>{paymentType}, {shift}</h3>
          </div>
          <div>
          {tablesArr}
          </div>
        </div>
     </Print>
   );
 }
 }

 getTablesArray(isPrint) {
   const { response,
           startDate,
           endDate,
           paymentType,
           shift,
           gender,
           village,
           shiftSelected,
           paymentTypeSelected,
           genderSelected,
           villageSelected,
           employeeVsDate,
           allEmployees,
           employeeSelected,
           selectedEmployeeId, unit } = this.state;

   if(!response)
   return null;

   //const pdfDoc = this.renderPDFDoc(response);

   let tablesArray = [];
   let reportData = [];
   let returnObj = {};
   let idVsName = [];

   Object.keys(employeeVsDate).map((empId) => {
     idVsName.push({'id' : empId,
             'name' : allEmployees[empId]['name']
           });
   })


   idVsName.sort((a,b) => {
     let A = a.name || "";
     let B = b.name || "";
     if(A < B)
         return -1;
     else if (A > B)
         return 1;
     else {
         return 0;
     }
   })

   let dailyMaleDayShift = 0;
   let dailyMaleNightShift = 0;
   let dailyFemaleDayShift = 0;
   let dailyFemaleNightShift = 0;
   let weeklyMaleDayShift = 0;
   let weeklyMaleNightShift = 0;
   let weeklyFemaleDayShift = 0;
   let weeklyFemaleNightShift = 0;
   let iterator = 0;


   idVsName.map((idNameObj, index) => {
     let employeeId = idNameObj['id'];

     const attendanceObjArray = employeeVsDate[employeeId];
     let empAttObj = allEmployees[employeeId];
     if(attendanceObjArray ==null)
       return;
       let i = 0;


       let isValid = true;



     let uniqId = uniqid();
     let totalNumberOfdays = 0;
     attendanceObjArray.map((dateObject,index)=> {
       const employeeAttendaceObj = dateObject['value'];
       if(employeeAttendaceObj !== null){
       let inTime = employeeAttendaceObj.in;
       let outTime = employeeAttendaceObj.shift == 'Night Shift' ? employeeAttendaceObj.tomorrowsOutTime : employeeAttendaceObj.out;
       if(inTime && outTime)
        totalNumberOfdays++;
     }

     if(paymentTypeSelected && paymentType !== empAttObj.paymentType) {
       isValid = false;
     }

     if(shiftSelected && shift !== employeeAttendaceObj.shift) {
       isValid = false;
     }

         if(genderSelected && gender !== allEmployees[employeeId]['gender'] ) {
           isValid = false;
         }

         if(villageSelected && village !== allEmployees[employeeId]['village'] ) {
           isValid = false;
         }

         if(employeeSelected && selectedEmployeeId !== employeeId ) {
           isValid = false;
         }

         if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && employeeAttendaceObj.shift === 'Day Shift') {
           dailyMaleDayShift += 1
        }

        if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Male' && employeeAttendaceObj.shift === 'Night Shift') {
          dailyMaleNightShift += 1
       }

       if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && employeeAttendaceObj.shift === 'Day Shift') {
         dailyFemaleDayShift += 1
      }

      if(empAttObj.paymentType === 'Daily payment' && empAttObj.gender === 'Female' && employeeAttendaceObj.shift === 'Night Shift') {
        dailyFemaleNightShift += 1
     }

       if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && employeeAttendaceObj.shift === 'Day Shift') {
         weeklyMaleDayShift += 1
      }
      if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Male' && employeeAttendaceObj.shift === 'Night Shift') {
        weeklyMaleNightShift += 1
     }
     if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && employeeAttendaceObj.shift === 'Day Shift') {
       weeklyFemaleDayShift += 1
    }
    if(empAttObj.paymentType === 'Weekly payment' && empAttObj.gender === 'Female' && employeeAttendaceObj.shift === 'Night Shift') {
      weeklyFemaleNightShift += 1
    }

     });

     if(!isValid) {
       return
     }

     let top = iterator * 16.4;
     let topStr = top + 'in'
     iterator++;




     tablesArray.push(<div className='' key={uniqId} style={isPrint ? {position: 'absolute' , top: topStr , width: '11.0in'} : {}}>
     <h3 style={{marginLeft : '20px'}}>{allEmployees[employeeId]['name']} ; {employeeId} ; {allEmployees[employeeId]['paymentType']} ; {allEmployees[employeeId]['gender']} ; {allEmployees[employeeId]['village']} ; {unit} </h3>
     <h5 style={{marginLeft : '20px'}}>Total no of days = {totalNumberOfdays} </h5>
     <Table scrollable={true} style={isPrint ? {} :  { marginTop : '30px', marginLeft : '30px'}}>
         <thead style={{position:'relative'}}>
          <tr>
            <th>S No.</th>
            <th>Date</th>
            <th>Shift</th>
            <th>In Time</th>
            <th>Out Time</th>
            <th>Total Time Spent</th>
          </tr>
         </thead>
         <tbody>
           {

               attendanceObjArray.map((dateObject,index)=> {
                 let totalNumberOfdays = 0;
                 const dateVal = dateObject['date']
                 const employeeAttendaceObj = dateObject['value'];
                 if(employeeAttendaceObj !== null){
                 let inTime = employeeAttendaceObj.in;
                 let outTime = employeeAttendaceObj.shift == 'Night Shift' ? employeeAttendaceObj.tomorrowsOutTime : employeeAttendaceObj.out;
                 let totalTime = 'N/A';


             //    if(employeeAttendaceObj.shift === 'Night Shift' ) {
               //    let inT = moment(dateVal)
             //    }

               if(outTime && inTime) {
                 totalNumberOfdays++;
                 let startTime = moment(inTime, "HH:mm a");
                 let endTime=moment(outTime, "HH:mm a");
                 let duration = moment.duration(endTime.diff(startTime));

                 let hours = 0, minutes =0;
                 if(duration.asMilliseconds() < 0) {
                  let dMillis = duration.asMilliseconds();
                  let bufferedMillis = dMillis + (24 * 60 * 60 * 1000);
                  let bufferedSeconds = bufferedMillis / 1000;
                   hours = Math.floor(bufferedSeconds / 3600);
                  let remainingSeconds = bufferedSeconds % 3600 ;
                   minutes = remainingSeconds / 60;
                  }else {
                   hours = parseInt(duration.asHours());
                   minutes = parseInt(duration.asMinutes())%60;
                  }

                  totalTime = hours + ' hr ' + minutes + ' min '
               }

               let istInTime =  moment.utc(inTime).local().format('YYYY-MM-DD HH:mm:ss');
               let istOutTime =  '--'
               if(outTime !== 'N/A')
                 istOutTime=moment.utc(outTime).local().format('YYYY-MM-DD HH:mm:ss');


                  i++;
                    reportData.push( {
                    serialNo : i,
                    manpowerId : employeeId,
                    name :  employeeAttendaceObj.name,
                    numberOfPersons : employeeAttendaceObj.numberOfPersons,
                    shift : employeeAttendaceObj.shift,
                    inTime : inTime,
                    outTime : outTime,
                    totalTime : totalTime
                  });

                    return <TableRow key={index} style={employeeAttendaceObj.paymentType == 'Daily payment' ?
                    {backgroundColor : '#C6D2E3'} : employeeAttendaceObj.paymentType == 'Jattu-Daily payment' ?
                    {backgroundColor: '#eeeeee'}: employeeAttendaceObj.paymentType == 'Weekly payment' ?
                    {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>

                    <td>{i}</td>
                    <td>{dateVal}</td>
                    <td>{employeeAttendaceObj.shift}</td>
                    <td>{employeeAttendaceObj.in}</td>
                    <td>{outTime}</td>
                    <td>{totalTime}</td>
                    </TableRow>
                  }

           })
         }

         </tbody>
     </Table>
     </div>)
   })
   returnObj['tablesArray'] = tablesArray;
   returnObj['reportData'] = reportData;
   returnObj['summary'] = {
     dailyMaleDayShift,
     dailyMaleNightShift,
     dailyFemaleDayShift,
     dailyFemaleNightShift,
     weeklyMaleDayShift,
     weeklyMaleNightShift,
     weeklyFemaleDayShift,
     weeklyFemaleNightShift
   };
   return returnObj;
 }

 renderNoDataText() {
   return (
     <h1 style={{marginTop:40, marginLeft: 400}}>No data Existed!</h1>
   )
 }

  showEmployeeReportsTable() {

    const { response,
            startDate,
            endDate,
            paymentType,
            shift,
            shiftSelected,
            paymentTypeSelected, employeeVsDate, allEmployees } = this.state;

    let tablesObj = this.getTablesArray(false);
    if(!tablesObj)
    return null;
    let ob = [{
      start : startDate,
      end : endDate
    }]
    return (

      <div className='table' style={{marginTop: 40}}>
      {
        tablesObj['tablesArray'].length == 0 ? null :
        <div>
        <div>
          <h3 style={{marginLeft: 20,marginBottom: 20, color: '#865CD6'}}>Number of Employees : { tablesObj['tablesArray'].length }</h3>
        </div>
        <div style={{float : 'right'}}>
        {
          /*
          <Workbook  filename="report.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '10px', marginRight: '15px'}}  primary={true} icon={<DownloadIcon />}  href="#" label="Excel Report" />}>
            <Workbook.Sheet data={tablesObj['reportData']} name="Sheet 1">
                <Workbook.Column label="Serial No" value="serialNo"/>
                <Workbook.Column label="MPId" value="serialNo"/>
                <Workbook.Column label="Name" value="name"/>
                <Workbook.Column label="Number Of Persons" value="numberOfPersons"/>
                <Workbook.Column label="Shift" value="shift"/>
                <Workbook.Column label="In Time" value="inTime"/>
                <Workbook.Column label="Out Time" value="outTime"/>
                <Workbook.Column label="Total Time" value="totalTime"/>
            </Workbook.Sheet>
            <Workbook.Sheet  data={ob} name="Information">
                <Workbook.Column label="Start Date" value="start"/>
                <Workbook.Column label="End Date" value="end"/>
            </Workbook.Sheet>
          </Workbook>
          */
        }
          <Button icon={<PrintIcon />} label='Print' fill={true}
          onClick={this.attendancePrintTableData.bind(this)}
          primary={true} style={{marginRight: '13px'}}
          href='#'/>
          </div>
        </div>
      }
      <div style={{marginTop : 80}}>
      {tablesObj['tablesArray'].length == 0 ? this.renderNoDataText() : tablesObj['tablesArray']}
      </div>
      </div>
    )

  }

  onSearchEntry(e) {
  //  this.setState({selectedEmployeeData: {}})

    let filtered = [];
    let  options  = this.state.employeeSuggestions;
    let exactMatch = false;

    if(!options)
      return ;

    if(e.target.value == '') {
      filtered = options
      this.setState({response : null,
      selectedEmployeeId : null,
      employeeSelected : false,
      selectedEmployeeData : null
    })
    }
    else {
      options.forEach((opt) => {
        if(opt.label && opt.label.toUpperCase().startsWith(e.target.value.toUpperCase()))
          filtered.push(opt)
        else if(opt.employeeId && opt.employeeId.toUpperCase().startsWith(e.target.value.toUpperCase())) {
          filtered.push(opt);
          if(opt.employeeId.toUpperCase() == e.target.value.toUpperCase())
            exactMatch = true;
        }
      })
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
     }
   );
  }

  fetchSearchedEmployee() {
    const { selectedEmployeeId } = this.state;
    getEmployeeAttendanceDates(selectedEmployeeId).then((snap) => {
      const selectedEmployeeData = snap.val();
      this.setState({
        selectedEmployeeData
      });
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

  employeewiseSearchField() {
    const { villageOpt } = this.state;
    return (
      <div style={{marginLeft: 20, marginTop: 15}}>
      <Search placeHolder='Search By Name or Barcode' style={{width:'300px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
      </div>
    )
  }


  searchField() {
    const { villageOpt } = this.state;
    return (
      <div>
      <div style={{width: 300}}>
      <FormField label='Select Village' style={{marginLeft:20}}>
          <Select
            placeHolder='Village'
            options={villageOpt}
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
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
      </div>
      </div>
    )
  }

  renderSearchField() {
    return (
      <div style={{marginLeft:'20px'}}>
      <Box direction='row'
        justify='center'
        align='center'
        wrap={true}
        pad='medium'
        margin='small'
        colorIndex='light-2'
      >
      <p style={{margin : '20px'}}>Select Employee</p>
      { this.employeewiseSearchField() }
      </Box>
      </div>
    );
  }

  renderEmployeeAttendanceTable() {
    const { selectedEmployeeData, selectedEmployeeId } = this.state;

    if(selectedEmployeeData) {
      return (
        <div className='employeeTable'>
        <Table scrollable={true} style={{marginTop : '30px', marginLeft : '40px'}}>
            <thead style={{position:'relative'}}>
             <tr>
               <th>S No.</th>
               <th>Date</th>
               <th>In Time</th>
               <th>Out Time</th>
               <th>Total Time Spent</th>
             </tr>
            </thead>
            <tbody>
              {
                Object.keys(selectedEmployeeData).map((key, index) => {
                  let totalNumberOfdays = 0;
                  const employeeAttendaceObj = selectedEmployeeData[key];
                  if(employeeAttendaceObj !== null)
                  {
                  let inTime = employeeAttendaceObj.in;
                  let outTime = employeeAttendaceObj.out;
                  let totalTime = 'N/A';

                  if(outTime && inTime) {
                    totalNumberOfdays++;
                    let startTime = moment(inTime, "HH:mm a");
                    let endTime=moment(outTime, "HH:mm a");
                    let duration = moment.duration(endTime.diff(startTime));

                    let hours = 0, minutes =0;
                    if(duration.asMilliseconds() < 0) {
                     let dMillis = duration.asMilliseconds();
                     let bufferedMillis = dMillis + (24 * 60 * 60 * 1000);
                     let bufferedSeconds = bufferedMillis / 1000;
                      hours = Math.floor(bufferedSeconds / 3600);
                     let remainingSeconds = bufferedSeconds % 3600 ;
                      minutes = remainingSeconds / 60;
                     }else {
                      hours = parseInt(duration.asHours());
                      minutes = parseInt(duration.asMinutes())%60;
                     }

                     totalTime = hours + ' hr ' + minutes + ' min '
                  }
                  return <TableRow key={index}>
                  <td>{index+1}</td>
                  <td>{key}</td>
                  <td>{inTime}</td>
                  <td>{outTime}</td>
                  <td>{totalTime}</td>
                  </TableRow>
                }
                })
              }
            </tbody>
        </Table>
        </div>
      );
    }
  }


renderActivityIndicator() {
  const { loading } = this.state;
    return (

      <div style={{display: 'flex', justifyContent: 'center', marginTop:10}}>
      <RingLoader
            sizeUnit={"px"}
            size={100}
            color={'#865CD6'}
            loading={this.state.loading}
          />
      </div>
    )
}

  render() {
      return (
        <div>
        <Tabs>
        <Tab title='Attendance Slip'>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
        { this.renderActivityIndicator() }
        { this.showEmployeeReportsTable() }
        { this.printPdf() }
        { this.attendancePrint() }
        </Tab>
        <Tab title='Datewise'>
        { this.renderValidationMsg() }
        { this.renderInputFields() }
        { this.renderActivityIndicator() }
        { this.showOldEmployeeReportsTable() }
        { this.emailReportDialog() }
        { this.renderAbstractTable() }
        </Tab>
        <Tab title='Employeewise'>
        { this.renderSearchField() }
        { this.renderEmployeeAttendanceTable() }
        </Tab>
        </Tabs>
        </div>
      )
    }
}

export default Reports;
