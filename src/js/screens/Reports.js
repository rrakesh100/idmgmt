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

  showVisitorReportsTable() {
    const {response} = this.state;
    if(!response)
    return null;
    let tablesArray = [];
    Object.keys(response).map((date, index) => {
      const attendanceObj = response[date];
      tablesArray.push(<div className='tablesArray' key={index}>
      <h2>{date}</h2>
      <Table scrollable={true} style={{marginTop : '30px'}}>
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

                  let startTime=moment(inTime, "HH:mm a");
                  console.log(startTime)
                  let endTime=moment(outTime, "HH:mm a");
                  console.log(endTime)
                  let duration = moment.duration(endTime.diff(startTime));
                  console.log(duration)
                  let hours = parseInt(duration.asHours());
                  console.log(hours)
                  let minutes = parseInt(duration.asMinutes())%60;
                  console.log(minutes)

                return <TableRow key={index}>
                <td>{index+1}</td>
                <td>{key}</td>
                <td>{visitorAttendaceObj.name}</td>
                <td>{visitorAttendaceObj.inTime}</td>
                <td>{visitorAttendaceObj.outTime}</td>
                <td>{hours + ' hr ' + minutes + ' min '}</td>


                </TableRow>
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

  render() {

      return (
        <Article>
        <Header
          direction='row'
          justify='between'
          size='large'
          pad={{ horizontal: 'medium', between: 'small' }}
        >
        <Heading margin='none' strong={true}>
        Visitor Reports
        </Heading>
        </Header>
        { this.renderDateFields() }
        <div style={{marginTop:'30px'}}>
        { this.showVisitorReportsTable() }
        </div>
        </Article>

      )
    }
}

export default Reports;
