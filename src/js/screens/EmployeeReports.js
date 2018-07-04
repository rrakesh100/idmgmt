import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop, getEmployeeAttendanceDates } from '../api/attendance';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
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
import Workbook from 'react-excel-workbook';
import DownloadIcon from 'grommet/components/icons/base/Download';
import Button from 'grommet/components/Button';



class Reports extends Component {
  constructor(props) {
    super(props);
    this.state ={
      startDate:'',
      endDate:''
    }
  }

  componentDidMount() {
    getEmployees()
      .then((snap) => {
        const data = snap.val();
        if (!data) {
          return;
        }
        let suggests = [];
        Object.keys(data).forEach((employee) => {
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


  attendanceDatesLoop(endDate) {

    const {startDate} = this.state;

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
    const dbRef = firebase.database().ref('attendance/');
    Promise.all(
      datesArr.map((date) => {
        return dbRef.child('dates').child(date).once('value').then((snapshot) => {
          let response = snapshot.val();
          returnObj[date] = response;

        })
      })
    ).then(() => {
      this.setState({response: returnObj})
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

renderDateFields() {

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
    </Box>
    </div>
  )
}

  showEmployeeReportsTable() {
    const {response,startDate,endDate} = this.state;
    if(!response)
    return null;
    let tablesArray = [];

    let reportData = [];
    Object.keys(response).map((attendance, index) => {
      const attendanceObj = response[attendance];
      if(attendanceObj ==null)
        return;
      tablesArray.push(<div className='tablesArray' key={index}>
      <h2 style={{marginLeft : '20px'}}>{attendance}</h2>
      <Table scrollable={true} style={{marginTop : '30px', marginLeft : '30px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Manpower Id</th>
             <th>Name</th>
             <th>Payment Type</th>
             <th>In Time</th>
             <th>Out Time</th>
             <th>Total Time Spent</th>
           </tr>
          </thead>
          <tbody>
            {
                Object.keys(attendanceObj).map((key,index)=> {
                  const employeeAttendaceObj = attendanceObj[key];
                  console.log(employeeAttendaceObj)
                  console.log(key)
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
                    totalTime = hours + ' hr ' + minutes + ' min '
                  }

                  let istInTime =  moment.utc(inTime).local().format('YYYY-MM-DD HH:mm:ss');

                  let istOutTime =  '--'
                  if(outTime !== 'N/A')
                    istOutTime=moment.utc(outTime).local().format('YYYY-MM-DD HH:mm:ss');

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

                return <TableRow key={index} style={employeeAttendaceObj.paymentType == 'Daily payment' ?
                {backgroundColor : '#C6D2E3'} : employeeAttendaceObj.paymentType == 'Jattu-Daily payment' ?
                {backgroundColor: '#eeeeee'}: employeeAttendaceObj.paymentType == 'Weekly payment' ?
                {backgroundColor: '#9E9E9E'}: {backgroundColor: 'white'}}>
                <td>{index+1}</td>
                <td>{key}</td>
                <td>{employeeAttendaceObj.name}</td>
                <td>{employeeAttendaceObj.paymentType}</td>
                <td>{employeeAttendaceObj.in}</td>
                <td>{employeeAttendaceObj.out}</td>
                <td>{totalTime}</td>


                </TableRow>
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
        <Workbook  filename="report.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '40px'}}  primary="true" icon={<DownloadIcon />}  href="#" label="Download" />}>
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

      </div>
      {tablesArray}
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
        pad='small'
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
                  console.log(employeeAttendaceObj)
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
    const {response} = this.state;

      return (
        <Article>

        <Tabs>
        <Tab title='Datewise'>
        { this.renderDateFields() }
        { this.showEmployeeReportsTable() }
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
