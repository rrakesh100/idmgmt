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




class Reports extends Component {
  constructor(props) {
    super(props);
    this.state={
      startDate:'',
      endDate:''
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
          console.log(response);
          returnObj[date] = response;

        })
      })
    ).then(() => {
      console.log(returnObj);
      this.setState({response: returnObj})
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

  onSavingPDF() {
    console.log("PDF LOG")
    const ExcelFile = ReactExport.ExcelFile;
    const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
    const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

    const dataSet1 = [
        {
            name: "Johson",
            amount: 30000,
            sex: 'M',
            is_married: true
        },
        {
            name: "Monika",
            amount: 355000,
            sex: 'F',
            is_married: false
        },
        {
            name: "John",
            amount: 250000,
            sex: 'M',
            is_married: false
        },
        {
            name: "Josef",
            amount: 450500,
            sex: 'M',
            is_married: true
        }
    ];

    const dataSet2 = [
        {
            name: "Johnson",
            total: 25,
            remainig: 16
        },
        {
            name: "Josef",
            total: 25,
            remainig: 7
        }
    ];
    return (
        <ExcelFile element={<button>Download Data</button>}>
            <ExcelSheet data={dataSet1} name="Employees">
                <ExcelColumn label="Name" value="name"/>
                <ExcelColumn label="Wallet Money" value="amount"/>
                <ExcelColumn label="Gender" value="sex"/>
                <ExcelColumn label="Marital Status"
                             value={(col) => col.is_married ? "Married" : "Single"}/>
            </ExcelSheet>
            <ExcelSheet data={dataSet2} name="Leaves">
                <ExcelColumn label="Name" value="name"/>
                <ExcelColumn label="Total Leaves" value="total"/>
                <ExcelColumn label="Remaining Leaves" value="remaining"/>
            </ExcelSheet>
        </ExcelFile>
    );
  }

  showVisitorReportsTable() {
    const {response} = this.state;
    if(!response)
    return null;
    let tablesArray = [];

    let reportData = [];

    Object.keys(response).map((date, index) => {
      const attendanceObj = response[date];
      if(attendanceObj == null)
        return;
      tablesArray.push(<div className='tablesArray' key={index}>
      <h2 style={{marginLeft : '20px'}}>{date}</h2>
      <Table scrollable={true} style={{marginTop : '30px', marginLeft : '40px'}}>
          <thead style={{position:'relative'}}>
           <tr>
             <th>S No.</th>
             <th>Barcode</th>
             <th>Name</th>
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
                  let outTime = visitorAttendaceObj.outTime;
                  let totalTime = 'N/A';

                  if(inTime && outTime) {
                    console.log('^^^^', inTime);
                    console.log('@@@@', outTime);

                    let startTime=moment(inTime, "YYYY-MM-DD HH:mm:ss");
                    let endTime=moment(outTime, "YYYY-MM-DD HH:mm:ss");
                    let duration = moment.duration(endTime.diff(startTime));
                    console.log('####', duration);
                    let hours = parseInt(duration.asHours());
                    let minutes = parseInt(duration.asMinutes())%60;
                    totalTime = hours + ' hr ' + minutes + ' min '

                  }

                let istInTime =  moment.utc(inTime).local().format('YYYY-MM-DD HH:mm:ss');
                let istOutTime =  moment.utc(outTime).local().format('YYYY-MM-DD HH:mm:ss');


                reportData.push({
                  date : date,
                  serialNo : index + 1,
                  barCode : key,
                  name :  visitorAttendaceObj.name,
                  inTime : istInTime,
                  outTime : istOutTime,
                  totalTime : totalTime
                });

                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{key}</td>
                <td>{visitorAttendaceObj.name}</td>
                <td>{istInTime}</td>
                <td>{istOutTime}</td>
                <td>{totalTime}</td>
                </TableRow>
              })
            }
          </tbody>
      </Table>

      </div>)

    })
    return (
      <div className='table'>
      <div style={{float : 'right'}}>
        <Workbook  filename="example.xlsx" element={<Button style={{marginLeft : '50px', marginBottom : '40px'}}  primary="true" icon={<DownloadIcon />}  href="#" label="Download" />}>
          <Workbook.Sheet data={reportData} name="Sheet 1">
              <Workbook.Column label="Date" value="date"/>
              <Workbook.Column label="Serial No" value="serialNo"/>
              <Workbook.Column label="Barcode" value="barCode"/>
              <Workbook.Column label="Name" value="name"/>
              <Workbook.Column label="In Time" value="inTime"/>
              <Workbook.Column label="Out Time" value="outTime"/>
              <Workbook.Column label="Total Time" value="totalTime"/>
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

  render() {

      return (
        <Article>

        { this.renderDateFields() }
        <div style={{marginTop:'30px'}}>
        { this.showVisitorReportsTable() }
        </div>

        </Article>

      )
    }
}

export default Reports;
