import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop, getEmployeeAttendanceDates, saveEmailReport } from '../api/attendance';
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
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import TextInput from 'grommet/components/TextInput';
import Layer from 'grommet/components/Layer';
import Workbook from 'react-excel-workbook';
import DownloadIcon from 'grommet/components/icons/base/Download';
import PrintIcon from 'grommet/components/icons/base/Print';
import Button from 'grommet/components/Button';
import { Container, Row, Col } from 'react-grid-system';
import { getShifts } from '../api/configuration';
import { Print } from 'react-easy-print';
import axios from 'axios';

const uniqid = require('uniqid');

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate:'',
      endDate:'',
      paymentType: '',
      shift: '',
      printTableSelected: false,
      numPages: null,
      pageNumber: 1,
      emailReport: false
    }
  }

  componentDidMount() {
     this.getEmployees()
     this.getShifts()
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
          employeeSuggestions: suggests,
          filteredSuggestions: suggests,
          allEmployees : data
        });
      })
      .catch((err) => {
        console.error('VISITOR FETCH FAILED', err);
      });
  }


  attendanceDatesLoop(endDate) {
    const { startDate, unit } = this.state;


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
    console.log(unitVal);
    const dbRef = firebase.database().ref(`${unitVal}/attendance/`);
    console.log(dbRef);
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
            Object.keys(attObj).map((empId, k) => {
              let existingData  = employeeVsDate[empId] || [];
              let newData = {
                date : date,
                value :  attObj[empId]
              }
              existingData.push(newData);
              employeeVsDate[empId] = existingData;
            })
        });
        this.setState({
            response: returnObj,
            employeeVsDate
           });
    })

  }

  onUnitFieldChange(fieldName, e) {
    this.setState({
      [fieldName] : e.option
    })
  }

  onStartDateChange(e) {
    let startDate = e.replace(/\//g, '-');
    this.setState({startDate})
  }

  onEndDateChange(e) {
    let endDate = e.replace(/\//g, '-');
    this.setState({endDate},this.attendanceDatesLoop(endDate))
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

renderInputFields() {

  const { shiftOpt } = this.state;

  return (
    <div style={{marginLeft:'20px'}}>
    <Box direction='row'
      justify='start'
      align='center'
      wrap={true}
      pad='medium'
      margin='small'
      colorIndex='light-2'
    >
    <p style={{marginLeft : '40px'}}>Select Unit</p>
      <Select
        placeHolder='Payment Type'
        options={['UNIT1','UNIT2','UNIT3','UNIT4', ]}
        value={this.state.unit}
        onChange={this.onUnitFieldChange.bind(this, 'unit')}
      />
    <p style={{marginLeft : '40px'}}>Select Start Date</p>
    <DateTime id='id' style={{marginLeft : '20px'}}
    format='D/M/YYYY'
    name='name'
    onChange={this.onStartDateChange.bind(this)}
    value={this.state.startDate}
    />
    <p style={{marginLeft : '40px'}}>Select End Date</p>
    <DateTime id='id' style={{marginLeft : '20px'}}
    format='D/M/YYYY'
    name='name'
    onChange={this.onEndDateChange.bind(this)}
    value={this.state.endDate}
    />
    <p style={{marginLeft : '40px'}}>Select Payment Type</p>
      <Select
        placeHolder='Payment Type'
        options={['-EMPTY-', 'Daily payment', 'Weekly payment', 'Jattu-Daily payment']}
        value={this.state.paymentType}
        onChange={this.onPaymentFieldChange.bind(this, 'paymentType')}
      />
      <p style={{marginLeft : '40px', marginRight: '50px'}}>Select Shift</p>
        <Select
          placeHolder='Shift'
          options={shiftOpt}
          value={this.state.shift}
          onChange={this.onShiftFieldChange.bind(this, 'shift')}
        />
    </Box>
    </div>
  )
}

  printTableData() {
    this.setState({
      printTableSelected: true
    })
  }

  setTimeoutFunc() {
    setTimeout(() => window.print(), 4000)
  }

  print() {
    if(this.state.printTableSelected) {
      this.setState({
        printTableSelected: false
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
      emailReport: false
    })
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
           paymentTypeSelected } = this.state;


   if(!response)
   return null;

   //const pdfDoc = this.renderPDFDoc(response);

   let tablesArray = [];
   let reportData = [];

   Object.keys(response).map((date, index) => {
     const attendanceObj = response[date];
     if(attendanceObj ==null)
       return;
     tablesArray.push(<div className='tablesArray' key={index}>
     <h2 style={{marginLeft : '20px'}}>{date}</h2>
     <Table scrollable={true} style={{marginTop : '30px', marginLeft : '30px'}}>
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
                   let hours = parseInt(duration.asHours());
                   let minutes = parseInt(duration.asMinutes())%60;
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
     <div className='table'>

     <div style={{float : 'right'}}>
       <Workbook  filename="report.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '10px', marginRight: '15px'}}  primary={true} icon={<DownloadIcon />}  href="#" label="Download" />}>
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
       <Button icon={<PrintIcon />} label='Print' fill={true}
       onClick={this.printTableData.bind(this)}
       primary={true} style={{marginRight: '13px'}}
       href='#'/>
       <Button icon={<PrintIcon />} label='Email Report' fill={true}
       onClick={this.onEmailReportClick.bind(this)}
       primary={true} style={{marginRight: '13px'}}
       href='#'/>
       <div>

       </div>
     </div>
     {tablesArray}
     </div>
   )
 }

 printPdf() {
     if(this.state.printTableSelected) {
       const { response, paymentTypeSelected, shiftSelected, paymentType, shift, startDate, endDate, employeeVsDate, allEmployees } = this.state;

       let tablesObj = this.getTablesArray(true);
       if(!tablesObj)
       return null;
     return(
       <Print name='bizCard' exclusive>
          <div>
            <div style={{height:'1200px'}}>
              <h2 style={{fontWeight: 'bold', marginLeft: '150px'}}>SRI LALITHA ENTERPRISES INDUSTRIES PVT LTD</h2>
              <h3 style={{marginLeft: '180px'}}>Unit-2, Valuthimmapuram Road, Peddapuram</h3>
              <h3>Man power report from {startDate} to {endDate}</h3>
              <h3 style={{fontWeight:'bold'}}>{paymentType}, {shift}</h3>
            </div>
            <div>
            {tablesObj['tablesArray']}
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
           shiftSelected,
           paymentTypeSelected, employeeVsDate, allEmployees } = this.state;

   if(!response)
   return null;

   //const pdfDoc = this.renderPDFDoc(response);

   let tablesArray = [];
   let reportData = [];
   let returnObj = {};
   let idVsName= [];

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




   idVsName.map((idNameObj, index) => {
     let employeeId = idNameObj['id'];

     const attendanceObjArray = employeeVsDate[employeeId];
     let empAttObj = allEmployees[employeeId];
     if(attendanceObjArray ==null)
       return;
       let i = 0;


       let isValid = true;

       if(paymentTypeSelected && paymentType !== empAttObj.paymentType) {
         isValid = false;
       }

       if(shiftSelected && shift !== empAttObj.shift) {
         isValid = false;
       }

       if(!isValid)
         return;

       let uniqId = uniqid();
     tablesArray.push(<div className='tablesArray' key={uniqId} style={isPrint ? {height: 1100} : {}}>
     <h3 style={{marginLeft : '20px'}}>Name : {allEmployees[employeeId]['name']} ; ID : {employeeId}</h3>
         <h5 style={{marginLeft : '20px'}}>Gender : {allEmployees[employeeId]['gender']} ; Village : {allEmployees[employeeId]['village']}</h5>
     <Table scrollable={true} style={{marginTop : '30px', marginLeft : '30px'}}>
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
                 let startTime = moment(inTime, "HH:mm a");
                 let endTime=moment(outTime, "HH:mm a");
                 let duration = moment.duration(endTime.diff(startTime));
                 let hours = parseInt(duration.asHours());
                 let minutes = parseInt(duration.asMinutes())%60;
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
   return returnObj;
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
      <div className='table'>

      <div style={{float : 'right'}}>
        <Workbook  filename="report.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '10px', marginRight: '15px'}}  primary={true} icon={<DownloadIcon />}  href="#" label="Download" />}>
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
        <Button icon={<PrintIcon />} label='Print' fill={true}
        onClick={this.printTableData.bind(this)}
        primary={true} style={{marginRight: '13px'}}
        href='#'/>
        <Button icon={<PrintIcon />} label='Email Report' fill={true}
        onClick={this.onEmailReportClick.bind(this)}
        primary={true} style={{marginRight: '13px'}}
        href='#'/>
        <div>

        </div>
      </div>
      {tablesObj['tablesArray']}
      </div>
    )

  }

  onSearchEntry(e) {
    let filtered = [];
    let  options  = this.state.employeeSuggestions;
    if(e.target.value == '')
      filtered = options
    else {
      options.forEach((opt) => {
        if(opt.label.startsWith(e.target.value))
          filtered.push(opt)
        if(opt.employeeId.startsWith(e.target.value))
          filtered.push(opt)
      })
    }
    this.setState({
      employeeSearchString: e.target.value,
      filteredSuggestions: filtered
    });
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
        employeeSearchString: data.suggestion.label
      }, this.fetchSearchedEmployee.bind(this));
    } else {
      this.setState({
        selectedEmployeeId: data.target.value,
        employeeSearchString: data.suggestion
      }, this.fetchSearchedEmployee.bind(this));
    }
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
      <Search placeHolder='Search employee By Name or Barcode' style={{width:'600px'}}
        inline={true}
        iconAlign='start'
        size='small'
        suggestions={this.state.filteredSuggestions}
        value={this.state.employeeSearchString}
        onSelect={this.onEmployeeSelect.bind(this)}
        onDOMChange={this.onSearchEntry.bind(this)} />
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
                  const employeeAttendaceObj = selectedEmployeeData[key];
                  if(employeeAttendaceObj !== null)
                  {
                  let inTime = employeeAttendaceObj.in;
                  let outTime = employeeAttendaceObj.out;
                  let totalTime = 'N/A';
                  if(outTime && inTime) {
                    let startTime=moment(inTime, "HH:mm a");
                    let endTime=moment(outTime, "HH:mm a");
                    let duration = moment.duration(endTime.diff(startTime));
                    let hours = parseInt(duration.asHours());
                    let minutes = parseInt(duration.asMinutes())%60;
                    totalTime = hours + ' hr ' + minutes + ' min ';
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




  render() {
      return (
        <Article>

        <Tabs>
        <Tab title='Datewise'>
        { this.renderInputFields() }
        { this.showEmployeeReportsTable() }
        { this.printPdf() }
        { this.print() }
        { this.emailReportDialog() }
        </Tab>
        <Tab title='Attendance Slip'>
        { this.renderInputFields() }
        { this.showOldEmployeeReportsTable() }
        { this.printPdf() }
        { this.print() }
        { this.emailReportDialog() }
        </Tab>
        <Tab title='Employeewise'>
        { this.renderSearchField() }
        { this.renderEmployeeAttendanceTable() }
        </Tab>
        </Tabs>
        </Article>
      )
    }
}

export default Reports;
