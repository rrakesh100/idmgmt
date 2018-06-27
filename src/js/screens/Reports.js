import React, { Component, Fragment } from 'react';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import DateTime from 'grommet/components/DateTime';
import Button from 'grommet/components/Button';
import Layer from 'grommet/components/Layer';
import Paragraph from 'grommet/components/Paragraph';
import Heading from 'grommet/components/Heading';
import Article from 'grommet/components/Article';
import moment from 'moment';
import Header from 'grommet/components/Header';
import * as firebase from 'firebase';
import { getVisitors } from '../api/visitors';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Box from 'grommet/components/Box';
import ReactExport from "react-data-export";
import Workbook from 'react-excel-workbook';
import DownloadIcon from 'grommet/components/icons/base/Download';
import CheckBox from 'grommet/components/CheckBox';



class Reports extends Component {
  constructor(props) {
    super(props);
    this.state={
      startDate:'',
      endDate:'',
      enableCheckBox: true,
      showallChecked : true
    }
  }

  componentDidMount() {

  }

  getVisitorAttendanceData(endDate) {
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
    console.log(datesArr)

    let returnObj = {};
    const dbRef = firebase.database().ref('daywiseVisitors/');
    Promise.all(
      datesArr.map((date) => {
        return dbRef.child(date).once('value').then((snapshot) => {
          let response = snapshot.val();
          returnObj[date] = response;

        })
      })
    ).then(() => {
      this.setState({
        response: returnObj,
        enableCheckBox : false
      })
    })
  }

  onStartDateChange(e) {
    let startDate = e.replace(/\//g, '-');
    this.setState({startDate})

  }

  onEndDateChange(e) {
    let endDate = e.replace(/\//g, '-');

    this.setState({endDate}, this.getVisitorAttendanceData(endDate))
  }



  showVisitorReportsTable() {
    const { response, departedChecked, enteredChecked,showallChecked , startDate,
    endDate} = this.state;
    if(!response)
    return null;
    let tablesArray = [];

    let reportData = [];

    Object.keys(response).map((date, index) => {
      const attendanceObj = response[date];
      if(attendanceObj == null)
        return;
      let i = 0;
      tablesArray.push(<div className='tablesArray' key={index}>
      <h2 style={{marginLeft : '20px'}}>{date}</h2>
      <Table scrollable={true} style={{marginTop : '30px', marginLeft : '40px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Name</th>
             <th>Whom To Meet</th>
             <th>Purpose</th>
             <th>Mobile</th>
             <th>Coming From</th>
             <th>In Time</th>
             <th>Out Time</th>
             <th>Total Time Spent</th>
           </tr>
          </thead>
          <tbody>
            {
                Object.keys(attendanceObj).map((key,index)=> {
                  const visitorAttendaceObj = attendanceObj[key];
                  let inTime = visitorAttendaceObj.inTime;
                  let outTime = visitorAttendaceObj.outTime || 'N/A';
                  let totalTime = 'N/A';

                  if(inTime && outTime !=='N/A') {

                    let startTime=moment(inTime, "YYYY-MM-DD HH:mm:ss");
                    let endTime=moment(outTime, "YYYY-MM-DD HH:mm:ss");
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
                  date : date,
                  serialNo : index + 1,
                  barCode : key,
                  name :  visitorAttendaceObj.name,
                  whomToMeet : visitorAttendaceObj.whomToMeet,
                  purpose : visitorAttendaceObj.purpose,
                  mobile:  visitorAttendaceObj.mobile,
                  comingFrom : visitorAttendaceObj.comingFrom,
                  department : visitorAttendaceObj.department,
                  company : visitorAttendaceObj.company,
                  remarks : visitorAttendaceObj.remarks || visitorAttendaceObj.info,
                  metRequiredPerson : visitorAttendaceObj.metRequiredPerson,
                  inTime : istInTime,
                  outTime : istOutTime,
                  totalTime : totalTime
                });

                if(departedChecked && visitorAttendaceObj.status === 'DEPARTED'
                   || enteredChecked && visitorAttendaceObj.status === 'ENTERED'
                   || showallChecked) {
                     i++;
                    return <TableRow key={index}>
                    <td>{i}</td>
                    <td>{visitorAttendaceObj.name}</td>
                    <td>{visitorAttendaceObj.whomToMeet}</td>
                    <td>{visitorAttendaceObj.purpose}</td>
                    <td>{visitorAttendaceObj.mobile}</td>
                    <td>{visitorAttendaceObj.comingFrom}</td>
                    <td>{istInTime}</td>
                    <td>{istOutTime}</td>
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
              <Workbook.Column label="Date" value="date"/>
              <Workbook.Column label="Serial No" value="serialNo"/>
              <Workbook.Column label="Visitor Name" value="name"/>
              <Workbook.Column label="Whom To Meet" value="whomToMeet"/>
              <Workbook.Column label="Purpose Of Visit" value="purpose"/>
              <Workbook.Column label="Mobile#" value="mobile"/>
              <Workbook.Column label="Coming From" value="comingFrom"/>
              <Workbook.Column label="Department" value="department"/>
              <Workbook.Column label="Company" value="company"/>
              <Workbook.Column label="Remarks" value="remarks"/>
              <Workbook.Column label="Met Required Person" value="metRequiredPerson"/>
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

  onDepartedBoxChange() {
    this.setState({
      departedChecked: true,
      enteredChecked: false,
      showallChecked: false
    })
  }

  onEnteredBoxChange() {
    this.setState({
      enteredChecked: true,
      departedChecked: false,
      showallChecked: false
    })
  }

  onShowAllBoxChange() {
    this.setState({
      showallChecked: true,
      enteredChecked: false,
      departedChecked: false
    })
  }

  renderCheckBox() {
    const { enableCheckBox, departedChecked, enteredChecked, showallChecked } = this.state;

    return (
      <div style={{marginLeft:'320px'}}>
      <CheckBox label='DEPARTED'
      checked={departedChecked && true}
      disabled= {enableCheckBox && true}
      onChange={this.onDepartedBoxChange.bind(this)}
      />
      <CheckBox label='ENTERED'
      checked={enteredChecked && true}
      disabled={enableCheckBox && true}
      onChange={this.onEnteredBoxChange.bind(this)}
      />
      <CheckBox label='SHOW ALL'
      checked={showallChecked && true}
      disabled={enableCheckBox && true}
      onChange={this.onShowAllBoxChange.bind(this)}
      />
      </div>
    )
  }

  render() {

      return (
        <Article>

        { this.renderDateFields() }
        { this.renderCheckBox() }
        { this.showVisitorReportsTable() }


        </Article>

      )
    }
}

export default Reports;
