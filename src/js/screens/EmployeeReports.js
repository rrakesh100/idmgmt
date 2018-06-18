import React, { Component, Fragment } from 'react';
import { getEmployees, getEmployee } from '../api/employees';
import { attendanceDatesLoop } from '../api/attendance';
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



class Reports extends Component {
  constructor(props) {
    super(props);
    this.state ={
      startDate:'',
      endDate:''
    }
  }

  componentDidMount() {

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
    console.log(datesArr)

    let returnObj = {};
    const dbRef = firebase.database().ref('attendance/');
    Promise.all(
      datesArr.map((date) => {
        return dbRef.child('dates').child(date).once('value').then((snapshot) => {
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

    this.setState({endDate},this.attendanceDatesLoop(endDate))
  }

renderDateFields() {

  return (
    <div style={{marginLeft:'20px'}}>
    <div style={{marginTop:'20px'}}>
    <Form>
      <FormField>
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onStartDateChange.bind(this)}
        value={this.state.startDate}
        />
      </FormField>
    </Form>
    </div>
    <div style={{marginTop:'20px'}}>
    <Form>
      <FormField>
        <DateTime id='id'
        format='D/M/YYYY'
        name='name'
        onChange={this.onEndDateChange.bind(this)}
        value={this.state.endDate}
        />
      </FormField>
    </Form>
    </div>
    </div>
  )
}

  showEmployeeReportsTable() {
    const {response} = this.state;
    if(!response)
    return null;
    let tablesArray = [];
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
                  const employeeAttendaceObj = attendanceObj[key];
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



                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{key}</td>
                <td>{employeeAttendaceObj.name}</td>
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
    return (
      <div className='table'>
      {tablesArray}
      </div>
    )
  }


  render() {
    const {response} = this.state;

      return (
        <Article>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
        <Heading margin='none' strong={true}>
        Employee Reports
        </Heading>
        </Header>
        { this.renderDateFields() }
        <div style={{marginTop:'30px'}}>
        { this.showEmployeeReportsTable() }
        </div>
        </Article>
      )
    }
}

export default Reports;
